import type { Door, Geometry, SpokenBreath, TutorialBeat } from "./types.ts";
import { openSeatName, vbtMode } from "./safety.ts";

export interface ScriptMarks {
  /** Closed bind is replaced by the open-seat twin for this session. */
  openSeat: boolean;
  vbtObserveOnly: boolean;
  breath: SpokenBreath;
}

const BREATH_UNIT =
  "Counts are equal pulses, not clock seconds. Leave the count the moment it becomes a grip.";

function article(phrase: string): string {
  return /^[aeiou]/i.test(phrase) ? "an" : "a";
}

function mark(observe: boolean): { observe_only: true } | Record<string, never> {
  return observe ? { observe_only: true } : {};
}

function figureClause(geometry: Geometry): string {
  const seat = geometry.seat ? " Seat: " + geometry.seat + "." : "";
  const units = geometry.units ? " " + geometry.units : "";
  return (
    article(geometry.polygon) +
    " " +
    geometry.polygon +
    " (" +
    geometry.vertices.length +
    " vertices)." +
    seat +
    units
  );
}

/**
 * Eight beats from the master plan:
 * name the door, geometry, orientation, breath, attention, reaction,
 * Adiyogi thread in its safe form, exit / integrate.
 */
export function buildScript(door: Door, marks: ScriptMarks): TutorialBeat[] {
  const breath = marks.breath;
  const canonical = door.breath;
  const pauseSpoken =
    breath.pause === 0
      ? "No deliberate pause."
      : "Pause " +
        breath.pause +
        " after the " +
        (canonical.pause_after === "inhale" ? "inhale" : "exhale") +
        ".";
  const twin = openSeatName(door);
  const practiced = marks.openSeat && door.alternate_geometry ? door.alternate_geometry : door.geometry;

  let geometrySpoken: string;
  if (marks.openSeat && door.alternate_geometry) {
    geometrySpoken =
      "Closed figure, not entered: " +
      figureClause(door.geometry) +
      " Never force lotus or a closed hip or knee bind. Open-seat twin, and the figure for today: " +
      figureClause(door.alternate_geometry);
  } else if (twin && door.requires_lotus) {
    geometrySpoken =
      "The figure is " +
      figureClause(door.geometry) +
      " Never force it. If either knee complains, leave at once for the open-seat twin: " +
      twin +
      ".";
  } else {
    geometrySpoken =
      "The figure is " +
      figureClause(practiced) +
      " A teaching sketch, not a measurement. If the breath thins to win the shape, the shape is finished.";
  }

  const orientationSpoken =
    "Hands: " +
    door.orientation.hand_placement +
    " Gaze: " +
    door.orientation.gaze +
    " The joint that leads: " +
    door.orientation.joint_lead +
    (marks.openSeat
      ? " Use this orientation in the open seat, not in lotus. A knee that would have to be persuaded ends the closed shape only; this session stays with the twin."
      : " If a joint that should follow begins to lead, come back.");

  const breathSpoken = breath.scaled
    ? "The door records inhale " +
      canonical.inhale +
      ", exhale " +
      canonical.exhale +
      ", pause " +
      canonical.pause +
      ". The count is shortened to the breath you have: inhale " +
      breath.inhale +
      ", exhale " +
      breath.exhale +
      ", pause " +
      breath.pause +
      ". " +
      pauseSpoken +
      " Bandha: " +
      door.breath.bandha +
      " " +
      BREATH_UNIT
    : "Inhale " +
      breath.inhale +
      ", exhale " +
      breath.exhale +
      ", pause " +
      breath.pause +
      ". " +
      pauseSpoken +
      " Bandha: " +
      door.breath.bandha +
      " " +
      BREATH_UNIT +
      " Stay inside this count. Do not lengthen it to feel serious.";

  const attentionSpoken =
    "Rest attention at " +
    door.attention.locus +
    "." +
    (door.attention.chakra ? " The traditional center named here is " + door.attention.chakra + "." : "") +
    " If attention becomes a project, return to the breath count.";

  const reactionNote = door.reaction.note ? " " + door.reaction.note : "";
  const reactionSpoken =
    "This is a metaphor, not a substance and not a procedure. Reactants: " +
    door.reaction.reactants.join("; ") +
    ". Catalyst: " +
    door.reaction.catalyst +
    ". Product, if the work is honest: " +
    door.reaction.product +
    ". Phase: " +
    door.reaction.phase +
    "." +
    reactionNote;

  const mode = vbtMode(door);
  const verse =
    "Vijnana Bhairava Tantra, verse " +
    door.adiyogi_method.vbt_verse +
    (door.adiyogi_method.yukti !== undefined ? " (yukti " + door.adiyogi_method.yukti + ")" : "") +
    ". School pairing: school_device. " +
    door.adiyogi_method.summary;
  const adiyogiSpoken = marks.vbtObserveOnly
    ? "Safe form. " +
      (mode === "historical" ? "Historical. " : "") +
      "Observe only. Not a class drill. " +
      verse
    : "Safe form. " + verse;

  const closeSpoken =
    "Exit the figure before you decide how it went. Integrate by feeling the ground that is already under you. One way for the next meeting, not all five: " +
    door.five_ways[0] +
    " Safety stays in force. " +
    door.safety_notes[0] +
    " Practice is not medical treatment. The school does not own this door.";

  const pairing = door.pairing_type === "school_device" ? "school_device" : "unlabeled";

  const beats: TutorialBeat[] = [
    {
      beat: 1,
      title: "Name the door",
      spoken:
        "Door " +
        door.number +
        ". " +
        door.sanskrit +
        (door.sanskrit_devanagari ? " (" + door.sanskrit_devanagari + ")" : "") +
        ", " +
        door.english +
        "." +
        (door.dimension ? " Dimension: " + door.dimension + "." : "") +
        " House: " +
        door.house +
        ". Element: " +
        door.element +
        ". Color: " +
        door.color +
        ". If the bija is sounded, it is " +
        door.bija +
        ", once, without decoration. Guardian: " +
        door.guardian +
        ". Lineage: " +
        (door.lineage ?? "uncredited") +
        " Pairing type: " +
        pairing +
        ".",
    },
    {
      beat: 2,
      title: "Geometry",
      instrument: "geometry",
      spoken: geometrySpoken.trim(),
    },
    {
      beat: 3,
      title: "Orientation",
      instrument: "orientation",
      spoken: orientationSpoken,
    },
    {
      beat: 4,
      title: "Breath",
      instrument: "breath",
      spoken: breathSpoken,
    },
    {
      beat: 5,
      title: "Attention",
      instrument: "attention",
      spoken: attentionSpoken,
    },
    {
      beat: 6,
      title: "Reaction",
      instrument: "reaction",
      spoken: reactionSpoken,
    },
    {
      beat: 7,
      title: "Adiyogi thread",
      instrument: "adiyogi_method",
      spoken: adiyogiSpoken,
      ...mark(marks.vbtObserveOnly),
    },
    {
      beat: 8,
      title: "Exit / integrate",
      spoken: closeSpoken,
    },
  ];

  return beats;
}
