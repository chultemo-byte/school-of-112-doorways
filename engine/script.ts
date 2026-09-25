import type { Door, SpokenBreath, TutorialBeat } from "./types.ts";

export interface ScriptMarks {
  geometryObserveOnly: boolean;
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

/**
 * Eight beats: arrive, geometry, orientation, breath, reaction, attention,
 * adiyogi method, close. The six instruments live on the door; this is the
 * order a student hears them.
 */
export function buildScript(door: Door, marks: ScriptMarks): TutorialBeat[] {
  const geometryObserve = marks.geometryObserveOnly;
  const vbtObserve = marks.vbtObserveOnly;
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

  const geometrySpoken = geometryObserve
    ? "Observe only. The figure is " +
      article(door.geometry.polygon) +
      " " +
      door.geometry.polygon +
      " (" +
      door.geometry.vertices.length +
      " vertices). Look at it. Do not build it with the body. Breath has not cleared this geometry, so the geometry waits."
    : "The figure is " +
      article(door.geometry.polygon) +
      " " +
      door.geometry.polygon +
      ", " +
      door.geometry.vertices.length +
      " vertices, a teaching sketch rather than a measurement. See it, then enter only as far as the next breaths stay honest. If the breath thins to win the shape, the shape is finished. " +
      (door.geometry.units ?? "");

  const orientationSpoken = geometryObserve
    ? "Observe only. Hands: " +
      door.orientation.hand_placement +
      " Gaze: " +
      door.orientation.gaze +
      " Joint lead: " +
      door.orientation.joint_lead +
      " Hear the placement. Do not take it."
    : "Hands: " +
      door.orientation.hand_placement +
      " Gaze: " +
      door.orientation.gaze +
      " The joint that leads: " +
      door.orientation.joint_lead +
      " If a joint that should follow begins to lead, come back.";

  const breathSpoken = breath.scaled
    ? "The door records inhale " +
      canonical.inhale +
      ", exhale " +
      canonical.exhale +
      ", pause " +
      canonical.pause +
      ". Breath leads, so today is inhale " +
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

  const attentionSpoken =
    "Rest attention at " +
    door.attention.locus +
    "." +
    (door.attention.chakra ? " The traditional center named here is " + door.attention.chakra + "." : "") +
    " If attention becomes a project, return to the breath count.";

  const adiyogiSpoken = vbtObserve
    ? "Observe only. Do not turn this into an exercise. Vijnana Bhairava Tantra, verse " +
      door.adiyogi_method.vbt_verse +
      (door.adiyogi_method.yukti !== undefined ? " (yukti " + door.adiyogi_method.yukti + ")" : "") +
      ". " +
      door.adiyogi_method.summary
    : "Vijnana Bhairava Tantra, verse " +
      door.adiyogi_method.vbt_verse +
      (door.adiyogi_method.yukti !== undefined ? " (yukti " + door.adiyogi_method.yukti + ")" : "") +
      ". " +
      door.adiyogi_method.summary;

  const closeSpoken =
    "Come out of the figure before you decide how it went. One way for the next meeting, not all five: " +
    door.five_ways[0] +
    " Safety stays in force. " +
    door.safety_notes[0] +
    " The guardian does not grade the stay.";

  const beats: TutorialBeat[] = [
    {
      beat: 1,
      title: "Arrive",
      spoken:
        "Door " +
        door.number +
        ". " +
        door.sanskrit +
        ", " +
        door.english +
        ". House: " +
        door.house +
        ". Element: " +
        door.element +
        ". Color: " +
        door.color +
        ". If the bija is sounded, it is " +
        door.bija +
        ", once, without decoration. Guardian: " +
        door.guardian +
        ". Nothing is asked yet. Feel the ground that is already under you.",
    },
    {
      beat: 2,
      title: "Geometry",
      instrument: "geometry",
      spoken: geometrySpoken.trim(),
      ...mark(geometryObserve),
    },
    {
      beat: 3,
      title: "Orientation",
      instrument: "orientation",
      spoken: orientationSpoken,
      ...mark(geometryObserve),
    },
    {
      beat: 4,
      title: "Breath",
      instrument: "breath",
      spoken: breathSpoken,
    },
    {
      beat: 5,
      title: "Reaction",
      instrument: "reaction",
      spoken: reactionSpoken,
    },
    {
      beat: 6,
      title: "Attention",
      instrument: "attention",
      spoken: attentionSpoken,
    },
    {
      beat: 7,
      title: "Adiyogi method",
      instrument: "adiyogi_method",
      spoken: adiyogiSpoken,
      ...mark(vbtObserve),
    },
    {
      beat: 8,
      title: "Close",
      spoken: closeSpoken,
    },
  ];

  return beats;
}
