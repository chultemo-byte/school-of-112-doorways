import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { loadDoor, loadIndex, repoRoot } from "./doors.ts";
import { teach, DEFAULT_PROFILE } from "./sequencer.ts";
import { FIVE_HARD_LAWS, hasMedicalClaim, vbtMode } from "./safety.ts";
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

const door1 = loadDoor(1);
const cobra = loadDoor(49);
const lotus = loadDoor(112);
assert.equal(isResearchDoor(cobra), false);
assert.equal(isResearchDoor(lotus), false);
if (isResearchDoor(cobra) || isResearchDoor(lotus)) {
  throw new Error("Doors 49 and 112 stay on the prototype record.");
}
assert.equal(isResearchDoor(door1), true);
if (!isResearchDoor(door1)) {
  throw new Error("Door 1 must load the researched record.");
}
assert.equal(door1.id, "D-001");
assert.equal(door1.name, "Resting in the Two Turning Points of the Breath");
assert.equal(door1.status, "draft");
assert.equal(door1.honesty.pairing_type, "school_device");
assert.equal(door1.adiyogi.practice_mode, "practice");
assert.equal(door1.adiyogi.vbt_ref, "VBT dharana 001 (verse 24)");

// House 1 is VBT dharanas 1-16 (Jaideva Singh numbering: door N = dharana N = verse N + 23).
const OBSERVE_ONLY_DOORS = [4, 8, 13, 14];
for (let number = 1; number <= 16; number += 1) {
  const raw = JSON.parse(
    readFileSync(path.join(repoRoot(), "doors", "D-" + String(number).padStart(3, "0"), "door.json"), "utf8"),
  ) as {
    schema_version: string;
    framing: string;
    practice_mode: string;
    dharana: { number: number; verses: number[] };
    adiyogi: { practice_mode: string };
    breath: { hold: number };
  };
  assert.equal(raw.schema_version, "2.0.0");
  assert.equal(raw.framing, "vbt_dharana");
  assert.equal(raw.dharana.number, number);
  assert.equal(raw.dharana.verses[0], number + 23);
  assert.equal(raw.breath.hold, 0);
  const observe = OBSERVE_ONLY_DOORS.includes(number);
  assert.equal(raw.practice_mode, observe ? "historical/observe_only" : "practice", "door " + number + " mode");
  assert.equal(raw.adiyogi.practice_mode, observe ? "observe_only" : "practice", "door " + number + " adiyogi mode");
  const door = loadDoor(number);
  assert.equal(isResearchDoor(door), true);
  assert.equal(vbtMode(door), observe ? "observe_only" : "practice", "door " + number + " vbtMode gate");
  assert.equal(teach(profile({}), { door: number }).script[6]?.observe_only, observe ? true : undefined);
}
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

const haltedOnDoor1 = teach(profile({ pain: true }), { door: 1 });
assert.equal(haltedOnDoor1.regression_door, null);

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
type PublicDoor = {
  number: number;
  status: string;
  house: number;
  bija: string;
  element: string;
  color: string | null;
  title: string | null;
  sanskrit: string | null;
  instruction: string | null;
  category: string | null;
  practice_mode: string | null;
  observe_only: boolean | null;
  dharana: { number: number; verse: number } | null;
  method?: { framing: string; text: string };
  beats?: unknown[] | null;
  breath?: unknown;
  seat?: unknown;
  safety?: { notes: string[]; observe_only_note: string | null };
  honesty?: { pairing_type: string; flags: string[] };
  guidance?: { slot: string; audio: unknown; visual: unknown };
};
const registry = JSON.parse(readFileSync(path.join(publicRoot, "doors.json"), "utf8")) as PublicDoor[];
assert.equal(registry.length, 112);
const openPublic = registry.filter((door) => door.status === "remembered");
const waitingPublic = registry.filter((door) => door.status === "being_remembered");
assert.deepEqual(
  openPublic.map((door) => door.number),
  Array.from({ length: 16 }, (_, i) => i + 1),
);
assert.equal(waitingPublic.length, 96);
for (const door of waitingPublic) {
  assert.equal(door.title, null, "door " + door.number + " title");
  assert.equal(door.sanskrit, null, "door " + door.number + " sanskrit");
  assert.equal(door.dharana, null, "door " + door.number + " dharana");
  assert.equal(door.instruction, null, "door " + door.number + " instruction");
}
for (const door of openPublic) {
  const n = door.number;
  assert.equal(door.dharana?.number, n);
  assert.equal(door.dharana?.verse, n + 23);
  assert.equal(typeof door.title, "string");
  assert.equal(typeof door.instruction, "string");
  assert.equal(typeof door.category, "string");
  assert.equal(door.honesty?.pairing_type, "school_device");
  assert.ok((door.honesty?.flags.length ?? 0) > 0);
  assert.ok((door.safety?.notes.length ?? 0) > 0);
  assert.equal(door.guidance?.slot, "#guidance-slot");
  const observe = OBSERVE_ONLY_DOORS.includes(n);
  assert.equal(door.observe_only, observe);
  assert.equal(door.practice_mode, observe ? "historical/observe_only" : "practice");
  const html = readFileSync(path.join(publicRoot, "door-" + String(n).padStart(3, "0") + ".html"), "utf8");
  assert.match(html, new RegExp("verse " + (n + 23) + "\\b"));
  assert.ok(html.includes(door.title ?? "\u0000"), "door " + n + " title on page");
  assert.match(html, /id="guidance-slot"/);
  assert.match(html, /id="honesty"/);
  assert.match(html, /id="safety"/);
  assert.doesNotMatch(html, /<video|\.mp4/);
  if (observe) {
    assert.match(html, /Historical \/ observe only/);
    assert.match(html, /<h2>Classical description<\/h2>/);
    assert.doesNotMatch(html, /How to sit with it|The eight beats|<h2>Breath<\/h2>/);
    assert.equal(door.method?.framing, "classical_description");
    assert.match(door.method?.text ?? "", /^Classical method: /);
    assert.equal(door.beats, null);
    assert.equal(door.breath, null);
    assert.equal(door.seat, null);
    assert.equal(typeof door.safety?.observe_only_note, "string");
  } else {
    assert.doesNotMatch(html, /Historical \/ observe only/);
    assert.equal(door.method?.framing, "practice");
    assert.equal(door.beats?.length, 8);
  }
}
const publicDoor1 = readFileSync(path.join(publicRoot, "door-001.html"), "utf8");
assert.match(publicDoor1, /Resting in the Two Turning Points of the Breath/);
assert.match(publicDoor1, /verse 24/);
assert.match(publicDoor1, /meru\.js/);
assert.doesNotMatch(publicDoor1, /http-equiv="refresh"/);
assert.equal(registry[0]?.bija, "LAM");
assert.equal(registry[0]?.color, "vermilion");
assert.equal(registry[0]?.house, 1);
assert.equal(registry[16]?.status, "being_remembered");
assert.equal(registry[16]?.house, 2);
assert.equal(registry[16]?.bija, "VAM");
assert.equal(registry[48]?.status, "being_remembered");
assert.equal(registry[48]?.house, 4);
assert.equal(registry[111]?.status, "being_remembered");
assert.equal(registry[111]?.element, "Crown");
for (let part = 1; part <= 4; part += 1) {
  const slice = JSON.parse(
    readFileSync(path.join(publicRoot, "doors-part" + part + ".json"), "utf8"),
  ) as unknown[];
  assert.equal(slice.length, 28);
  assert.deepEqual(slice, registry.slice((part - 1) * 28, part * 28));
}

// Framing law, retired posture names and medical claims: nothing public may carry them.
const FORBIDDEN_PUBLIC: RegExp[] = [
  /product/i, /course/i, /programme?/i, /\boffer/i, /breath is everything/i,
  /tadasana|tāḍāsana/i, /mountain/i, /uttanasana|uttanāsana/i, /plank/i, /chaturanga|caturaṅga/i,
  /virabhadrasana|vīrabhadrāsana/i, /trikonasana|trikoṇāsana/i, /vrksasana|vṛkṣāsana/i, /tree pose/i,
  /adho mukha/i, /urdhva mukha|ūrdhva mukha/i, /anjaneyasana|añjaneyāsana/i, /parsvakonasana|pārśvakoṇāsana/i,
  /prasarita|prasārita/i, /phalakasana|phalakāsana/i, /urdhva hastasana|ūrdhva hastāsana/i,
  /\b\w*[aā]sana\b/i, /\bpose\b/i, /\bcobra\b/i, /padm[aā]sana/i,
];
for (const file of readdirSync(publicRoot)) {
  if (!/\.(html|js|json)$/.test(file)) continue;
  const text = readFileSync(path.join(publicRoot, file), "utf8");
  const visible = text.replace(/<style>[\s\S]*?<\/style>/g, "");
  for (const re of FORBIDDEN_PUBLIC) {
    assert.doesNotMatch(visible, re, file + " carries " + re);
  }
  assert.doesNotMatch(text, /Chief of Staff/);
  assert.equal(hasMedicalClaim(visible.replace(/not medical advice/gi, "")), false, file + " medical claim");
  if (file.endsWith(".html")) {
    for (const href of text.matchAll(/href=["']([^"']*)["']/gi)) {
      assert.equal(href[1].includes("/ui/"), false, file + " href " + href[1]);
    }
  }
  for (const match of text.matchAll(/<(?:video|source)\b[^>]*\ssrc=["']([^"']+\.mp4)/gi)) {
    const rel = match[1].replace(/^\//, "");
    assert.equal(existsSync(path.join(publicRoot, rel)), true, file + " missing " + match[1]);
  }
}

const meruSrc = readFileSync(path.join(publicRoot, "meru.js"), "utf8");
assert.match(meruSrc, /being remembered/);
assert.match(meruSrc, /observe only/);
const indexHtml = readFileSync(path.join(publicRoot, "index.html"), "utf8");
for (let n = 1; n <= 16; n += 1) {
  assert.match(indexHtml, new RegExp('href="door-' + String(n).padStart(3, "0") + '\\.html"'));
}
assert.match(indexHtml, /being remembered/i);
const city = readFileSync(path.join(publicRoot, "112.html"), "utf8");
assert.match(city, /being remembered/);
assert.match(city, /door-sealed\.html\?n=49"/);

console.log("self-check ok");
