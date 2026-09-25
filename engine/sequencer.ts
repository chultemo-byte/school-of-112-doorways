import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadDoor, seededDoors } from "./doors.ts";
import { buildScript } from "./script.ts";
import {
  assertProfile,
  doorIsClosedBind,
  evaluateGates,
  regressionDoor,
  scaleBreath,
  sessionIsBlocked,
  sessionIsHalted,
  usesOpenSeat,
  vbtIsObserveOnly,
} from "./safety.ts";
import type { Door, StudentProfile, TeachingSession } from "./types.ts";

/**
 * Default readiness: no pain, lotus not ready (open seat instead),
 * extreme VBT stays observe_only regardless of the flag below.
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
  const lines = reasons.map((gate) => gate.detail);
  return "Door " + door.number + " (" + door.english + ") is not taught. " + lines.join(" ");
}

function painMessage(door: Door | null): string {
  const regression = regressionDoor(door);
  const which = door ? " Door " + door.number + " stops." : " No door is selected.";
  const later = regression
    ? " Regression door, for a later session and not while pain is present: " + regression + " (Mountain)."
    : " Exit. There is no earlier door to regress to.";
  return "Pain is information. Pause, regress, or exit. Never push through." + which + later + " Practice is not medical treatment.";
}

/**
 * Choose a door for this profile and, when the laws allow, build the eight-beat script.
 * Pain halts with no script. A blocked door returns no script — lotus is not described as homework.
 */
export function teach(profile: StudentProfile, options: TeachOptions = {}): TeachingSession {
  assertProfile(profile);

  if (profile.pain && options.door === undefined) {
    const gates = [
      {
        law: "PAIN_IS_INFORMATION" as const,
        title: "Pain is information",
        passed: false,
        effect: "halt" as const,
        detail: "Pain is reported. No door is selected. Pause or exit. Never push through.",
      },
    ];
    return {
      status: "halt",
      profile,
      door: null,
      script: [],
      gates,
      message: painMessage(null),
      regression_door: null,
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
        regression_door: null,
        message: lotusWaiting
          ? "No seeded door is open under these laws. Door 112 remains on the record. Lotus is never forced; an open-seat twin is the way in when the other laws allow it."
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
      regression_door: regressionDoor(door),
      message: painMessage(door),
    };
  }

  if (sessionIsBlocked(gates)) {
    return {
      status: "blocked",
      profile,
      door,
      script: [],
      gates,
      regression_door: null,
      message: refusalMessage(door, gates),
    };
  }

  const openSeat = usesOpenSeat(profile, door);
  const script = buildScript(door, {
    openSeat,
    vbtObserveOnly: vbtIsObserveOnly(gates),
    breath: scaleBreath(door, profile),
  });

  const notes: string[] = [];
  if (openSeat) {
    notes.push("the closed bind is not entered; the open-seat twin is the figure");
  } else if (doorIsClosedBind(door)) {
    notes.push("lotus may be described and is never forced");
  }
  if (vbtIsObserveOnly(gates)) {
    notes.push("the Adiyogi beat is historical or observe_only, not a class drill");
  }
  const suffix = notes.length > 0 ? " Marks: " + notes.join("; ") + "." : "";

  return {
    status: "teaching",
    profile,
    door,
    script,
    gates,
    regression_door: null,
    message:
      "Door " +
      door.number +
      " " +
      door.sanskrit +
      " (" +
      door.english +
      ") is open. School pairing: school_device." +
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
Default profile: no pain, lotus not ready (open-seat twin for door 112),
extreme VBT always observe_only, breath 3, intensity clearance 3, nothing completed.
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
