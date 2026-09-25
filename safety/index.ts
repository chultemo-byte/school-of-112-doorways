/**
 * Human-facing copy of the laws lives in safety/rules.md.
 * The functions the sequencer calls live in engine/safety.ts.
 */
export {
  BREATH_LEADS_POSTURE,
  EXTREME_VBT_IS_OBSERVE_ONLY,
  FIVE_HARD_LAWS,
  GUARDIAN_INTENSITY_GATE,
  LOTUS_DOOR_NUMBER,
  LOTUS_IS_NEVER_FORCED,
  PAIN_IS_A_HARD_STOP,
  assertProfile,
  doorRequiresLotus,
  doorVbtIsExtreme,
  evaluateGates,
  gateBreathLeadsPosture,
  gateExtremeVbt,
  gateGuardianIntensity,
  gateLotus,
  gatePain,
  geometryIsObserveOnly,
  scaleBreath,
  sessionIsBlocked,
  sessionIsHalted,
  vbtIsObserveOnly,
} from "../engine/safety.ts";
