/**
 * Door — one of the 112 doorways.
 *
 * Breath counts are ratios, not clock seconds. One count is a comfortable
 * pulse. `pause` is a quiet suspension (see `pause_after`), released the
 * moment it becomes a grip. `bandha` names the lock, or says there is none.
 *
 * `reaction` is an alchemical teaching metaphor. It is not a laboratory procedure.
 *
 * The five hard laws live in engine/safety.ts and match the Chief of Staff plan §3d and §5.
 * Optional fields (`status`, `safety`, `practice_mode`, `pairing_type`,
 * `alternate_geometry`, `lineage`) record honesty flags. Padmasana carries the
 * open-seat twin.
 */

export interface Geometry {
  /** Teaching name of the figure: "isosceles triangle", "rising arc", "octagon". */
  polygon: string;
  /** Vertices in a teaching plane. Each point is [x, y] or [x, y, z]. */
  vertices: number[][];
  /** What the coordinates mean. They are a sketch, not a body measurement. */
  units?: string;
  /** Named seat when this figure is an open-seat twin, not the closed bind. */
  seat?: string;
}

export interface Reaction {
  reactants: string[];
  catalyst: string;
  product: string;
  /** Phase of the metaphor: solidification, kindling, dissolution, and so on. */
  phase: string;
  /** Reminder that this layer is metaphorical. */
  note?: string;
}

export interface Breath {
  /** Inhale length in equal counts. */
  inhale: number;
  /** Exhale length in equal counts. */
  exhale: number;
  /** Pause length in equal counts. Zero means no deliberate pause. */
  pause: number;
  /** Lock to use, or an explicit refusal to add one. */
  bandha: string;
  /** Documents the count unit. Same meaning on every seeded door. */
  units?: string;
  /** Where the pause sits. Omitted or "none" when pause is 0. */
  pause_after?: "exhale" | "inhale" | "none";
}

export interface Orientation {
  hand_placement: string;
  gaze: string;
  joint_lead: string;
}

export interface Attention {
  locus: string;
  /** Optional traditional center. The locus sentence is the teaching. */
  chakra?: string;
}

export interface AdiyogiMethod {
  /**
   * Verse number in the Vijnana Bhairava Tantra.
   * A teaching reference. Editions differ by a line; the summary must say so
   * when the pairing is pedagogical rather than a critical edition's claim.
   */
  vbt_verse: number;
  summary: string;
  /** Yukti index 1–112 in the common counting, when we are willing to name it. */
  yukti?: number;
  /**
   * Extreme or historical dharanas are observe_only. They are not class drills.
   * A profile flag cannot promote them into practice.
   */
  extreme?: boolean;
  /** `practice` for ordinary study. `observe_only` or `historical` for extremes. */
  practice_mode?: PracticeMode;
}

export type PracticeMode = "practice" | "observe_only" | "historical";
export type DoorStatus = "stub" | "researched" | "live";
export type PairingType = "school_device";

export interface DoorSafety {
  /** Closed hip or knee bind policy. Lotus uses `never_force`. */
  bind?: string;
  /** Name of the open seat offered instead of a closed bind. */
  open_seat_twin?: string;
  /** Short statement that safety overrides geometry. */
  override?: string;
  notes?: string[];
}

export interface Door {
  /** 1–112 */
  number: number;
  sanskrit: string;
  english: string;
  house: string;
  element: string;
  color: string;
  bija: string;
  geometry: Geometry;
  reaction: Reaction;
  breath: Breath;
  orientation: Orientation;
  attention: Attention;
  adiyogi_method: AdiyogiMethod;
  guardian: string;
  safety_notes: string[];
  /** Exactly five teaching approaches for this door. */
  five_ways: string[];
  /** 1–5. Recorded house intensity. Not a hard law by itself. */
  house_intensity?: number;
  /** 1–5. Used only to shorten a spoken breath count. */
  breath_demand?: number;
  /** True for Padmasana and any future door that asks for a closed hip or knee bind. */
  requires_lotus?: boolean;
  /** Plan vocabulary: stub, researched, or live. */
  status?: DoorStatus;
  /** School pairing label. Live teaching requires `school_device`. */
  pairing_type?: PairingType;
  /** Lineage credit. Required before a door is taught. */
  lineage?: string;
  /** Door-level mode. Extreme VBT stays observe_only or historical. */
  practice_mode?: PracticeMode;
  /** Open-seat figure offered instead of a closed bind. Required for lotus. */
  alternate_geometry?: Geometry;
  /** Extra safety record. Padmasana names the open-seat twin here. */
  safety?: DoorSafety;
}

export interface StudentProfile {
  /** Reported pain. When true, the session halts. */
  pain: boolean;
  /** When false, a closed bind is not entered. The open-seat twin is taught instead. */
  lotus_ready: boolean;
  /**
   * Retained on the profile for readiness notes.
   * It cannot turn an extreme or historical VBT method into a class drill.
   */
  vbt_observe_only: boolean;
  completed_doors: number[];
  /** 1–5. Compared with the door's breath_demand. */
  breath_capacity: number;
  /** 1–5. Compared with the door's house_intensity. */
  intensity_clearance: number;
}

export type Instrument =
  | "geometry"
  | "orientation"
  | "breath"
  | "reaction"
  | "attention"
  | "adiyogi_method";

export interface TutorialBeat {
  beat: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  title: string;
  spoken: string;
  instrument?: Instrument;
  /** When true, the beat is study. The body is not asked to perform it. */
  observe_only?: boolean;
}

export type SessionStatus = "teaching" | "halt" | "blocked";

export interface TeachingSession {
  status: SessionStatus;
  profile: StudentProfile;
  /** The door under consideration. Null when pain exits before a door is taught. */
  door: Door | null;
  /** Eight beats when teaching. Empty when halted or blocked. */
  script: TutorialBeat[];
  gates: GateResult[];
  message: string;
  /**
   * When pain ends the session, the earlier door to return to later.
   * Null means exit, with no regression door.
   * The regression door is not started while pain is reported.
   */
  regression_door: number | null;
}

export interface GateResult {
  law: HardLawId;
  title: string;
  passed: boolean;
  /**
   * clear — no constraint.
   * halt — end the session; no script.
   * block — this door does not open; no script.
   * observe — the session may continue, with observe_only marks.
   */
  effect: "clear" | "halt" | "block" | "observe";
  detail: string;
}

export const HARD_LAW_IDS = [
  "PAIN_IS_INFORMATION",
  "LOTUS_IS_NEVER_FORCED",
  "EXTREME_VBT_IS_OBSERVE_ONLY",
  "PRACTICE_IS_NOT_MEDICINE",
  "NO_DOORWAY_IS_OWNED",
] as const;

export type HardLawId = (typeof HARD_LAW_IDS)[number];

export interface DoorIndexEntry {
  number: number;
  sanskrit: string | null;
  english: string | null;
  status: "seeded" | "unassigned";
  file?: string;
}

export interface DoorIndex {
  school: string;
  count: number;
  doors: DoorIndexEntry[];
}

/** Counts actually spoken. May be shorter than the door's canonical ratio. */
export interface SpokenBreath {
  inhale: number;
  exhale: number;
  pause: number;
  scaled: boolean;
}
