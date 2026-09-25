import type {
  Door,
  GateResult,
  HardLawId,
  SpokenBreath,
  StudentProfile,
} from "./types.ts";

/**
 * Five hard laws of the school.
 * Names here match docs/YOGA-TEACHING-MACHINE-MASTER-PLAN.md and safety/rules.md.
 * Until a Chief of Staff verbatim plan replaces the engineer draft, these are the laws.
 */

export const PAIN_IS_A_HARD_STOP = "PAIN_IS_A_HARD_STOP" as const;
export const LOTUS_IS_NEVER_FORCED = "LOTUS_IS_NEVER_FORCED" as const;
export const EXTREME_VBT_IS_OBSERVE_ONLY = "EXTREME_VBT_IS_OBSERVE_ONLY" as const;
export const BREATH_LEADS_POSTURE = "BREATH_LEADS_POSTURE" as const;
export const GUARDIAN_INTENSITY_GATE = "GUARDIAN_INTENSITY_GATE" as const;

export interface HardLaw {
  id: HardLawId;
  title: string;
  text: string;
}

export const FIVE_HARD_LAWS: readonly HardLaw[] = [
  {
    id: PAIN_IS_A_HARD_STOP,
    title: "Pain is a hard stop",
    text: "If the student reports pain, halt. Never push through.",
  },
  {
    id: LOTUS_IS_NEVER_FORCED,
    title: "Lotus is never forced",
    text: "Padmasana (door 112) and any door marked requires_lotus stay shut until lotus_ready is true. The knees are not levers.",
  },
  {
    id: EXTREME_VBT_IS_OBSERVE_ONLY,
    title: "Extreme VBT is observe_only",
    text: "An extreme Vijnana Bhairava dharana is marked observe_only while the student profile keeps vbt_observe_only true.",
  },
  {
    id: BREATH_LEADS_POSTURE,
    title: "Breath leads posture",
    text: "Never force geometry against breath capacity. If capacity is below the door's breath demand, the shape is observe_only and the count is shortened.",
  },
  {
    id: GUARDIAN_INTENSITY_GATE,
    title: "Guardian intensity gate",
    text: "The student readiness profile must clear the door's house intensity before that door may open.",
  },
] as const;

/** Door 112 is Padmasana. Any door may also set requires_lotus. */
export const LOTUS_DOOR_NUMBER = 112;

export function doorRequiresLotus(door: Door): boolean {
  return door.requires_lotus === true || door.number === LOTUS_DOOR_NUMBER;
}

export function doorVbtIsExtreme(door: Door): boolean {
  return door.adiyogi_method.extreme === true;
}

export function scaleBreath(door: Door, profile: StudentProfile): SpokenBreath {
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

export function gatePain(profile: StudentProfile): GateResult {
  const law = FIVE_HARD_LAWS[0];
  if (profile.pain) {
    return {
      law: law.id,
      title: law.title,
      passed: false,
      effect: "halt",
      detail: "Pain is reported. The sequence stops. Do not continue, modify, or push through.",
    };
  }
  return {
    law: law.id,
    title: law.title,
    passed: true,
    effect: "clear",
    detail: "No pain reported. This is not a medical clearance; pain later still stops the session.",
  };
}

export function gateLotus(profile: StudentProfile, door: Door): GateResult {
  const law = FIVE_HARD_LAWS[1];
  if (!doorRequiresLotus(door)) {
    return {
      law: law.id,
      title: law.title,
      passed: true,
      effect: "clear",
      detail: "This door does not ask for lotus.",
    };
  }
  if (!profile.lotus_ready) {
    return {
      law: law.id,
      title: law.title,
      passed: false,
      effect: "block",
      detail:
        "Door " +
        door.number +
        " stays shut until lotus_ready is true. A chair or an easy seat is a complete practice.",
    };
  }
  return {
    law: law.id,
    title: law.title,
    passed: true,
    effect: "clear",
    detail:
      "lotus_ready is true. The script may describe the seat. Any knee complaint still ends it; readiness is not permission to haul the foot.",
  };
}

export function gateExtremeVbt(profile: StudentProfile, door: Door): GateResult {
  const law = FIVE_HARD_LAWS[2];
  if (!doorVbtIsExtreme(door)) {
    return {
      law: law.id,
      title: law.title,
      passed: true,
      effect: "clear",
      detail:
        "Verse " +
        door.adiyogi_method.vbt_verse +
        " is not marked extreme. It may be taught as study inside the other laws.",
    };
  }
  if (profile.vbt_observe_only) {
    return {
      law: law.id,
      title: law.title,
      passed: true,
      effect: "observe",
      detail:
        "Verse " +
        door.adiyogi_method.vbt_verse +
        " is extreme. vbt_observe_only is true, so the Adiyogi beat is observe_only. Hear it. Do not perform it.",
    };
  }
  return {
    law: law.id,
    title: law.title,
    passed: true,
    effect: "clear",
    detail:
      "Verse " +
      door.adiyogi_method.vbt_verse +
      " is extreme, and the profile allows practice. The other four laws still bind. This is not an initiation.",
  };
}

export function gateBreathLeadsPosture(profile: StudentProfile, door: Door): GateResult {
  const law = FIVE_HARD_LAWS[3];
  const demand = door.breath_demand;
  if (demand === undefined) {
    return {
      law: law.id,
      title: law.title,
      passed: false,
      effect: "observe",
      detail: "This door has no breath_demand. Geometry stays observe_only until a demand is set.",
    };
  }
  if (profile.breath_capacity < demand) {
    const spoken = scaleBreath(door, profile);
    return {
      law: law.id,
      title: law.title,
      passed: false,
      effect: "observe",
      detail:
        "Breath capacity " +
        profile.breath_capacity +
        " is below demand " +
        demand +
        ". Geometry and orientation stay observe_only. Spoken count is " +
        spoken.inhale +
        " in, " +
        spoken.exhale +
        " out, pause " +
        spoken.pause +
        ".",
    };
  }
  return {
    law: law.id,
    title: law.title,
    passed: true,
    effect: "clear",
    detail:
      "Breath capacity " +
      profile.breath_capacity +
      " meets demand " +
      demand +
      ". If the breath shortens inside the shape, leave the shape.",
  };
}

export function gateGuardianIntensity(profile: StudentProfile, door: Door): GateResult {
  const law = FIVE_HARD_LAWS[4];
  const intensity = door.house_intensity;
  if (intensity === undefined) {
    return {
      law: law.id,
      title: law.title,
      passed: false,
      effect: "block",
      detail: "This door has no house_intensity. The guardian does not open an unmarked house.",
    };
  }
  if (profile.intensity_clearance < intensity) {
    return {
      law: law.id,
      title: law.title,
      passed: false,
      effect: "block",
      detail:
        "Clearance is " +
        profile.intensity_clearance +
        "; " +
        door.house +
        " asks " +
        intensity +
        ". " +
        door.guardian +
        " has not opened the door.",
    };
  }
  return {
    law: law.id,
    title: law.title,
    passed: true,
    effect: "clear",
    detail:
      "Clearance " +
      profile.intensity_clearance +
      " meets house intensity " +
      intensity +
      ".",
  };
}

export function evaluateGates(profile: StudentProfile, door: Door): GateResult[] {
  return [
    gatePain(profile),
    gateLotus(profile, door),
    gateExtremeVbt(profile, door),
    gateBreathLeadsPosture(profile, door),
    gateGuardianIntensity(profile, door),
  ];
}

export function sessionIsHalted(gates: GateResult[]): boolean {
  return gates.some((gate) => gate.effect === "halt");
}

export function sessionIsBlocked(gates: GateResult[]): boolean {
  return gates.some((gate) => gate.effect === "block");
}

export function geometryIsObserveOnly(gates: GateResult[]): boolean {
  return gates.some(
    (gate) => gate.law === BREATH_LEADS_POSTURE && gate.effect === "observe",
  );
}

export function vbtIsObserveOnly(gates: GateResult[]): boolean {
  return gates.some(
    (gate) => gate.law === EXTREME_VBT_IS_OBSERVE_ONLY && gate.effect === "observe",
  );
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
