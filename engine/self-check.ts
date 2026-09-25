import assert from "node:assert/strict";
import { loadDoor, loadIndex } from "./doors.ts";
import { teach, DEFAULT_PROFILE } from "./sequencer.ts";
import { FIVE_HARD_LAWS } from "./safety.ts";
import type { StudentProfile } from "./types.ts";

function profile(partial: Partial<StudentProfile>): StudentProfile {
  return {
    ...DEFAULT_PROFILE,
    completed_doors: [...DEFAULT_PROFILE.completed_doors],
    ...partial,
  };
}

const index = loadIndex();
assert.equal(index.doors.length, 112);
assert.equal(index.doors.filter((door) => door.status === "seeded").length, 3);
assert.equal(index.doors.filter((door) => door.sanskrit === null).length, 109);

const mountain = loadDoor(1);
const cobra = loadDoor(49);
const lotus = loadDoor(112);
assert.equal(mountain.english, "Mountain");
assert.equal(cobra.english, "Cobra");
assert.equal(lotus.english, "Lotus");
assert.equal(mountain.five_ways.length, 5);
assert.equal(lotus.adiyogi_method.extreme, true);
assert.equal(mountain.adiyogi_method.vbt_verse, 24);
assert.equal(cobra.adiyogi_method.vbt_verse, 49);
assert.equal(lotus.adiyogi_method.vbt_verse, 138);
assert.equal(FIVE_HARD_LAWS.length, 5);

assert.throws(() => loadDoor(2), /unassigned/);

const taught = teach(profile({}), { door: 1 });
assert.equal(taught.status, "teaching");
assert.equal(taught.script.length, 8);
assert.deepEqual(
  taught.script.map((beat) => beat.beat),
  [1, 2, 3, 4, 5, 6, 7, 8],
);
assert.equal(taught.script[1].instrument, "geometry");
assert.equal(taught.script[2].instrument, "orientation");
assert.equal(taught.script[3].instrument, "breath");
assert.equal(taught.script[4].instrument, "reaction");
assert.equal(taught.script[5].instrument, "attention");
assert.equal(taught.script[6].instrument, "adiyogi_method");
assert.equal(taught.script[1].observe_only, undefined);
assert.equal(taught.script[6].observe_only, undefined);
assert.match(taught.script[3].spoken, /Inhale 4/);

const cobraSession = teach(profile({}), { door: 49 });
assert.equal(cobraSession.status, "teaching");
assert.equal(cobraSession.script.length, 8);

const lowBreath = teach(profile({ breath_capacity: 1 }), { door: 49 });
assert.equal(lowBreath.status, "teaching");
assert.equal(lowBreath.script[1].observe_only, true);
assert.equal(lowBreath.script[2].observe_only, true);
assert.equal(lowBreath.script[3].observe_only, undefined);
assert.match(lowBreath.script[3].spoken, /Breath leads/);

const halted = teach(profile({ pain: true }), { door: 1 });
assert.equal(halted.status, "halt");
assert.equal(halted.door, null);
assert.equal(halted.script.length, 0);
assert.equal(halted.gates[0].law, "PAIN_IS_A_HARD_STOP");

const lotusBlocked = teach(profile({}), { door: 112 });
assert.equal(lotusBlocked.status, "blocked");
assert.equal(lotusBlocked.script.length, 0);
assert.ok(lotusBlocked.gates.some((gate) => gate.law === "LOTUS_IS_NEVER_FORCED" && gate.effect === "block"));
assert.ok(lotusBlocked.gates.some((gate) => gate.law === "GUARDIAN_INTENSITY_GATE" && gate.effect === "block"));

const lotusStudy = teach(
  profile({
    lotus_ready: true,
    intensity_clearance: 5,
    breath_capacity: 4,
    vbt_observe_only: true,
  }),
  { door: 112 },
);
assert.equal(lotusStudy.status, "teaching");
assert.equal(lotusStudy.script[6].observe_only, true);
assert.match(lotusStudy.script[6].spoken, /Observe only/);
assert.match(lotusStudy.script[6].spoken, /138/);

const lotusPractice = teach(
  profile({
    lotus_ready: true,
    intensity_clearance: 5,
    breath_capacity: 4,
    vbt_observe_only: false,
  }),
  { door: 112 },
);
assert.equal(lotusPractice.status, "teaching");
assert.equal(lotusPractice.script[6].observe_only, undefined);
assert.doesNotMatch(lotusPractice.script[6].spoken, /^Observe only/);

const next = teach(profile({ completed_doors: [1] }));
assert.equal(next.status, "teaching");
assert.equal(next.door?.number, 49);

const noneOpen = teach(
  profile({
    completed_doors: [1, 49],
    intensity_clearance: 3,
    lotus_ready: false,
  }),
);
assert.equal(noneOpen.status, "blocked");
assert.equal(noneOpen.door, null);
assert.match(noneOpen.message, /Lotus is never forced/);

console.log("self-check ok");
