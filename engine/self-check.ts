import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { loadDoor, loadIndex, repoRoot } from "./doors.ts";
import { teach, DEFAULT_PROFILE } from "./sequencer.ts";
import { FIVE_HARD_LAWS, hasMedicalClaim } from "./safety.ts";
import type { StudentProfile } from "./types.ts";
import { doorNumber, isResearchDoor } from "./types.ts";

function profile(partial: Partial<StudentProfile>): StudentProfile {
  return {
    ...DEFAULT_PROFILE,
    completed_doors: [...DEFAULT_PROFILE.completed_doors],
    ...partial,
  };
}

const index = loadIndex();
assert.equal(index.doors.length, 112);
assert.equal(index.doors.filter((door) => door.status === "researched").length, 16);
assert.equal(index.doors.filter((door) => door.status === "seeded").length, 2);
assert.equal(index.doors.filter((door) => door.status === "unassigned").length, 94);
assert.equal(index.doors.filter((door) => door.sanskrit === null).length, 94);

for (let number = 1; number <= 16; number += 1) {
  const entry = index.doors[number - 1];
  assert.equal(entry?.number, number);
  assert.equal(entry?.status, "researched");
  assert.equal(entry?.house, 1);
  assert.equal(entry?.file, "doors/D-" + String(number).padStart(3, "0") + "/door.json");
}

const mountain = loadDoor(1);
const cobra = loadDoor(49);
const lotus = loadDoor(112);
assert.equal(isResearchDoor(cobra), false);
assert.equal(isResearchDoor(lotus), false);
if (isResearchDoor(cobra) || isResearchDoor(lotus)) {
  throw new Error("Doors 49 and 112 stay on the prototype record.");
}
assert.equal(isResearchDoor(mountain), true);
if (!isResearchDoor(mountain)) {
  throw new Error("Door 1 must load the researched record.");
}
assert.equal(mountain.id, "D-001");
assert.equal(mountain.name, "Mountain");
assert.equal(mountain.status, "researched");
assert.equal(mountain.honesty.pairing_type, "school_device");
assert.equal(mountain.adiyogi.practice_mode, "practice");
assert.equal(mountain.adiyogi.vbt_ref, "VBT dharana 001 (verse 24)");
assert.equal(cobra.english, "Cobra");
assert.equal(lotus.english, "Lotus");
assert.equal(cobra.five_ways.length, 5);
assert.equal(lotus.five_ways.length, 5);
assert.equal(cobra.pairing_type, "school_device");
assert.equal(lotus.pairing_type, "school_device");
assert.equal(lotus.practice_mode, "observe_only");
assert.equal(lotus.alternate_geometry?.seat, "Sukhāsana, or a chair");
assert.equal(lotus.adiyogi_method.extreme, true);
assert.equal(cobra.adiyogi_method.vbt_verse, 49);
assert.equal(lotus.adiyogi_method.vbt_verse, 138);

const raw013 = JSON.parse(
  readFileSync(path.join(repoRoot(), "doors", "D-013", "door.json"), "utf8"),
) as { adiyogi: { practice_mode: string } };
assert.equal(raw013.adiyogi.practice_mode, "observe_only");
assert.equal(FIVE_HARD_LAWS.length, 5);
assert.deepEqual(
  FIVE_HARD_LAWS.map((law) => law.id),
  [
    "PAIN_IS_INFORMATION",
    "LOTUS_IS_NEVER_FORCED",
    "EXTREME_VBT_IS_OBSERVE_ONLY",
    "PRACTICE_IS_NOT_MEDICINE",
    "NO_DOORWAY_IS_OWNED",
  ],
);

assert.equal(hasMedicalClaim("this pose cures pain"), true);
assert.equal(hasMedicalClaim("Practice is not medical treatment."), false);
assert.equal(hasMedicalClaim("This machine does not diagnose."), false);

assert.throws(() => loadDoor(17), /unassigned/);

for (const number of [1, 2, 13, 16]) {
  const door = loadDoor(number);
  assert.equal(isResearchDoor(door), true);
  if (!isResearchDoor(door)) {
    throw new Error("Door " + number + " must load the researched record.");
  }
  const session = teach(profile({}), { door: number });
  assert.equal(session.status, "teaching");
  assert.equal(session.script.length, 8);
  assert.deepEqual(
    session.script.map((beat) => beat.spoken),
    door.beats.map((beat) => beat.script),
  );
  assert.deepEqual(
    session.script.map((beat) => beat.title),
    door.beats.map((beat) => beat.title),
  );
  assert.equal(session.script[1]?.instrument, "geometry");
  assert.equal(session.script[2]?.instrument, "orientation");
  assert.equal(session.script[3]?.instrument, "breath");
  assert.equal(session.script[4]?.instrument, "attention");
  assert.equal(session.script[5]?.instrument, "reaction");
  assert.equal(session.script[6]?.instrument, "adiyogi_method");
  if (door.adiyogi.practice_mode === "observe_only" || door.adiyogi.practice_mode === "historical") {
    assert.equal(session.script[6]?.observe_only, true);
  } else {
    assert.equal(session.script[6]?.observe_only, undefined);
  }
  for (const beat of session.script) {
    assert.equal(hasMedicalClaim(beat.spoken), false);
  }
}

const revolved = loadDoor(13);
assert.equal(isResearchDoor(revolved), true);
if (isResearchDoor(revolved)) {
  assert.equal(revolved.id, "D-013");
  assert.equal(revolved.adiyogi.practice_mode, "observe_only");
}
const revolvedSession = teach(profile({}), { door: 13 });
assert.equal(revolvedSession.script[6]?.observe_only, true);
if (isResearchDoor(revolved)) {
  assert.equal(revolvedSession.script[6]?.spoken, revolved.beats[6]?.script);
}

const cobraSession = teach(profile({}), { door: 49 });
assert.equal(cobraSession.status, "teaching");
assert.deepEqual(
  cobraSession.script.map((beat) => beat.title),
  [
    "Name the door",
    "Geometry",
    "Orientation",
    "Breath",
    "Attention",
    "Reaction",
    "Adiyogi thread",
    "Exit / integrate",
  ],
);
assert.equal(cobraSession.script[1].instrument, "geometry");
assert.equal(cobraSession.script[2].instrument, "orientation");
assert.equal(cobraSession.script[3].instrument, "breath");
assert.equal(cobraSession.script[4].instrument, "attention");
assert.equal(cobraSession.script[5].instrument, "reaction");
assert.equal(cobraSession.script[6].instrument, "adiyogi_method");
assert.equal(cobraSession.script[6].observe_only, undefined);
assert.match(cobraSession.script[0].spoken, /school_device/);
assert.match(cobraSession.script[3].spoken, /Inhale 4/);
assert.match(cobraSession.script[7].spoken, /Practice is not medical treatment/);
for (const beat of cobraSession.script) {
  assert.equal(hasMedicalClaim(beat.spoken), false);
}

const lowBreath = teach(profile({ breath_capacity: 1 }), { door: 49 });
assert.equal(lowBreath.status, "teaching");
assert.equal(lowBreath.script[1].observe_only, undefined);
assert.match(lowBreath.script[3].spoken, /shortened/);
assert.match(lowBreath.script[3].spoken, /inhale 2/);

const halted = teach(profile({ pain: true }), { door: 49 });
assert.equal(halted.status, "halt");
assert.equal(halted.door, null);
assert.equal(halted.script.length, 0);
assert.equal(halted.regression_door, 1);
assert.equal(halted.gates[0].law, "PAIN_IS_INFORMATION");
assert.match(halted.message, /Never push through/);

const haltedOnMountain = teach(profile({ pain: true }), { door: 1 });
assert.equal(haltedOnMountain.regression_door, null);

const lotusOpenSeat = teach(profile({}), { door: 112 });
assert.equal(lotusOpenSeat.status, "teaching");
assert.equal(lotusOpenSeat.script.length, 8);
assert.match(lotusOpenSeat.script[1].spoken, /Open-seat twin/);
assert.match(lotusOpenSeat.script[1].spoken, /Never force/);
assert.doesNotMatch(lotusOpenSeat.script[1].spoken, /haul/);
assert.equal(lotusOpenSeat.script[6].observe_only, true);
assert.match(lotusOpenSeat.script[6].spoken, /Observe only/);
assert.match(lotusOpenSeat.script[6].spoken, /Not a class drill/);
assert.match(lotusOpenSeat.script[6].spoken, /138/);

const lotusReadyStillObserved = teach(
  profile({
    lotus_ready: true,
    vbt_observe_only: false,
    intensity_clearance: 5,
    breath_capacity: 5,
  }),
  { door: 112 },
);
assert.equal(lotusReadyStillObserved.status, "teaching");
assert.equal(lotusReadyStillObserved.script[6].observe_only, true);
assert.match(lotusReadyStillObserved.script[1].spoken, /Never force/);
assert.match(lotusReadyStillObserved.script[1].spoken, /Sukhāsana/);

const next = teach(profile({ completed_doors: [1] }));
assert.equal(next.status, "teaching");
assert.ok(next.door);
assert.equal(next.door ? doorNumber(next.door) : 0, 2);

const house1 = Array.from({ length: 16 }, (_, index) => index + 1);
const afterHouse = teach(profile({ completed_doors: house1 }));
assert.equal(afterHouse.status, "teaching");
assert.equal(afterHouse.door ? doorNumber(afterHouse.door) : 0, 49);

const afterHouseAndCobra = teach(profile({ completed_doors: [...house1, 49] }));
assert.equal(afterHouseAndCobra.status, "teaching");
assert.equal(afterHouseAndCobra.door ? doorNumber(afterHouseAndCobra.door) : 0, 112);
assert.match(afterHouseAndCobra.script[1].spoken, /Open-seat twin/);

const publicRoot = path.join(repoRoot(), "public");
const registry = JSON.parse(readFileSync(path.join(publicRoot, "doors.json"), "utf8")) as Array<{
  number: number;
  sanskrit: string | null;
  english: string | null;
  status: string;
  breath: unknown;
  guardian: string | null;
  pairing_type: string;
  lotus_never_forced: boolean;
  practice_mode: string | null;
  bija: string;
  element: string;
  color: string | null;
  house: number;
}>;
assert.equal(registry.length, 112);
const namedPublic = registry.filter((door) => door.status === "named");
const sealedPublic = registry.filter((door) => door.status === "sealed_unnamed");
assert.equal(namedPublic.length, 18);
assert.equal(sealedPublic.length, 94);
assert.deepEqual(
  namedPublic.map((door) => door.number),
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 49, 112],
);
for (const door of sealedPublic) {
  assert.equal(door.sanskrit, null, "sealed " + door.number + " sanskrit");
  assert.equal(door.english, null, "sealed " + door.number + " english");
  assert.equal(door.breath, null, "sealed " + door.number + " breath");
  assert.equal(door.guardian, null);
}
for (const door of registry) {
  assert.equal(door.pairing_type, "school_device");
  assert.equal(door.lotus_never_forced, true);
  if (door.guardian) assert.doesNotMatch(door.guardian, /chief of staff/i);
  assert.doesNotMatch(JSON.stringify(door), /432|dopamine/i);
}
const door1 = registry[0] as unknown as {
  guardian: string;
  benefits: string;
  yes: string;
  no: string;
  look: string;
  five_ways: string[];
  eight_beats: { script: string }[];
  derived: string[];
  field_sources: Record<string, string>;
  geometry: { summary: string };
};
assert.equal(door1.guardian, "MERU");
assert.equal(door1.field_sources.benefits, "owner_plate");
assert.equal(door1.field_sources.yes, "owner_plate");
assert.equal(door1.field_sources.no, "owner_plate");
assert.equal(door1.field_sources.mentality, "owner_plate");
assert.equal(door1.field_sources.emotion, "owner_plate");
assert.equal(door1.field_sources.physics, "owner_plate");
assert.equal(door1.field_sources.philosophy, "owner_plate");
assert.equal(door1.field_sources.five_ways, "owner_plate");
assert.equal(door1.field_sources.look, "owner_plate");
assert.equal(door1.field_sources.eight_beats, "research");
assert.equal(door1.field_sources.geometry, "research");
assert.equal(door1.benefits, "Wakes the feet. Settles fidgeting. Gives the school its axis. A chair still opens this door.");
assert.equal(door1.yes, "Soft knees. Even three points.");
assert.equal(door1.look, "Heel, big-toe pad, little-toe pad.");
assert.equal(door1.eight_beats.length, 8);
assert.equal(door1.derived.includes("five_ways"), false);
assert.match(door1.geometry.summary, /vertical column/);
const ownerUi = readFileSync(path.join(repoRoot(), "ui", "door-001.html"), "utf8");
assert.match(ownerUi, /src="media\/door001_guru_meru\.mp4"/);
assert.doesNotMatch(ownerUi, /meru\.js/);
const publicDoor1 = readFileSync(path.join(publicRoot, "door-001.html"), "utf8");
assert.match(publicDoor1, /Wakes the feet/);
assert.match(publicDoor1, /meru\.js/);
assert.doesNotMatch(publicDoor1, /door001_guru_meru\.mp4/);
assert.doesNotMatch(publicDoor1, /http-equiv="refresh"/);
assert.equal(registry[48]?.guardian, "NAGINI");
assert.equal(registry[48]?.bija, "YAM");
assert.equal(registry[48]?.element, "Air");
assert.equal(registry[48]?.house, 4);
assert.equal(registry[111]?.guardian, "PADMA");
assert.equal(registry[111]?.bija, "silence");
assert.equal(registry[111]?.element, "Crown");
assert.equal(registry[0]?.bija, "LAM");
assert.equal(registry[0]?.color, "vermilion");
assert.equal(registry[0]?.house, 1);
assert.equal(registry[16]?.status, "sealed_unnamed");
assert.equal(registry[16]?.house, 2);
assert.equal(registry[16]?.bija, "VAM");
assert.equal(registry[12]?.practice_mode, "observe_only");
assert.equal(registry[111]?.practice_mode, "observe_only");
for (const door of namedPublic) {
  assert.equal(typeof door.sanskrit, "string");
  assert.equal(typeof door.english, "string");
  assert.equal(
    existsSync(path.join(publicRoot, "door-" + String(door.number).padStart(3, "0") + ".html")),
    true,
  );
}
for (let part = 1; part <= 4; part += 1) {
  const slice = JSON.parse(
    readFileSync(path.join(publicRoot, "doors-part" + part + ".json"), "utf8"),
  ) as unknown[];
  assert.equal(slice.length, 28);
  assert.deepEqual(slice, registry.slice((part - 1) * 28, part * 28));
}
for (const file of readdirSync(publicRoot)) {
  if (!file.endsWith(".html") && !file.endsWith(".js")) continue;
  const html = readFileSync(path.join(publicRoot, file), "utf8");
  assert.doesNotMatch(html, /Chief of Staff/);
  for (const match of html.matchAll(/<(?:video|source)\b[^>]*\ssrc=["']([^"']+\.mp4)/gi)) {
    const rel = match[1].replace(/^\//, "");
    assert.equal(existsSync(path.join(publicRoot, rel)), true, file + " missing " + match[1]);
  }
}

console.log("self-check ok");
