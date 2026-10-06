/**
 * Build the public site from the door records.
 *
 *   public/doors.json, public/doors-part1..4.json   registry (112 entries)
 *   public/door-001.html … door-016.html            House 1 door pages (VBT dhāraṇās 1–16)
 *   public/index.html                               the gate
 *   public/112.html                                 the city map
 *   public/door-049.html, public/door-112.html      redirects to the "being remembered" page
 *
 * House 1 door N is Vijñāna Bhairava Tantra dhāraṇā N in Jaideva Singh's numbering
 * (dhāraṇā 1 = verse 24). Doors 017–112 are "being remembered": nothing about them is
 * published until their research lands.
 *
 * Each door page carries an empty guidance slot (#guidance-slot) where a spoken guidance
 * player and a visual can be mounted later. It is hidden while empty.
 *
 * Run from the repo root: node scripts/build-public-doors.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const HOUSE1 = Array.from({ length: 16 }, (_, i) => i + 1);
const OBSERVE = "historical/observe_only";
const UNIVERSAL = "If anything hurts or feels distressing, stop, open the eyes and rest attention on the feet and the floor.";
const NOT_MEDICINE = "Practice is not medical treatment.";
const REMEMBERED_LINE = "This door is being remembered. Its dhāraṇā is not yet published here.";
const HOUSES = [
  { house: 1, house_name: "Mūlādhāra", element: "Earth", bija: "LAM", color: "vermilion", from: 1, to: 16 },
  { house: 2, house_name: "Svādhiṣṭhāna", element: "Water", bija: "VAM", color: null, from: 17, to: 32 },
  { house: 3, house_name: "Maṇipūra", element: "Fire", bija: "RAM", color: null, from: 33, to: 48 },
  { house: 4, house_name: "Anāhata", element: "Air", bija: "YAM", color: null, from: 49, to: 64 },
  { house: 5, house_name: "Viśuddha", element: "Ether", bija: "HAM", color: null, from: 65, to: 80 },
  { house: 6, house_name: "Ājñā", element: "Sight", bija: "OM", color: null, from: 81, to: 96 },
  { house: 7, house_name: "Sahasrāra", element: "Crown", bija: "silence", color: null, from: 97, to: 112 },
];

/** Words that must never reach a public page (framing law and the retired posture names). */
const FORBIDDEN = [
  /product/i, /course/i, /programme?/i, /\boffer/i, /breath is everything/i,
  /tadasana|tāḍāsana/i, /mountain/i, /uttanasana|uttanāsana/i, /plank/i, /chaturanga|caturaṅga/i,
  /virabhadrasana|vīrabhadrāsana/i, /trikonasana|trikoṇāsana/i, /vrksasana|vṛkṣāsana/i, /tree pose/i,
  /adho mukha/i, /urdhva mukha|ūrdhva mukha/i, /anjaneyasana|añjaneyāsana/i, /parsvakonasana|pārśvakoṇāsana/i,
  /prasarita|prasārita/i, /phalakasana|phalakāsana/i, /urdhva hastasana|ūrdhva hastāsana/i,
  /\b\w*[aā]sana\b/i, /\bpose\b/i, /\bcobra\b/i, /padm[aā]sana/i,
];
const MEDICAL = /\b(cures?|diagnos(?:e|es|is|tic)|heals?|healing|prescriptions?|treats)\b/i;
function medicalHit(text) {
  const stripped = text
    .replace(/practice is not medical treatment/gi, "")
    .replace(/not medical (?:treatment|advice)/gi, "")
    .replace(/\bnot a (?:cure|diagnosis|treatment|prescription)\b/gi, "")
    .replace(/\b(?:does not|do not|don't|never|no|not)\s+(?:diagnose|cure|heal|treat|prescribe)\w*/gi, "");
  const m = stripped.match(MEDICAL);
  return m ? m[0] : null;
}

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
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function modeLabel(mode) {
  return mode === OBSERVE ? "Historical / observe only" : "Practice";
}
/** For observe-only doors, keep only the classical description: the "Classical method:" sentence. */
function classicalDescription(summary, id) {
  const m = summary.match(/^Classical method(?: \([^)]*\))?:\s*([^]*?\.)(?=\s|$)/);
  if (!m) throw new Error(id + ": observe-only method must open with 'Classical method:'");
  return "Classical method: " + m[1].trim();
}
/** Doors an observe-only record points to for practice ("use Door 010", "Doors 001 to 003"). */
function alternativeDoors(summary) {
  const out = new Set();
  for (const m of summary.matchAll(/Doors? (\d{3})(?: to (\d{3}))?/g)) {
    const a = Number(m[1]);
    const b = m[2] ? Number(m[2]) : a;
    for (let k = a; k <= b; k++) out.add(k);
  }
  for (const m of summary.matchAll(/ or Door (\d{3})/g)) out.add(Number(m[1]));
  return [...out].filter((k) => k >= 1 && k <= 16).sort((x, y) => x - y);
}

const PLAIN = readJson("doors/HOUSE-1-PLAIN-LINES.json").lines;

function house1Door(n) {
  const rel = "doors/D-" + pad(n) + "/door.json";
  const raw = readJson(rel);
  const h = houseOf(n);
  const d = raw.dharana;
  if (raw.schema_version !== "2.0.0" || raw.framing !== "vbt_dharana") throw new Error(rel + " is not a v2 dharana record");
  if (d.number !== n) throw new Error(rel + ": dharana number " + d.number + " is not door " + n);
  if (raw.breath.hold !== 0) throw new Error(rel + ": breath hold must be 0");
  const observe = raw.practice_mode === OBSERVE;
  if (observe && !["observe_only", "historical"].includes(raw.adiyogi.practice_mode)) {
    throw new Error(rel + ": observe-only door must keep adiyogi.practice_mode observe_only");
  }
  if (!observe && raw.practice_mode !== "practice") throw new Error(rel + ": unknown practice_mode " + raw.practice_mode);
  const instruction = PLAIN[String(n)];
  if (!instruction) throw new Error("doors/HOUSE-1-PLAIN-LINES.json has no line for door " + n);
  if (observe !== instruction.startsWith("Observe only")) throw new Error("plain line for door " + n + " does not match its practice mode");
  const verse = d.verses[0];
  const safetyNotes = [raw.safety.pain_rule, raw.safety.contraindication_notes];
  if (!observe && raw.safety.open_seat_alternate) safetyNotes.push(raw.safety.open_seat_alternate);
  return {
    number: n,
    id: raw.id,
    status: "remembered",
    house: h.house,
    house_name: h.house_name,
    element: h.element,
    bija: h.bija,
    color: h.color,
    title: d.technique_name,
    sanskrit: raw.sanskrit,
    dharana: {
      number: d.number,
      verse,
      verses: d.verses,
      numbering: "Jaideva Singh (1979): dhāraṇā " + d.number + " = verse " + d.verses.join(", "),
      numbering_variants: d.numbering_variants || {},
      sanskrit_iast: d.sanskrit_iast,
      sanskrit_status: d.sanskrit_status,
      rendering: d.rendering,
      rendering_kind: d.rendering_kind,
      rendering_attribution: d.rendering_attribution || null,
      commentary_note: d.commentary_note || null,
      verification: d.verification.status,
    },
    category: d.category,
    category_secondary: d.category_secondary || [],
    instruction,
    practice_mode: raw.practice_mode,
    practice_mode_label: modeLabel(raw.practice_mode),
    observe_only: observe,
    method: observe
      ? {
          framing: "classical_description",
          text: classicalDescription(raw.adiyogi.method_summary, raw.id),
          note: "Historical / observe only. Read and understood, not practised. No practice cues are given for this door.",
          practise_instead: alternativeDoors(raw.adiyogi.method_summary),
        }
      : { framing: "practice", text: raw.adiyogi.method_summary, note: null, practise_instead: [] },
    seat: observe ? null : { label: raw.seat.label || null, summary: raw.seat.summary, honesty: raw.seat.honesty },
    breath: observe ? null : { mode: raw.breath.mode || "natural", cue: raw.breath.cue, honesty: raw.breath.honesty },
    attention: observe ? null : { primary: raw.attention.primary, secondary: raw.attention.secondary || null },
    attention_map: observe ? null : { summary: raw.geometry.summary, points: raw.geometry.points || [] },
    safety: {
      notes: safetyNotes,
      observe_only_note: raw.safety.observe_only_note || null,
      never_force: raw.safety.never_force === true,
    },
    honesty: {
      pairing_type: raw.honesty.pairing_type,
      disclosure: raw.honesty.disclosure,
      flags: raw.honesty.flags,
      review: raw.review ? raw.review.status : null,
    },
    beats: observe ? null : raw.beats.map((b) => ({ n: b.n, title: b.title, script: b.script })),
    sources: raw.sources.map((s) => ({ label: s.label, ref: s.ref || null, url: s.url || null })),
    guardian: n === 1 ? "MERU" : null,
    guidance: { slot: "#guidance-slot", audio: null, visual: null },
    page: "door-" + pad(n) + ".html",
  };
}

function rememberedDoor(n) {
  const h = houseOf(n);
  return {
    number: n,
    status: "being_remembered",
    house: h.house,
    house_name: h.house_name,
    element: h.element,
    bija: h.bija,
    color: h.color,
    title: null,
    sanskrit: null,
    dharana: null,
    category: null,
    instruction: null,
    practice_mode: null,
    observe_only: null,
    note: REMEMBERED_LINE,
    page: "door-sealed.html?n=" + n,
  };
}

const doors = [];
for (let n = 1; n <= 112; n++) doors.push(n <= 16 ? house1Door(n) : rememberedDoor(n));

// ---------- HTML ----------

const CSS = `  :root{--bg:#0b0a12;--ink:#f4efe6;--muted:#9a8f7a;--vermilion:#c0392b;--gold:#c9a227}
  *{box-sizing:border-box} html,body{margin:0;padding:0}
  body{background:radial-gradient(1200px 800px at 50% -10%, #1a1530 0%, var(--bg) 60%);color:var(--ink);font-family:Georgia,serif;min-height:100vh}
  .wrap{max-width:760px;margin:0 auto;padding:28px 20px 96px}
  header{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:center}
  .brand{font-weight:600;letter-spacing:.04em}
  .brand small{display:block;color:var(--muted);font-weight:400;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase}
  header nav a{margin-left:12px}
  a{color:var(--gold);text-decoration:none}
  .eyebrow{color:var(--gold);letter-spacing:.22em;text-transform:uppercase;font-size:.74rem;text-align:center;margin-top:28px;font-family:system-ui,sans-serif}
  h1{font-weight:500;font-size:clamp(1.9rem,5.5vw,2.8rem);line-height:1.1;margin:10px 0;text-align:center}
  .verse-ref{text-align:center;color:var(--muted);margin:0 0 14px}
  .badges{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:0 0 18px}
  .badge{font-family:system-ui,sans-serif;font-size:.78rem;border:1px solid rgba(255,255,255,.18);border-radius:999px;padding:4px 10px;color:var(--ink)}
  .badge.practice{border-color:rgba(201,162,39,.6)}
  .badge.observe{border-color:var(--vermilion);background:rgba(192,57,43,.18)}
  .observe-banner{border:1px solid var(--vermilion);border-left-width:4px;border-radius:12px;padding:12px 14px;margin:14px 0;background:rgba(192,57,43,.12);line-height:1.5}
  .observe-banner b{display:block;color:#f2b8ae;letter-spacing:.06em;text-transform:uppercase;font-size:.85rem;font-family:system-ui,sans-serif;margin-bottom:4px}
  .one-line{font-size:1.2rem;line-height:1.5;border:1px solid rgba(201,162,39,.4);border-radius:14px;padding:14px 16px;background:rgba(201,162,39,.06);margin:14px 0}
  .guidance-slot{margin:14px 0}
  .guidance-slot:empty{display:none}
  section.field{margin:20px 0}
  section.field h2{font-size:1rem;color:var(--gold);font-weight:500;margin:0 0 6px;font-family:system-ui,sans-serif;letter-spacing:.04em}
  section.field p,section.field li{line-height:1.55;margin:0 0 6px}
  .iast{font-style:italic;color:#e8d7b4}
  .muted{color:var(--muted)}
  .safety{border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:12px 16px}
  details{margin:14px 0;border-top:1px solid rgba(255,255,255,.08);padding-top:10px}
  summary{cursor:pointer;color:var(--gold);font-family:system-ui,sans-serif}
  .law{margin:28px 0;color:var(--muted);line-height:1.6;border-top:1px solid rgba(255,255,255,.08);padding-top:16px}
  nav.doors{display:flex;justify-content:space-between;gap:10px;margin-top:18px}
  footer{margin-top:22px;color:var(--muted);font-size:.8rem;text-align:center}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px}
  .card{display:block;border:1px solid rgba(201,162,39,.35);border-radius:14px;padding:12px;background:rgba(201,162,39,.05);color:inherit}
  .card b{display:block;color:var(--ink);line-height:1.3;margin:4px 0}
  .card small{color:var(--muted);font-family:system-ui,sans-serif;font-size:.74rem;letter-spacing:.04em}
  .card.observe{border-color:rgba(192,57,43,.6);background:rgba(192,57,43,.08)}
  .cells{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
  .cell{border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:8px 6px;font-size:.72rem;font-family:system-ui,sans-serif;min-height:54px;display:block;color:var(--muted)}
  .cell b{display:block;color:var(--ink);font-size:.78rem}
  .cell.open{border-color:rgba(201,162,39,.45);background:rgba(201,162,39,.08);color:var(--ink)}
  .cell.open.observe{border-color:rgba(192,57,43,.55);background:rgba(192,57,43,.08)}
  h2.house{font-size:1.1rem;margin:28px 0 10px;color:var(--gold);font-weight:500}
  p.lead{color:var(--muted);font-size:1.1rem;line-height:1.6}
  @media(max-width:560px){.cells{grid-template-columns:repeat(2,1fr)}}
`;

function shell(title, body, extraHead = "", tail = "") {
  return "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\" />\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n<title>" + esc(title) + "</title>\n" + extraHead + "<style>\n" + CSS + "</style>\n</head>\n<body>\n<div class=\"wrap\">\n" + body + "\n</div>\n" + tail + "</body>\n</html>\n";
}
function header(small) {
  return "<header><div class=\"brand\">School of 112 Doorways<small>" + esc(small) + "</small></div><nav><a href=\"index.html\">Gate</a><a href=\"112.html\">City of 112</a></nav></header>";
}
function para(text, cls) {
  if (text == null || text === "") return "";
  return "<p" + (cls ? " class=\"" + cls + "\"" : "") + ">" + esc(text) + "</p>";
}
function list(items) {
  return "<ul>" + items.map((x) => "<li>" + esc(x) + "</li>").join("") + "</ul>";
}
function categoryText(door) {
  return [door.category, ...door.category_secondary].join(" · ");
}
function verseRef(door) {
  return "Vijñāna Bhairava Tantra · dhāraṇā " + door.dharana.number + " · verse " + door.dharana.verses.join(", ") + " (Jaideva Singh numbering)";
}
const LAW = "<section class=\"law\">Pain is information, never a badge. Never force the breath. " + NOT_MEDICINE + " The door-to-dhāraṇā index is a School of 112 Doorways teaching device (school_device), not an ancient one-to-one canon.</section>";
const FOOTER = "<footer>School of 112 Doorways · living memory of the 112 dhāraṇās of the Vijñāna Bhairava Tantra</footer>";

function plate(door) {
  return {
    number: door.number,
    sealed: false,
    title: door.title,
    verse: door.dharana.verse,
    dharana: door.dharana.number,
    house: door.house,
    house_name: door.house_name,
    instruction: door.instruction,
    practice_mode: door.practice_mode,
    observe_only: door.observe_only,
    safety: door.safety.notes[0],
    observe_note: door.safety.observe_only_note,
    practise_instead: door.method.practise_instead,
    exit: UNIVERSAL,
  };
}

function doorPage(door) {
  const n = door.number;
  const observe = door.observe_only;
  let b = header("Door " + pad(n));
  b += "<div class=\"eyebrow\">Door " + pad(n) + " · House " + door.house + " · " + esc(door.house_name) + "</div>";
  b += "<h1 data-meru=\"door\" role=\"button\" tabindex=\"0\" aria-label=\"Ask Guru Meru about this door\">" + esc(door.title) + "</h1>";
  b += "<p class=\"verse-ref\" id=\"verse-ref\">" + esc(verseRef(door)) + "</p>";
  b += "<div class=\"badges\"><span class=\"badge\">Door " + n + "</span><span class=\"badge\">Verse " + door.dharana.verse + "</span><span class=\"badge\">" + esc(categoryText(door)) + "</span><span class=\"badge " + (observe ? "observe" : "practice") + "\" id=\"practice-mode\">" + esc(door.practice_mode_label) + "</span></div>";
  if (observe) {
    b += "<div class=\"observe-banner\" role=\"note\"><b>Historical / observe only</b>This dhāraṇā is kept as a classical description to read and understand. It is not practised here, and no practice cues are given. " + esc(door.safety.observe_only_note || "") + "</div>";
  }
  b += "<p class=\"one-line\" id=\"one-line\">" + esc(door.instruction) + "</p>";
  b += "\n<!-- GUIDANCE SLOT: mount the spoken guidance player and the visual for this door here (later workstream). Keep the id and data attributes stable. Hidden while empty. Observe-only doors: verse reading only, no practice cues. -->\n";
  b += "<section class=\"guidance-slot\" id=\"guidance-slot\" data-door=\"" + pad(n) + "\" data-dharana=\"" + door.dharana.number + "\" data-verse=\"" + door.dharana.verse + "\" data-practice-mode=\"" + esc(door.practice_mode) + "\" data-guidance-audio=\"\" data-guidance-visual=\"\" aria-label=\"Guidance for door " + pad(n) + "\"></section>\n";
  b += "<section class=\"field\"><h2>The verse</h2>" + para(door.dharana.sanskrit_iast, "iast") + para(door.dharana.rendering) + para(door.dharana.rendering_attribution, "muted") + "</section>";
  if (door.dharana.commentary_note) b += "<section class=\"field\"><h2>Commentary</h2>" + para(door.dharana.commentary_note) + "</section>";
  if (observe) {
    b += "<section class=\"field\" id=\"method\"><h2>Classical description</h2>" + para(door.method.text) + para(door.method.note, "muted") + "</section>";
    if (door.method.practise_instead.length) {
      b += "<section class=\"field\" id=\"practise-instead\"><h2>A door to practise instead</h2><p>" + door.method.practise_instead.map((k) => "<a href=\"door-" + pad(k) + ".html\">Door " + pad(k) + " · " + esc(doors[k - 1].title) + "</a>").join("<br>") + "</p></section>";
    }
  } else {
    b += "<section class=\"field\" id=\"method\"><h2>How to sit with it</h2>" + para(door.method.text) + "</section>";
    b += "<section class=\"field\"><h2>Where attention rests</h2>" + para(door.attention.primary) + para(door.attention.secondary, "muted") + para(door.attention_map.summary, "muted") + "</section>";
    b += "<section class=\"field\"><h2>Breath</h2>" + para(door.breath.cue) + para(door.breath.honesty, "muted") + "</section>";
    b += "<section class=\"field\"><h2>" + esc(door.seat.label || "Position (school addition)") + "</h2>" + para(door.seat.summary) + para(door.seat.honesty, "muted") + "</section>";
  }
  b += "<section class=\"field\" id=\"safety\"><h2>Safety</h2><div class=\"safety\">" + list(door.safety.notes) + "</div></section>";
  b += "<section class=\"field\" id=\"honesty\"><h2>Honesty</h2>" + para(door.honesty.disclosure) + list(door.honesty.flags) + para("Verse verification: " + door.dharana.verification + ". Sanskrit: " + door.dharana.sanskrit_status + ". English: school " + door.dharana.rendering_kind + ". Review: " + (door.honesty.review || "n/a").replace(/_/g, " ") + ".", "muted") + "</section>";
  if (door.beats) {
    b += "<details><summary>The eight beats (spoken script)</summary><ol>" + door.beats.map((x) => "<li><b>" + esc(x.title) + ".</b> " + esc(x.script) + "</li>").join("") + "</ol></details>";
  }
  b += "<details><summary>Sources</summary><ul>" + door.sources.map((s) => "<li>" + (s.url ? "<a href=\"" + esc(s.url) + "\" rel=\"noopener\">" + esc(s.label) + "</a>" : esc(s.label)) + (s.ref ? " <span class=\"muted\">" + esc(s.ref) + "</span>" : "") + "</li>").join("") + "</ul></details>";
  b += LAW;
  const prev = n > 1 ? "<a href=\"door-" + pad(n - 1) + ".html\">← " + pad(n - 1) + "</a>" : "<span></span>";
  const next = n < 16 ? "<a href=\"door-" + pad(n + 1) + ".html\">" + pad(n + 1) + " →</a>" : "<a href=\"door-sealed.html?n=17\">017 →</a>";
  b += "<nav class=\"doors\">" + prev + "<a href=\"index.html\">House 1</a>" + next + "</nav>";
  b += FOOTER;
  const json = JSON.stringify(plate(door)).replace(/</g, "\\u003c");
  const desc = "<meta name=\"description\" content=\"" + esc("Door " + pad(n) + ": " + door.title + ". Vijñāna Bhairava Tantra dhāraṇā " + door.dharana.number + ", verse " + door.dharana.verse + ". " + door.practice_mode_label + ".") + "\" />\n";
  return shell("Door " + pad(n) + " · " + door.title + " · School of 112 Doorways", b, desc, "<script type=\"application/json\" id=\"meru-plate\">" + json + "</script>\n<script src=\"meru.js\"></script>\n");
}

function card(door) {
  return "<a class=\"card" + (door.observe_only ? " observe" : "") + "\" href=\"" + door.page + "\"><small>Door " + pad(door.number) + " · verse " + door.dharana.verse + " · " + esc(door.category) + "</small><b>" + esc(door.title) + "</b><small>" + esc(door.practice_mode_label) + "</small></a>";
}

function indexPage(list1) {
  let b = header("Living memory");
  b += "<div class=\"eyebrow\">Vijñāna Bhairava Tantra · 112 dhāraṇās</div>";
  b += "<h1>The School of 112 Doorways</h1>";
  b += "<p class=\"lead\">The School is living memory. Each door is one dhāraṇā of the Vijñāna Bhairava Tantra, a way of resting attention that Bhairava describes to the Goddess. Door N is dhāraṇā N in Jaideva Singh's numbering, so Door 001 is verse 24.</p>";
  b += "<p class=\"lead\">House 1 is open: doors 001 to 016. Four of them (004, 008, 013, 014) are historical and observe only. They are kept as classical descriptions to read, not practised.</p>";
  b += "<h2 class=\"house\">House 1 · " + esc(HOUSES[0].house_name) + " · doors 001–016</h2>";
  b += "<div class=\"grid\" id=\"house-1\">" + list1.map(card).join("") + "</div>";
  b += "<h2 class=\"house\">Houses 2–7 · doors 017–112</h2>";
  b += "<p class=\"muted\">Being remembered. Their dhāraṇās will appear here when the research is ready. Null is not a secret name.</p>";
  b += "<p><a href=\"112.html\">See the city of 112 →</a></p>";
  b += LAW + FOOTER;
  const desc = "<meta name=\"description\" content=\"The School of 112 Doorways: living memory of the 112 dhāraṇās of the Vijñāna Bhairava Tantra. House 1, doors 1 to 16, is open.\" />\n";
  return shell("School of 112 Doorways · living memory of the Vijñāna Bhairava Tantra", b, desc);
}

function cityPage(all) {
  let b = header("City of 112");
  b += "<div class=\"eyebrow\">7 houses × 16 doors</div>";
  b += "<h1>The city of 112 doorways</h1>";
  b += "<p class=\"lead\">One door for each dhāraṇā of the Vijñāna Bhairava Tantra. House 1 is open. The other houses are being remembered.</p>";
  for (const h of HOUSES) {
    const open = h.house === 1;
    b += "<h2 class=\"house\">House " + h.house + " · " + esc(h.house_name) + " · " + esc(h.element) + " · " + pad(h.from) + "–" + pad(h.to) + (open ? " · open" : " · being remembered") + "</h2><div class=\"cells\">";
    for (let n = h.from; n <= h.to; n++) {
      const d = all[n - 1];
      if (d.status === "remembered") {
        b += "<a class=\"cell open" + (d.observe_only ? " observe" : "") + "\" href=\"" + d.page + "\"><b>" + pad(n) + " · v." + d.dharana.verse + "</b>" + esc(d.title) + (d.observe_only ? " · observe only" : "") + "</a>";
      } else {
        b += "<a class=\"cell\" href=\"" + d.page + "\"><b>" + pad(n) + "</b>being remembered</a>";
      }
    }
    b += "</div>";
  }
  b += LAW + FOOTER;
  return shell("The city of 112 doorways · School of 112 Doorways", b);
}

function redirectPage(n) {
  const target = "door-sealed.html?n=" + n;
  return "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\" />\n<meta name=\"robots\" content=\"noindex\" />\n<meta http-equiv=\"refresh\" content=\"0;url=" + target + "\" />\n<title>Door " + pad(n) + " · being remembered</title>\n</head>\n<body>\n<p>Door " + pad(n) + " is being remembered. <a href=\"" + target + "\">Continue</a>.</p>\n<script>location.replace(\"" + target + "\");</script>\n</body>\n</html>\n";
}

// ---------- write ----------

const outputs = {};
outputs["public/doors.json"] = JSON.stringify(doors, null, 2) + "\n";
for (let i = 0; i < 4; i++) outputs["public/doors-part" + (i + 1) + ".json"] = JSON.stringify(doors.slice(i * 28, (i + 1) * 28), null, 2) + "\n";
for (const n of HOUSE1) outputs["public/door-" + pad(n) + ".html"] = doorPage(doors[n - 1]);
outputs["public/index.html"] = indexPage(doors.slice(0, 16));
outputs["public/112.html"] = cityPage(doors);
outputs["public/door-049.html"] = redirectPage(49);
outputs["public/door-112.html"] = redirectPage(112);

// Guards: framing words, retired posture names, medical claims, observe-only gate.
const problems = [];
for (const [file, text] of Object.entries(outputs)) {
  const visible = file.endsWith(".html") ? text.replace(/<style>[\s\S]*?<\/style>/g, "") : text;
  for (const re of FORBIDDEN) {
    const m = visible.match(re);
    if (m) problems.push(file + ": forbidden word '" + m[0] + "'");
  }
  const med = medicalHit(visible);
  if (med) problems.push(file + ": medical word '" + med + "'");
}
for (const d of doors.slice(0, 16)) {
  const html = outputs["public/door-" + pad(d.number) + ".html"];
  if (!html.includes("id=\"guidance-slot\"")) problems.push(d.page + ": guidance slot missing");
  if (d.observe_only) {
    if (!html.includes("Historical / observe only")) problems.push(d.page + ": observe-only label missing");
    if (html.includes("The eight beats") || html.includes("How to sit with it") || html.includes("<h2>Breath</h2>")) problems.push(d.page + ": observe-only page carries practice cues");
    if (d.beats || d.breath || d.seat) problems.push(d.page + ": observe-only JSON carries practice cues");
  }
}
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
for (const [file, text] of Object.entries(outputs)) writeFileSync(path.join(ROOT, file), text);

const opened = doors.filter((d) => d.status === "remembered");
console.log("doors", doors.length, "house1", opened.length, "being_remembered", doors.length - opened.length);
console.log("observe_only", opened.filter((d) => d.observe_only).map((d) => pad(d.number) + (d.method.practise_instead.length ? " (practise instead: " + d.method.practise_instead.map(pad).join(", ") + ")" : "")).join("; "));
