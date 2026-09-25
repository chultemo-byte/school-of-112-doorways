import type { Door, GateResult, PracticeMode, PrototypeDoor, SpokenBreath, StudentProfile } from "./types.ts";
import { doorNumber, isResearchDoor } from "./types.ts";

/**
 * Five hard laws. Wording matches the Chief of Staff master plan §3d and §5.
 * docs/YOGA-TEACHING-MACHINE-MASTER-PLAN.md is that plan, verbatim.
 * safety/rules.md is the same five laws in prose for the prototype.
 */

export const PAIN_IS_INFORMATION = "PAIN_IS_INFORMATION" as const;
export const LOTUS_IS_NEVER_FORCED = "LOTUS_IS_NEVER_FORCED" as const;
export const EXTREME_VBT_IS_OBSERVE_ONLY = "EXTREME_VBT_IS_OBSERVE_ONLY" as const;
export const PRACTICE_IS_NOT_MEDICINE = "PRACTICE_IS_NOT_MEDICINE" as const;
export const NO_DOORWAY_IS_OWNED = "NO_DOORWAY_IS_OWNED" as const;

export interface HardLaw {
  id: GateResult["law"];
  title: string;
  text: string;
}

export const FIVE_HARD_LAWS: readonly HardLaw[] = [
  {
    id: PAIN_IS_INFORMATION,
    title: "Pain is information",
    text: "Pain = information → pause, regress, or exit; never push through.",
  },
  {
    id: LOTUS_IS_NEVER_FORCED,
    title: "Never force lotus",
    text: "Never force lotus (or any closed hip/knee bind). Offer an open-seat twin.",
  },
  {
    id: EXTREME_VBT_IS_OBSERVE_ONLY,
    title: "Extreme VBT is not a class drill",
    text: "Extreme VBT methods = historical / observe_only — not class drills.",
  },
  {
    id: PRACTICE_IS_NOT_MEDICINE,
    title: "Practice is not medicine",
    text: "Practice ≠ medical treatment; no diagnose/cure language.",
  },
  {
    id: NO_DOORWAY_IS_OWNED,
    title: "No doorway is owned",
    text: "No doorway is owned — lineage credited; school pairing labeled school_device.",
  },
] as const;

/** Door 112 is Padmasana, a closed hip/knee bind. */
export const LOTUS_DOOR_NUMBER = 112;

/** Earlier researched door offered after pain. It is not started while pain is present. */
export const REGRESSION_DOOR_NUMBER = 1;

export function doorIsClosedBind(door: Door): boolean {
  if (isResearchDoor(door)) {
    return doorNumber(door) === LOTUS_DOOR_NUMBER;
  }
  return door.requires_lotus === true || door.number === LOTUS_DOOR_NUMBER || door.safety?.bind === "never_force";
}

export function openSeatName(door: Door): string | null {
  if (isResearchDoor(door)) {
    const alternate = door.safety.open_seat_alternate;
    return typeof alternate === "string" && alternate.trim().length > 0 ? alternate : null;
  }
  return door.alternate_geometry?.seat ?? door.safety?.open_seat_twin ?? door.alternate_geometry?.polygon ?? null;
}

export function vbtMode(door: Door): PracticeMode {
  if (isResearchDoor(door)) {
    if (door.adiyogi.practice_mode === "historical") {
      return "historical";
    }
    if (door.adiyogi.practice_mode === "observe_only" || door.adiyogi.historical_extreme === true) {
      return "observe_only";
    }
    return "practice";
  }
  const methodMode = door.adiyogi_method.practice_mode;
  const doorMode = door.practice_mode;
  if (methodMode === "historical" || doorMode === "historical") {
    return "historical";
  }
  if (methodMode === "observe_only" || doorMode === "observe_only" || door.adiyogi_method.extreme === true) {
    return "observe_only";
  }
  return "practice";
}

export function doorVbtIsExtreme(door: Door): boolean {
  return vbtMode(door) !== "practice";
}

/**
 * Earlier foundation door to name after pain.
 * Null when the student is already on that door, or no door was in play: exit.
 */
export function regressionDoor(door: Door | null): number | null {
  if (!door || doorNumber(door) === REGRESSION_DOOR_NUMBER) {
    return null;
  }
  return REGRESSION_DOOR_NUMBER;
}

export function scaleBreath(door: PrototypeDoor, profile: StudentProfile): SpokenBreath {
  const canonical = door.breath;
  const demand = door.breath_demand;
  if (demand === undefined || profile.breath_capacity >= demand) {
    return {
      inhale: canonical.inhale,
      exhale: canonical.exhale,
      pause: canonical.pause,
      scaled: false,
    };
  }
  const ratio = profile.breath_capacity / demand;
  return {
    inhale: Math.max(2, Math.round(canonical.inhale * ratio)),
    exhale: Math.max(2, Math.round(canonical.exhale * ratio)),
    pause: 0,
    scaled: true,
  };
}

export function gatePain(profile: StudentProfile, door: Door | null = null): GateResult {
  const law = FIVE_HARD_LAWS[0];
  if (profile.pain) {
    const regression = regressionDoor(door);
    const where = regression
      ? " Pause. Do not continue this door. Regression door, for later and not during pain: " +
        regression +
        ". Or exit."
      : " Pause or exit. There is no earlier door to regress to.";
    return {
      law: law.id,
      title: law.title,
      passed: false,
      effect: "halt",
      detail: "Pain is information." + where + " Never push through.",
    };
  }
  return {
    law: law.id,
    title: law.title,
    passed: true,
    effect: "clear",
    detail: "No pain reported. If pain appears, pause, regress, or exit.",
  };
}

export function gateLotus(profile: StudentProfile, door: Door): GateResult {
  const law = FIVE_HARD_LAWS[1];
  if (!doorIsClosedBind(door)) {
    return {
      law: law.id,
      title: law.title,
      passed: true,
      effect: "clear",
      detail: "This door does not ask for lotus or a closed hip or knee bind.",
    };
  }
  const twin = openSeatName(door);
  if (!twin) {
    return {
      law: law.id,
      title: law.title,
      passed: false,
      effect: "block",
      detail:
        "Door " +
        doorNumber(door) +
        " is a closed bind and has no open-seat twin. The closed shape is not taught.",
    };
  }
  if (!profile.lotus_ready) {
    return {
      law: law.id,
      title: law.title,
      passed: true,
      effect: "clear",
      detail:
        "Lotus is not entered. Open-seat twin: " +
        twin +
        ". The closed geometry stays on the record and is not used.",
    };
  }
  return {
    law: law.id,
    title: law.title,
    passed: true,
    effect: "clear",
    detail:
      "lotus_ready is true. The closed seat may be described and is never forced. Open-seat twin remains " +
      twin +
      ". Any knee complaint exits to that twin.",
  };
}

function vbtRefLabel(door: Door): string {
  if (isResearchDoor(door)) {
    return door.adiyogi.vbt_ref;
  }
  return "Verse " + door.adiyogi_method.vbt_verse;
}

export function gateExtremeVbt(door: Door): GateResult {
  const law = FIVE_HARD_LAWS[2];
  const mode = vbtMode(door);
  const ref = vbtRefLabel(door);
  if (mode === "practice") {
    return {
      law: law.id,
      title: law.title,
      passed: true,
      effect: "clear",
      detail:
        ref + " is not marked extreme or historical. It may be spoken as study. It is still a school pairing, not canon.",
    };
  }
  return {
    law: law.id,
    title: law.title,
    passed: true,
    effect: "observe",
    detail: ref + " is " + mode + ". Observe only. Not a class drill. A readiness flag cannot promote it.",
  };
}

const MEDICAL_CLAIM = /\b(cures?|diagnos(?:e|es|is|tic)|heals?|prescriptions?|treats)\b/i;

/** True when prose makes a diagnose, cure, heal, prescription, or "treats" claim. Negations are not claims. */
export function hasMedicalClaim(text: string): boolean {
  const stripped = text
    .replace(/practice is not medical treatment/gi, "")
    .replace(/not medical treatment/gi, "")
    .replace(/\bnot a (?:cure|diagnosis|treatment|prescription)\b/gi, "")
    .replace(/\b(?:does not|do not|don't|never|no|not)\s+(?:diagnose|cure|heal|treat|prescribe)\w*/gi, "");
  return MEDICAL_CLAIM.test(stripped);
}

function collectStrings(value: unknown, out: string[]): void {
  if (typeof value === "string") {
    out.push(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      collectStrings(item, out);
    }
    return;
  }
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) {
      collectStrings(item, out);
    }
  }
}

export function doorProse(door: Door): string {
  if (isResearchDoor(door)) {
    const chunks: string[] = [];
    collectStrings(door, chunks);
    return chunks.join("\n");
  }
  const chunks: string[] = [
    door.sanskrit,
    door.english,
    door.house,
    door.guardian,
    door.lineage ?? "",
    door.geometry.polygon,
    door.geometry.units ?? "",
    door.geometry.seat ?? "",
    door.alternate_geometry?.polygon ?? "",
    door.alternate_geometry?.units ?? "",
    door.alternate_geometry?.seat ?? "",
    door.reaction.reactants.join(" "),
    door.reaction.catalyst,
    door.reaction.product,
    door.reaction.phase,
    door.reaction.note ?? "",
    door.breath.bandha,
    door.breath.units ?? "",
    door.orientation.hand_placement,
    door.orientation.gaze,
    door.orientation.joint_lead,
    door.attention.locus,
    door.attention.chakra ?? "",
    door.adiyogi_method.summary,
    door.safety_notes.join("\n"),
    door.five_ways.join("\n"),
    door.safety?.bind ?? "",
    door.safety?.open_seat_twin ?? "",
    door.safety?.override ?? "",
    (door.safety?.notes ?? []).join("\n"),
  ];
  return chunks.join("\n");
}

export function gatePracticeIsNotMedicine(door: Door): GateResult {
  const law = FIVE_HARD_LAWS[3];
  if (hasMedicalClaim(doorProse(door))) {
    return {
      law: law.id,
      title: law.title,
      passed: false,
      effect: "block",
      detail: "This door record uses diagnose or cure language. It is not taught until that language is removed. Practice is not medical treatment.",
    };
  }
  return {
    law: law.id,
    title: law.title,
    passed: true,
    effect: "clear",
    detail: "No diagnose or cure claim on this door. Practice is not medical treatment.",
  };
}

export function gateNoDoorwayOwned(door: Door): GateResult {
  const law = FIVE_HARD_LAWS[4];
  if (isResearchDoor(door)) {
    const labeled = door.honesty.pairing_type === "school_device";
    const credited = door.honesty.disclosure.trim().length > 0;
    if (!labeled) {
      return {
        law: law.id,
        title: law.title,
        passed: false,
        effect: "block",
        detail: "This doorway has no school_device pairing label. It is not taught as canon, and it is not taught unlabeled.",
      };
    }
    if (!credited) {
      return {
        law: law.id,
        title: law.title,
        passed: false,
        effect: "block",
        detail: "pairing_type is school_device, and the honesty disclosure is missing. No doorway is owned.",
      };
    }
    return {
      law: law.id,
      title: law.title,
      passed: true,
      effect: "clear",
      detail: "Honesty disclosure is present. School pairing is labeled school_device. The school does not own the door.",
    };
  }
  const labeled = door.pairing_type === "school_device";
  const credited = typeof door.lineage === "string" && door.lineage.trim().length > 0;
  if (!labeled) {
    return {
      law: law.id,
      title: law.title,
      passed: false,
      effect: "block",
      detail: "This doorway has no school_device pairing label. It is not taught as canon, and it is not taught unlabeled.",
    };
  }
  if (!credited) {
    return {
      law: law.id,
      title: law.title,
      passed: false,
      effect: "block",
      detail: "pairing_type is school_device, and the lineage credit is missing. No doorway is owned.",
    };
  }
  return {
    law: law.id,
    title: law.title,
    passed: true,
    effect: "clear",
    detail: "Lineage is credited. School pairing is labeled school_device. The school does not own the door.",
  };
}

export function evaluateGates(profile: StudentProfile, door: Door): GateResult[] {
  return [
    gatePain(profile, door),
    gateLotus(profile, door),
    gateExtremeVbt(door),
    gatePracticeIsNotMedicine(door),
    gateNoDoorwayOwned(door),
  ];
}

export function sessionIsHalted(gates: GateResult[]): boolean {
  return gates.some((gate) => gate.effect === "halt");
}

export function sessionIsBlocked(gates: GateResult[]): boolean {
  return gates.some((gate) => gate.effect === "block");
}

export function vbtIsObserveOnly(gates: GateResult[]): boolean {
  return gates.some((gate) => gate.law === EXTREME_VBT_IS_OBSERVE_ONLY && gate.effect === "observe");
}

export function usesOpenSeat(profile: StudentProfile, door: Door): boolean {
  return doorIsClosedBind(door) && !profile.lotus_ready && openSeatName(door) !== null;
}

export function assertProfile(profile: StudentProfile): void {
  const level = (name: string, value: number) => {
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      throw new Error(name + " must be an integer from 1 to 5.");
    }
  };
  if (typeof profile.pain !== "boolean") {
    throw new Error("pain must be a boolean.");
  }
  if (typeof profile.lotus_ready !== "boolean") {
    throw new Error("lotus_ready must be a boolean.");
  }
  if (typeof profile.vbt_observe_only !== "boolean") {
    throw new Error("vbt_observe_only must be a boolean.");
  }
  if (!Array.isArray(profile.completed_doors)) {
    throw new Error("completed_doors must be an array of door numbers.");
  }
  for (const number of profile.completed_doors) {
    if (!Number.isInteger(number) || number < 1 || number > 112) {
      throw new Error("completed_doors contains a number outside 1–112.");
    }
  }
  level("breath_capacity", profile.breath_capacity);
  level("intensity_clearance", profile.intensity_clearance);
}
