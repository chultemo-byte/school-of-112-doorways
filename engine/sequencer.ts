import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadDoor, seededDoors } from "./doors.ts";
import { buildScript } from "./script.ts";
import {
  assertProfile,
  doorRequiresLotus,
  evaluateGates,
  FIVE_HARD_LAWS,
  geometryIsObserveOnly,
  scaleBreath,
  sessionIsBlocked,
  sessionIsHalted,
  vbtIsObserveOnly,
} from "./safety.ts";
import type { Door, StudentProfile, TeachingSession } from "./types.ts";

/**
 * Default readiness: foundation work is open, cobra's house is just open,
 * lotus and extreme VBT are not.
 */
export const DEFAULT_PROFILE: StudentProfile = {
  pain: false,
  lotus_ready: false,
  vbt_observe_only: true,
  completed_doors: [],
  breath_capacity: 3,
  intensity_clearance: 3,
};

export interface TeachOptions {
  /** When set, consider this door. When omitted, choose the next open seeded door. */
  door?: number;
}

function doorCouldOpen(profile: StudentProfile, door: Door): boolean {
  if (profile.completed_doors.includes(door.number)) {
    return false;
  }
  const gates = evaluateGates(profile, door);
  if (sessionIsHalted(gates) || sessionIsBlocked(gates)) {
    return false;
  }
  return true;
}

function refusalMessage(door: Door, gates: TeachingSession["gates"]): string {
  const reasons = gates.filter((gate) => gate.effect === "halt" || gate.effect === "block");
  const lines = reasons.map((gate) => gate.title + ". " + gate.detail);
  return "Door " + door.number + " (" + door.english + ") does not open. " + lines.join(" ");
}

/**
 * Choose a door for this profile and, when the laws allow, build the eight-beat script.
 * Pain halts with no script. A blocked door returns no script — lotus is not described as homework.
 */
export function teach(profile: StudentProfile, options: TeachOptions = {}): TeachingSession {
  assertProfile(profile);

  if (profile.pain && options.door === undefined) {
    const law = FIVE_HARD_LAWS[0];
    return {
      status: "halt",
      profile,
      door: null,
      script: [],
      gates: [
        {
          law: law.id,
          title: law.title,
          passed: false,
          effect: "halt",
          detail: "Pain is reported. No door is selected.",
        },
      ],
      message: "Pain is a hard stop. The sequence does not continue. Rest. If pain persists, ask a person who can see you — a teacher in the room, or a clinician. This machine does not diagnose.",
    };
  }

  let door: Door;
  if (options.door !== undefined) {
    door = loadDoor(options.door);
  } else {
    const next = seededDoors()
      .map((entry) => loadDoor(entry.number))
      .find((candidate) => doorCouldOpen(profile, candidate));
    if (!next) {
      const waiting = seededDoors().filter((entry) => !profile.completed_doors.includes(entry.number));
      const lotusWaiting = waiting.some((entry) => entry.number === 112);
      return {
        status: "blocked",
        profile,
        door: null,
        script: [],
        gates: [],
        message: lotusWaiting
          ? "No seeded door is open. Door 112 remains, and it stays shut until lotus readiness and house clearance are both true. Lotus is never forced."
          : "No seeded door is open for this profile.",
      };
    }
    door = next;
  }

  const gates = evaluateGates(profile, door);

  if (sessionIsHalted(gates)) {
    return {
      status: "halt",
      profile,
      door: null,
      script: [],
      gates,
      message:
        "Pain is a hard stop. Door " +
        door.number +
        " is not taught. Rest. If pain persists, ask a person who can see you. This machine does not diagnose.",
    };
  }

  if (sessionIsBlocked(gates)) {
    return {
      status: "blocked",
      profile,
      door,
      script: [],
      gates,
      message: refusalMessage(door, gates),
    };
  }

  const script = buildScript(door, {
    geometryObserveOnly: geometryIsObserveOnly(gates),
    vbtObserveOnly: vbtIsObserveOnly(gates),
    breath: scaleBreath(door, profile),
  });

  const observes: string[] = [];
  if (geometryIsObserveOnly(gates)) {
    observes.push("geometry and orientation are observe_only because breath leads");
  }
  if (vbtIsObserveOnly(gates)) {
    observes.push("the Adiyogi beat is observe_only");
  }
  const suffix = observes.length > 0 ? " Marks: " + observes.join("; ") + "." : "";

  return {
    status: "teaching",
    profile,
    door,
    script,
    gates,
    message:
      "Door " +
      door.number +
      " " +
      door.sanskrit +
      " (" +
      door.english +
      ") is open." +
      (doorRequiresLotus(door) ? " Enter nothing that the knee refuses." : "") +
      suffix,
  };
}

function parseBoolean(value: string, flag: string): boolean {
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(flag + " expects true or false.");
}

export function profileFromArgs(argv: string[]): { profile: StudentProfile; door?: number; json: boolean } {
  const profile: StudentProfile = { ...DEFAULT_PROFILE, completed_doors: [] };
  let door: number | undefined;
  let json = false;

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    const next = argv[i + 1];
    const take = (flag: string): string => {
      if (next === undefined || next.startsWith("--")) {
        throw new Error(flag + " requires a value.");
      }
      i += 1;
      return next;
    };

    if (token === "--help" || token === "-h") {
      printHelp();
      process.exit(0);
    } else if (token === "--json") {
      json = true;
    } else if (token === "--door") {
      door = Number(take("--door"));
      if (!Number.isInteger(door)) {
        throw new Error("--door expects an integer from 1 to 112.");
      }
    } else if (token === "--profile") {
      const file = take("--profile");
      const loaded = JSON.parse(readFileSync(path.resolve(file), "utf8")) as StudentProfile;
      Object.assign(profile, loaded);
      profile.completed_doors = [...(loaded.completed_doors ?? [])];
    } else if (token === "--pain") {
      profile.pain = parseBoolean(take("--pain"), "--pain");
    } else if (token === "--lotus-ready") {
      profile.lotus_ready = parseBoolean(take("--lotus-ready"), "--lotus-ready");
    } else if (token === "--vbt-observe-only") {
      profile.vbt_observe_only = parseBoolean(take("--vbt-observe-only"), "--vbt-observe-only");
    } else if (token === "--breath-capacity") {
      profile.breath_capacity = Number(take("--breath-capacity"));
    } else if (token === "--intensity-clearance") {
      profile.intensity_clearance = Number(take("--intensity-clearance"));
    } else if (token === "--completed") {
      const raw = take("--completed");
      profile.completed_doors = raw === "" ? [] : raw.split(",").map((part) => Number(part.trim()));
    } else {
      throw new Error("Unknown argument: " + token);
    }
  }

  return { profile, door, json };
}

function printHelp(): void {
  console.log(`School of 112 Doorways

npm run teach -- --door 1
npm run teach -- --door 112 --profile profiles/lotus-cleared.json
npm run teach -- --json --door 1

Flags
  --door N                  Door number 1–112
  --profile PATH            Student readiness JSON
  --pain true|false
  --lotus-ready true|false
  --vbt-observe-only true|false
  --breath-capacity 1-5
  --intensity-clearance 1-5
  --completed 1,49          Comma-separated completed door numbers
  --json                    Print the session object
  --help

With no --door, the sequencer opens the next seeded door the laws allow.
Default profile: no pain, lotus not ready, extreme VBT observe_only,
breath 3, intensity clearance 3, nothing completed.
`);
}

export function formatSession(session: TeachingSession): string {
  const lines: string[] = [];
  lines.push("School of 112 Doorways");
  lines.push("status: " + session.status);
  lines.push(session.message);
  lines.push("");
  if (session.gates.length > 0) {
    lines.push("laws:");
    for (const gate of session.gates) {
      lines.push("  [" + gate.effect + "] " + gate.title + " — " + gate.detail);
    }
    lines.push("");
  }
  if (session.status === "teaching" && session.door && session.script.length > 0) {
    const door = session.door;
    lines.push("door " + door.number + "  " + door.sanskrit + " — " + door.english);
    lines.push("");
    for (const beat of session.script) {
      const observe = beat.observe_only ? "  (observe_only)" : "";
      const instrument = beat.instrument ? "  [" + beat.instrument + "]" : "";
      lines.push("beat " + beat.beat + "/8  " + beat.title + instrument + observe);
      lines.push("  " + beat.spoken);
      lines.push("");
    }
    lines.push("safety notes:");
    for (const note of door.safety_notes) {
      lines.push("  - " + note);
    }
    lines.push("");
    lines.push("five ways:");
    door.five_ways.forEach((way, index) => {
      lines.push("  " + (index + 1) + ". " + way);
    });
  }
  return lines.join("\n");
}

function isDirectRun(): boolean {
  const entry = process.argv[1];
  if (!entry) return false;
  const invoked = path.resolve(entry);
  const self = fileURLToPath(import.meta.url);
  return invoked === self;
}

function main(): void {
  try {
    const parsed = profileFromArgs(process.argv.slice(2));
    const session = teach(parsed.profile, { door: parsed.door });
    if (parsed.json) {
      console.log(JSON.stringify(session, null, 2));
    } else {
      console.log(formatSession(session));
    }
    if (session.status === "halt") {
      process.exitCode = 2;
    } else if (session.status === "blocked") {
      process.exitCode = 3;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = 1;
  }
}

if (isDirectRun()) {
  main();
}
