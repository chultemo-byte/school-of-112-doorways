/**
 * Build public/doors.json, the four part files, and static door pages
 * from the research records. Calculated fields are listed on `derived`.
 * Run from the repo root: node scripts/build-public-doors.mjs
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const UNIVERSAL = "If it hurts, stop. A chair still opens the door.";
const NAMED = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 49, 112]);
const HOUSES = [
  { house: 1, house_name: "Mūlādhāra", element: "Earth", bija: "LAM", color: "vermilion", color_source: "ui/index.html", from: 1, to: 16 },
  { house: 2, house_name: "Svādhiṣṭhāna", element: "Water", bija: "VAM", color: null, color_source: "absent", from: 17, to: 32 },
  { house: 3, house_name: "Maṇipūra", element: "Fire", bija: "RAM", color: null, color_source: "absent", from: 33, to: 48 },
  { house: 4, house_name: "Anāhata", element: "Air", bija: "YAM", color: null, color_source: "absent", from: 49, to: 64 },
  { house: 5, house_name: "Viśuddha", element: "Ether", bija: "HAM", color: null, color_source: "absent", from: 65, to: 80 },
  { house: 6, house_name: "Ājñā", element: "Sight", bija: "OM", color: null, color_source: "absent", from: 81, to: 96 },
  { house: 7, house_name: "Sahasrāra", element: "Crown", bija: "silence", color: null, color_source: "absent", from: 97, to: 112 },
];
const FILMS = {
  1: ["public/media/door001_guru_meru.mp4", "ui/media/door001_guru_meru.mp4"],
  2: ["public/media/door002_sky_reach.mp4", "ui/media/door002_sky_reach.mp4"],
  3: ["public/media/door003_ragdoll.mp4", "ui/media/door003_ragdoll.mp4"],
  5: ["public/media/door005_low_lunge.mp4", "ui/media/door005_low_lunge.mp4"],
};
const YESNO = {
  1: { yes: "Soft knees. Even three points.", no: "Locked legs. Fidgeting feet.", file: "ui/door-001.html" },
  2: { yes: "shoulders drop away from ears", no: "avoid forcing arms behind the ears", file: "doors/D-002/door.json" },
  3: { yes: "Keep knees soft as needed", no: "Avoid forcing straight legs", file: "doors/D-003/door.json" },
  4: { yes: "whichever height keeps the spine long", no: "Avoid pressing hands on the knee joints", file: "doors/D-004/door.json" },
  5: { yes: "front knee stacks over the ankle", no: "not collapsing inward", file: "doors/D-005/door.json" },
  6: { yes: "Knees may bend", no: "do not force heels to the floor", file: "doors/D-006/door.json" },
  7: { yes: "Hips neither pike nor sag", no: "Do not sag or pike through pain", file: "doors/D-007/door.json" },
  8: { yes: "elbows track close beside the ribs", no: "do not force the shoulders below the elbows", file: "doors/D-008/door.json" },
  9: { yes: "lift the thighs so only hands and feet touch the floor", no: "do not throw the head back", file: "doors/D-009/door.json" },
  10: { yes: "front knee tracks over the ankle without collapsing inward", no: "do not wrench the back knee by forcing the pelvis fully square", file: "doors/D-010/door.json" },
  11: { yes: "Front knee bends over the ankle without collapsing inward", no: "Do not force the front thigh parallel", file: "doors/D-011/door.json" },
  12: { yes: "without collapsing the underside waist", no: "do not collapse the lower ribs onto the front leg", file: "doors/D-012/door.json" },
  13: { yes: "soften the front knee if the hamstring shouts", no: "Never yank the neck or force the bottom hand lower", file: "doors/D-013/door.json" },
  14: { yes: "Keep the chest open toward the side/ceiling", no: "never collapse the front knee inward", file: "doors/D-014/door.json" },
  15: { yes: "long concave spine", no: "avoid dumping weight onto the neck", file: "doors/D-015/door.json" },
  16: { yes: "inner thigh or calf", no: "never the knee", file: "doors/D-016/door.json" },
  49: { yes: "Teach the lower one.", no: "Do not cue a higher head.", file: "doors/049.json" },
  112: { yes: "the chair is an honest seat for today", no: "Never force Padmāsana.", file: "doors/112.json" },
};
const STILLS = ["Front", "Side", "Back", "Up", "Close", "YES", "NO"].map((slot) => ({ slot, exists: false }));

function readJson(rel) {
  return JSON.parse(readFileSync(path.join(ROOT, rel), "utf8"));
}
function houseOf(n) {
  const h = HOUSES.find((x) => n >= x.from && n <= x.to);
  if (!h) throw new Error("house " + n);
  return h;
}
function pad(n) {
  return String(n).padStart(3, "0");
}
function sourcePath(n) {
  if (n >= 1 && n <= 16) return "doors/D-" + pad(n) + "/door.json";
  if (n === 49) return "doors/049.json";
  if (n === 112) return "doors/112.json";
  return null;
}
function mustContain(file, needle) {
  const text = readFileSync(path.join(ROOT, file), "utf8");
  if (!text.includes(needle)) throw new Error("Missing in " + file + ": " + needle);
}
function verseFromRef(ref) {
  if (!ref) return null;
  const m = ref.match(/verse\s+(\d+)/i);
  return m ? Number(m[1]) : null;
}
function filmFor(n) {
  const cands = FILMS[n] || [];
  for (const rel of cands) {
    if (existsSync(path.join(ROOT, rel))) {
      return rel.startsWith("public/") ? rel.slice("public/".length) : rel;
    }
  }
  return null;
}
function guardianFor(n) {
  if (n === 1) return "MERU";
  if (n === 49) return "NAGINI";
  if (n === 112) return "PADMA";
  return "unnamed — waiting";
}
function quoteBandha(cue) {
  if (!cue) return null;
  const patterns = ["No forced hold.", "Never force the pause.", "No forced retention.", "No forced breath-hold."];
  for (const p of patterns) if (cue.includes(p)) return p;
  return null;
}

function researchDoor(n, raw, h) {
  const derived = [];
  const sources = {
    number: "research",
    sanskrit: "research",
    english: "research",
    house: raw.house === h.house ? "research" : "school_map",
    element: "ui/112.html",
    color: h.color_source,
    bija: "school_map",
    geometry: "research",
    "geometry.vertices": "absent",
    reaction: "research",
    "reaction.reactants": "absent",
    "reaction.catalyst": "absent",
    "reaction.product": "absent",
    breath: "research",
    orientation: "research",
    "orientation.hand_placement": "absent",
    "orientation.joint_lead": "absent",
    attention: "research",
    adiyogi_method: "research",
    guardian: "owner",
    safety_notes: "research",
    five_ways: "school_default",
    eight_beats: "research",
    exit: "research",
    pairing_type: raw.honesty && raw.honesty.pairing_type === "school_device" ? "research" : "school_law",
    lotus_never_forced: raw.safety && raw.safety.never_force === true ? "research" : "school_law",
    yes: "research",
    no: "research",
  };
  const yn = YESNO[n];
  mustContain(yn.file, yn.yes);
  mustContain(yn.file, yn.no);
  if (yn.file.startsWith("ui/")) {
    sources.yes = yn.file;
    sources.no = yn.file;
  }
  const verse = verseFromRef(raw.adiyogi && raw.adiyogi.vbt_ref);
  if (verse == null) sources["adiyogi_method.vbt_verse"] = "absent";
  const bandha = quoteBandha(raw.breath && raw.breath.cue);
  if (!bandha) sources["breath.bandha"] = "absent";
  const beat = (k) => {
    const b = raw.beats.find((x) => x.n === k);
    if (!b) throw new Error("missing beat " + k + " on " + n);
    return b.script;
  };
  const safety = [raw.safety.pain_rule, raw.safety.open_seat_alternate, raw.safety.contraindication_notes].filter(Boolean);
  const fiveFromBeats = n !== 1;
  if (fiveFromBeats) derived.push("five_ways");
  const door = {
    number: n,
    sanskrit: raw.sanskrit,
    english: raw.name,
    house: h.house,
    house_name: h.house_name,
    element: h.element,
    color: h.color,
    bija: h.bija,
    geometry: {
      polygon: raw.geometry.polygon,
      vertices: null,
      summary: raw.geometry.summary,
      svg_hint: raw.geometry.svg_hint || null,
    },
    reaction: {
      reactants: null,
      catalyst: null,
      product: null,
      phase: raw.reaction.name,
      from_phase: raw.reaction.from_phase,
      to_phase: raw.reaction.to_phase,
      note: raw.reaction.summary,
    },
    breath: {
      inhale: raw.breath.inhale,
      exhale: raw.breath.exhale,
      pause: raw.breath.hold,
      bandha: bandha,
      cycles: raw.breath.cycles,
      lands_in: raw.breath.lands_in,
      cue: raw.breath.cue,
    },
    orientation: {
      hand_placement: null,
      gaze: raw.orientation.gaze || null,
      joint_lead: null,
      cue: raw.orientation.cue,
      gravity: raw.orientation.gravity,
    },
    attention: {
      locus: raw.attention.primary,
      secondary: raw.attention.secondary || null,
      chakra: raw.attention.chakra || null,
    },
    adiyogi_method: {
      vbt_verse: verse,
      vbt_ref: raw.adiyogi.vbt_ref,
      summary: raw.adiyogi.method_summary,
      verse_paraphrase: raw.adiyogi.verse_paraphrase || null,
      practice_mode: raw.adiyogi.practice_mode,
    },
    guardian: guardianFor(n),
    safety_notes: safety,
    eight_beats: raw.beats.map((b) => ({ n: b.n, title: b.title, script: b.script })),
    five_ways: fiveFromBeats ? [beat(1), beat(2), beat(3), beat(4), beat(8)] : null,
    five_ways_basis: fiveFromBeats ? "Beats 1, 2, 3, 4, and 8, verbatim from the research record." : null,
    exit: beat(8),
    yes: yn.yes,
    no: yn.no,
    look: raw.orientation.gaze || null,
    water: raw.breath.cue,
    open_seat: raw.safety.open_seat_alternate || null,
    honesty: raw.honesty.disclosure,
    pairing_type: "school_device",
    lotus_never_forced: true,
    practice_mode: raw.adiyogi.practice_mode,
    status: "named",
    film: filmFor(n),
    stills: STILLS,
    field_sources: sources,
    derived,
  };
  if (n === 1) applyOwnerPlate001(door, raw);
  return door;
}

const OWNER_PLATE_001 = {
  look: "Heel, big-toe pad, little-toe pad.",
  yes: "Soft knees. Even three points.",
  no: "Locked legs. Fidgeting feet.",
  benefits: "Wakes the feet. Settles fidgeting. Gives the school its axis. A chair still opens this door.",
  mentality: "Nothing to prove. Arrive. If the mind wanders, return to the quiet foot point.",
  emotion: "Quiet pride is allowed. Fidgeting is information, not failure.",
  physics: "Three-point base resists sway. Soft knees keep the line alive. A locked knee is a held breath in the leg.",
  philosophy: "Sthira-sukham āsanam. The mountain does not imagine. It just stands. Door 001 is paired with VBT dharana 001 as a school device, not ancient one-to-one canon.",
  five_ways: ["Stand.", "Soften the knees.", "Find three points.", "Breathe 4 and 4.", "Stop if it hurts."],
};

function applyOwnerPlate001(door, raw) {
  const plate = "ui/door-001.html";
  for (const [key, value] of Object.entries(OWNER_PLATE_001)) {
    const needle = Array.isArray(value) ? "1 Stand. 2 Soften the knees. 3 Find three points. 4 Breathe 4 and 4. 5 Stop if it hurts." : value;
    mustContain(plate, needle.startsWith("Sthira") ? "Sthira-sukham āsanam." : needle);
    door[key] = value;
    door.field_sources[key] = "owner_plate";
  }
  mustContain(plate, "The mountain does not imagine. It just stands.");
  door.eight_beats = raw.beats.map((b) => ({ n: b.n, title: b.title, script: b.script }));
  door.field_sources.eight_beats = "research";
  door.field_sources.look = "owner_plate";
  door.five_ways_basis = "Owner plate on ui/door-001.html. The research record has no five_ways field.";
}

function prototypeDoor(n, raw, h) {
  const derived = [];
  const sources = {
    number: "research",
    sanskrit: "research",
    english: "research",
    house: "school_map",
    element: "ui/112.html",
    color: h.color_source,
    bija: "school_map",
    geometry: "research",
    reaction: "research",
    breath: "research",
    orientation: "research",
    attention: "research",
    adiyogi_method: "research",
    guardian: "owner",
    safety_notes: "research",
    five_ways: "research",
    exit: "research",
    pairing_type: raw.pairing_type === "school_device" ? "research" : "school_law",
    lotus_never_forced: raw.safety && raw.safety.bind === "never_force" ? "research" : "school_law",
    yes: "research",
    no: "research",
  };
  const yn = YESNO[n];
  mustContain(yn.file, yn.yes);
  mustContain(yn.file, yn.no);
  derived.push("water");
  const mode = raw.practice_mode || (raw.adiyogi_method && raw.adiyogi_method.practice_mode) || null;
  const exit = n === 49 ? raw.five_ways[2] : raw.safety_notes[0];
  const open = (raw.safety && (raw.safety.open_seat_twin || raw.alternate_geometry && raw.alternate_geometry.seat)) || (raw.alternate_geometry && raw.alternate_geometry.seat) || null;
  return {
    number: n,
    sanskrit: raw.sanskrit,
    english: raw.english,
    house: h.house,
    house_name: h.house_name,
    element: h.element,
    color: h.color,
    bija: h.bija,
    geometry: {
      polygon: raw.geometry.polygon,
      vertices: raw.geometry.vertices,
      summary: null,
      units: raw.geometry.units || null,
    },
    reaction: {
      reactants: raw.reaction.reactants,
      catalyst: raw.reaction.catalyst,
      product: raw.reaction.product,
      phase: raw.reaction.phase,
      from_phase: null,
      to_phase: null,
      note: raw.reaction.note || null,
    },
    breath: {
      inhale: raw.breath.inhale,
      exhale: raw.breath.exhale,
      pause: raw.breath.pause,
      bandha: raw.breath.bandha,
      pause_after: raw.breath.pause_after || null,
      cue: null,
    },
    orientation: {
      hand_placement: raw.orientation.hand_placement,
      gaze: raw.orientation.gaze,
      joint_lead: raw.orientation.joint_lead,
      cue: null,
      gravity: null,
    },
    attention: {
      locus: raw.attention.locus,
      secondary: null,
      chakra: raw.attention.chakra || null,
    },
    adiyogi_method: {
      vbt_verse: raw.adiyogi_method.vbt_verse,
      vbt_ref: null,
      summary: raw.adiyogi_method.summary,
      verse_paraphrase: null,
      practice_mode: raw.adiyogi_method.practice_mode,
      yukti: raw.adiyogi_method.yukti ?? null,
    },
    guardian: guardianFor(n),
    safety_notes: raw.safety_notes,
    five_ways: raw.five_ways,
    exit,
    yes: yn.yes,
    no: yn.no,
    look: raw.orientation.gaze,
    water: "Inhale " + raw.breath.inhale + ", exhale " + raw.breath.exhale + ", pause " + raw.breath.pause + (raw.breath.pause_after && raw.breath.pause_after !== "none" ? " after " + raw.breath.pause_after : "") + ". " + raw.breath.bandha,
    open_seat: open,
    honesty: raw.lineage,
    pairing_type: "school_device",
    lotus_never_forced: true,
    practice_mode: mode,
    requires_lotus: raw.requires_lotus === true,
    status: "named",
    film: filmFor(n),
    stills: STILLS,
    field_sources: sources,
    derived,
  };
}

function sealedDoor(n) {
  const h = houseOf(n);
  return {
    number: n,
    sanskrit: null,
    english: null,
    house: h.house,
    house_name: h.house_name,
    element: h.element,
    color: h.color,
    bija: h.bija,
    geometry: null,
    reaction: null,
    breath: null,
    orientation: null,
    attention: null,
    adiyogi_method: null,
    guardian: null,
    safety_notes: [UNIVERSAL],
    five_ways: null,
    exit: UNIVERSAL,
    yes: null,
    no: null,
    look: null,
    water: null,
    open_seat: null,
    honesty: null,
    pairing_type: "school_device",
    lotus_never_forced: true,
    practice_mode: null,
    status: "sealed_unnamed",
    film: null,
    stills: STILLS,
    field_sources: {
      house: "school_map",
      element: "ui/112.html",
      color: h.color_source,
      bija: "school_map",
      safety_notes: "school_default",
      exit: "school_default",
      pairing_type: "school_law",
      lotus_never_forced: "school_law",
    },
    derived: ["safety_notes", "exit"],
  };
}

function buildDoors() {
  const doors = [];
  for (let n = 1; n <= 112; n++) {
    if (!NAMED.has(n)) {
      doors.push(sealedDoor(n));
      continue;
    }
    const raw = readJson(sourcePath(n));
    const h = houseOf(n);
    doors.push(n <= 16 ? researchDoor(n, raw, h) : prototypeDoor(n, raw, h));
  }
  return doors;
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function textBlock(value) {
  if (value == null || value === "") return "<p class=\"waits\">waits</p>";
  return "<p>" + esc(value) + "</p>";
}
function hrefFor(n) {
  if (n < 1 || n > 112) return null;
  if (NAMED.has(n)) return "door-" + pad(n) + ".html";
  return "door-sealed.html?n=" + n;
}

const CSS = `  :root{--bg:#0b0a12;--ink:#f4efe6;--muted:#9a8f7a;--vermilion:#c0392b;--gold:#c9a227;--paper:#f4efe6}
  *{box-sizing:border-box} html,body{margin:0;padding:0}
  body{background:radial-gradient(1200px 800px at 50% -10%, #1a1530 0%, var(--bg) 60%);color:var(--ink);font-family:Georgia,serif;min-height:100vh}
  .wrap{max-width:760px;margin:0 auto;padding:32px 20px 96px}
  header{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:center}
  .brand{font-weight:600;letter-spacing:.04em}
  .brand small{display:block;color:var(--muted);font-weight:400;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase}
  a{color:var(--gold);text-decoration:none}
  .eyebrow{color:var(--gold);letter-spacing:.22em;text-transform:uppercase;font-size:.74rem;text-align:center;margin-top:28px}
  h1{font-weight:500;font-size:clamp(2rem,6vw,3rem);line-height:1.05;margin:8px 0;text-align:center}
  h1 em{font-style:italic;color:var(--gold)}
  .sanskrit{text-align:center;color:var(--muted);font-style:italic;margin:0 0 18px}
  .mode{border-left:3px solid var(--vermilion);padding:8px 12px;margin:12px 0;background:rgba(192,57,43,.12)}
  .stage{border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:18px;background:linear-gradient(160deg,rgba(255,255,255,.03),transparent)}
  .slot{border:1px solid rgba(201,162,39,.4);border-radius:18px;min-height:220px;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px;background:#1a140c;color:var(--muted)}
  .shots{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:16px 0}
  .shot{border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:8px;text-align:center;font-size:.75rem}
  .shot b{display:block;color:var(--ink)}
  .shot span{color:var(--muted)}
  section.field{margin:16px 0}
  section.field h2{font-size:1rem;color:var(--gold);font-weight:500;margin:0 0 6px}
  section.field p,section.field li{line-height:1.5;margin:0 0 6px}
  .waits{color:var(--muted);font-style:italic}
  .yn{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .yn div{border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:10px}
  .safety{border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:12px 14px;margin:16px 0}
  .safety span{display:block;line-height:1.45}
  .law{margin:28px 0;color:var(--muted);line-height:1.6;border-top:1px solid rgba(255,255,255,.08);padding-top:16px}
  .law b{color:var(--gold)}
  nav.doors{display:flex;justify-content:space-between;gap:10px;margin-top:18px}
  footer{margin-top:22px;color:var(--muted);font-size:.8rem;text-align:center}
  .canvas-wrap{display:flex;justify-content:center}
  svg{width:100%;max-width:320px;height:auto}
  .controls{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:12px}
  button{font-family:system-ui,sans-serif;background:rgba(255,255,255,.06);color:var(--ink);border:1px solid rgba(255,255,255,.16);border-radius:999px;padding:8px 14px;cursor:pointer}
  button.primary{background:var(--vermilion);border-color:var(--vermilion)}
  .caption{text-align:center;color:var(--muted);line-height:1.5}
  @media(max-width:560px){.shots{grid-template-columns:1fr 1fr}}
`;

function listOrWaits(items) {
  if (!items || !items.length) return "<p class=\"waits\">waits</p>";
  return "<ol>" + items.map((item) => "<li>" + esc(item) + "</li>").join("") + "</ol>";
}

function geometryHtml(g) {
  if (!g) return "<p class=\"waits\">waits</p>";
  let html = "<p><b>Polygon.</b> " + esc(g.polygon || "waits") + "</p>";
  if (g.summary) html += "<p>" + esc(g.summary) + "</p>";
  if (g.units) html += "<p>" + esc(g.units) + "</p>";
  if (Array.isArray(g.vertices)) html += "<p>Vertices are on the record.</p>";
  else html += "<p class=\"waits\">Vertices wait. The research record has no vertex list.</p>";
  return html;
}
function reactionHtml(r) {
  if (!r) return "<p class=\"waits\">waits</p>";
  const bits = [];
  if (r.phase) bits.push("<p><b>Phase.</b> " + esc(r.phase) + "</p>");
  if (r.from_phase || r.to_phase) bits.push("<p>" + esc(r.from_phase || "") + (r.to_phase ? " → " + esc(r.to_phase) : "") + "</p>");
  if (Array.isArray(r.reactants)) bits.push("<p><b>Reactants.</b> " + esc(r.reactants.join("; ")) + "</p>");
  else bits.push("<p class=\"waits\">Reactants wait.</p>");
  if (r.catalyst) bits.push("<p><b>Catalyst.</b> " + esc(r.catalyst) + "</p>");
  if (r.product) bits.push("<p><b>Product.</b> " + esc(r.product) + "</p>");
  if (r.note) bits.push("<p>" + esc(r.note) + "</p>");
  return bits.join("");
}
function breathHtml(b) {
  if (!b) return "<p class=\"waits\">waits</p>";
  let html = "<p>Inhale " + esc(b.inhale) + ", exhale " + esc(b.exhale) + ", pause " + esc(b.pause) + ".</p>";
  if (b.cue) html += "<p>" + esc(b.cue) + "</p>";
  if (b.bandha) html += "<p><b>Bandha.</b> " + esc(b.bandha) + "</p>";
  else html += "<p class=\"waits\">Bandha waits.</p>";
  if (b.lands_in) html += "<p>Lands in " + esc(b.lands_in) + ".</p>";
  return html;
}
function orientationHtml(o) {
  if (!o) return "<p class=\"waits\">waits</p>";
  let html = "";
  html += o.gaze ? "<p><b>Gaze.</b> " + esc(o.gaze) + "</p>" : "<p class=\"waits\">Gaze waits.</p>";
  html += o.hand_placement ? "<p><b>Hands.</b> " + esc(o.hand_placement) + "</p>" : "<p class=\"waits\">Hand placement waits.</p>";
  html += o.joint_lead ? "<p><b>Joint lead.</b> " + esc(o.joint_lead) + "</p>" : "<p class=\"waits\">Joint lead waits.</p>";
  if (o.cue) html += "<p>" + esc(o.cue) + "</p>";
  if (o.gravity) html += "<p>" + esc(o.gravity) + "</p>";
  return html;
}

function plate(door) {
  const beat = door.eight_beats && door.eight_beats[0] && door.eight_beats[0].script;
  return {
    number: door.number,
    sealed: false,
    english: door.english,
    sanskrit: door.sanskrit,
    guardian: door.guardian,
    look: door.look,
    water: door.water,
    exit: door.exit,
    yes: door.yes || null,
    no: door.no || null,
    house: door.house,
    house_name: door.house_name,
    bija: door.bija,
    element: door.element,
    beat: beat || null,
    practice_mode: door.practice_mode || null,
    lotus_never_forced: door.lotus_never_forced === true,
    safety: (door.safety_notes && door.safety_notes[0]) || UNIVERSAL,
    open_seat: door.open_seat,
  };
}

const ASANA = " data-meru=\"asana\" role=\"button\" tabindex=\"0\" aria-label=\"Guru Meru speaks this door\"";
function filmBlock(door) {
  if (door.film && String(door.film).endsWith(".mp4")) {
    return "<div class=\"slot\"" + ASANA + "><video controls src=\"" + esc(door.film) + "\"></video></div>";
  }
  return "<div class=\"slot\"" + ASANA + ">animation slot — same camera as 001</div>";
}

function page(door, stage, play) {
  const prev = hrefFor(door.number - 1);
  const next = hrefFor(door.number + 1);
  const accepted001 = door.number === 1;
  let body = "";
  body += "<header><div class=\"brand\">School of 112 Doorways<small>Door " + pad(door.number) + "</small></div><nav><a href=\"index.html\">Gate</a> <a href=\"pose.html?n=" + door.number + "\">Constructor</a></nav></header>";
  if (accepted001) {
    body += "<div class=\"eyebrow\">Door 001 · House 1 · Earth</div>";
    body += "<h1" + ASANA + ">Tāḍāsana <em>stands.</em></h1>";
    body += "<p class=\"sanskrit\">The Unmoving Standing · Guardian MERU · LAM</p>";
    body += stage;
  } else {
    body += "<div class=\"eyebrow\">Door " + pad(door.number) + " · House " + door.house + " · " + esc(door.element) + "</div>";
    body += "<h1" + ASANA + ">" + esc(door.english) + "</h1>";
    body += "<p class=\"sanskrit\">" + esc(door.sanskrit) + " · Guardian " + esc(door.guardian) + " · " + esc(door.bija) + "</p>";
    body += filmBlock(door);
  }
  if (door.practice_mode === "observe_only") {
    body += "<p class=\"mode\">Practice mode: observe_only.</p>";
  }
  body += "<div class=\"shots\">" + door.stills.map((s) => "<div class=\"shot\"><b>" + esc(s.slot) + "</b><span>" + (s.exists ? "shot" : "not shot yet") + "</span></div>").join("") + "</div>";
  body += "<section class=\"field\"><h2>Look here</h2>" + textBlock(door.look) + "</section>";
  body += "<section class=\"field\"><h2>Water</h2>" + textBlock(door.water) + "</section>";
  body += "<section class=\"field\"><h2>Geometry</h2>" + geometryHtml(door.geometry) + "</section>";
  body += "<section class=\"field\"><h2>Reaction</h2>" + reactionHtml(door.reaction) + "</section>";
  body += "<section class=\"field\"><h2>Orientation</h2>" + orientationHtml(door.orientation) + "</section>";
  body += "<section class=\"field\"><h2>Attention</h2>" + textBlock(door.attention && door.attention.locus) + "</section>";
  const verse = door.adiyogi_method && door.adiyogi_method.vbt_verse;
  const ref = door.adiyogi_method && (door.adiyogi_method.vbt_ref || (verse ? "Verse " + verse : null));
  body += "<section class=\"field\"><h2>Adiyogi</h2>" + textBlock(ref) + textBlock(door.adiyogi_method && door.adiyogi_method.summary) + "</section>";
  body += "<section class=\"field\"><h2>Guardian</h2>" + textBlock(door.guardian) + "</section>";
  body += "<section class=\"field\"><h2>Safety</h2>" + listOrWaits(door.safety_notes) + "</section>";
  body += "<div class=\"safety\"><span>Start on the exhale.</span><span>Soft knees.</span><span>A chair still opens the door.</span><span>If it hurts, stop.</span></div>";
  body += "<section class=\"field\"><h2>Five ways</h2>" + listOrWaits(door.five_ways) + (door.five_ways_basis ? "<p class=\"waits\">" + esc(door.five_ways_basis) + "</p>" : "") + "</section>";
  body += "<section class=\"field\"><h2>Exit</h2>" + textBlock(door.exit) + "</section>";
  if (door.open_seat) body += "<section class=\"field\"><h2>Open seat</h2>" + textBlock(door.open_seat) + "</section>";
  if (door.honesty) body += "<section class=\"field\"><h2>Honesty</h2>" + textBlock(door.honesty) + "</section>";
  body += "<section class=\"law\"><b>sthira-sukham āsanam</b> — Steady and easeful. Pain is information, never a badge. Practice is not medical treatment. Pairing type: school_device.</section>";
  body += "<nav class=\"doors\">" + (prev ? "<a href=\"" + prev + "\">← " + pad(door.number - 1) + "</a>" : "<span></span>") + "<a href=\"pose.html?n=" + door.number + "\">pose</a>" + (next ? "<a href=\"" + next + "\">" + pad(door.number + 1) + " →</a>" : "<span></span>") + "</nav>";
  body += "<footer>School of 112 Doorways · lotus is never forced</footer>";
  const json = JSON.stringify(plate(door)).replace(/</g, "\\u003c");
  return "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\" />\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n<title>Door " + pad(door.number) + " · " + esc(door.english) + "</title>\n<style>\n" + CSS + "</style>\n</head>\n<body>\n<div class=\"wrap\">\n" + body + "\n</div>\n<script type=\"application/json\" id=\"meru-plate\">" + json + "</script>\n<script src=\"meru.js\"></script>\n" + (accepted001 ? play : "") + "\n</body>\n</html>\n";
}

const doors = buildDoors();
writeFileSync(path.join(ROOT, "public/doors.json"), JSON.stringify(doors, null, 2) + "\n");
for (let i = 0; i < 4; i++) {
  writeFileSync(path.join(ROOT, "public/doors-part" + (i + 1) + ".json"), JSON.stringify(doors.slice(i * 28, (i + 1) * 28), null, 2) + "\n");
}
const stage = readFileSync(path.join(ROOT, "scripts/fragments/door-001-stage.html"), "utf8");
const play = readFileSync(path.join(ROOT, "scripts/fragments/door-001-play.js.html"), "utf8");
function emitPublicDoor001(door) {
  const video = '<video autoplay muted loop playsinline controls src="media/door001_guru_meru.mp4">Guru Meru stands.</video>';
  let html = readFileSync(path.join(ROOT, "ui/door-001.html"), "utf8");
  if (!html.includes(video)) throw new Error("owner plate video line moved");
  html = html.replace(
    video,
    '<p style="margin:0;min-height:280px;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px;color:#e8d7b4">animation slot — same camera as 001</p>',
  );
  html = html.replace('href="112.html"', 'href="../ui/112.html"');
  html = html.replace(/\.\.\/public\/meru\.js/g, "meru.js");
  const json = JSON.stringify(plate(door)).replace(/</g, "\\u003c");
  const plateTag = '<script type="application/json" id="meru-plate">' + json + "</script>\n";
  if (html.includes('id="meru-plate"')) {
    html = html.replace(/<script type="application\/json" id="meru-plate">[\s\S]*?<\/script>\n?/, plateTag);
  } else if (html.includes('src="meru.js"')) {
    html = html.replace('<script src="meru.js"></script>', plateTag + '<script src="meru.js"></script>');
  } else {
    html = html.replace("</body>", plateTag + '<script src="meru.js"></script>\n</body>');
  }
  if (!html.includes("</body>")) throw new Error("owner plate has no body");
  writeFileSync(path.join(ROOT, "public/door-001.html"), html);
}

for (const door of doors) {
  if (door.status !== "named") continue;
  if (door.number === 1) {
    emitPublicDoor001(door);
    continue;
  }
  writeFileSync(path.join(ROOT, "public/door-" + pad(door.number) + ".html"), page(door, stage, play));
}
const report = doors.filter((d) => d.status === "named").map((d) => ({
  number: d.number,
  english: d.english,
  derived: d.derived,
  absent: Object.entries(d.field_sources).filter(([, v]) => v === "absent").map(([k]) => k),
  guardian: d.guardian,
  film: d.film,
  practice_mode: d.practice_mode,
}));
writeFileSync("/tmp/field-report.json", JSON.stringify(report, null, 2));
const city = readFileSync(path.join(ROOT, "ui/112.html"), "utf8");
if (!city.includes("&meru=1")) throw new Error("ui/112.html cells must open the door with meru=1");
writeFileSync(path.join(ROOT, "public/112.html"), city);
console.log("doors", doors.length, "named", doors.filter((d) => d.status === "named").length, "sealed", doors.filter((d) => d.status === "sealed_unnamed").length);
console.log("films", doors.filter((d) => d.film).map((d) => d.number + ":" + d.film).join(", ") || "none");
