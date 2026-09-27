/* Door-aware Guru Meru. Keyword matching only. No network call for an answer. */
(function () {
  var FALLBACK = "I hear you. Press the three points, breathe, and stop if it hurts.";
  var FOOT = "Guru Meru answers from the accepted plate. He does not invent. He does not rush.";
  var DOOR1_FALLBACK = "I hear you. Press the three points. Breathe four and four. Stop if it hurts. Ask me the feet, the water, or the exit.";
  var DOOR1 = [
    { k: ["look", "quiet", "point", "foot"], t: "Look here: heel, big-toe pad, little-toe pad. The quiet point is the door. Press it again, gently." },
    { k: ["water", "breath", "flower", "bubble", "inhale", "exhale"], t: "The water: start on the exhale. Mist at the feet. In four, out four. Six loops. No hold." },
    { k: ["exit", "hurt", "pain", "stop", "sit"], t: "If it hurts, sit. A chair is still the mountain. That is the whole rule." },
    { k: ["start", "begin", "how"], t: "Stand. Soft knees. Find three points. Start on the exhale. Watch the mist climb and fall." },
    { k: ["geometry", "line", "column"], t: "One vertical column. Soles through pelvis to crown. Zero-degree tilt. Arms rest." },
    { k: ["knee", "locked", "soft"], t: "Soft knees. A locked knee is a held breath in the leg. Let it bend a hair." },
    { k: ["heel"], t: "The heel is root. If it is loud and the toes are silent, your weight slid back." },
    { k: ["big"], t: "The big-toe pad is the forward root. If it is quiet, you are tipping back." },
    { k: ["little"], t: "The little-toe pad is the side root. If it is quiet, you are collapsing inward." },
    { k: ["meru", "fidget"], t: "I do not fidget. You do not have to either." }
  ];

  function has(q, words) {
    for (var i = 0; i < words.length; i++) {
      if (q.indexOf(words[i]) !== -1) return true;
    }
    return false;
  }

  function answer(q, plate) {
    q = (q || "").toLowerCase();
    plate = plate || {};
    if (plate.sealed) {
      if (has(q, ["hurt", "pain", "stop", "red"])) return "If it hurts, stop. A chair still opens the door.";
      if (has(q, ["breath", "breathe", "water", "inhale", "exhale"])) return "Start on the exhale.";
      if (has(q, ["look", "gaze", "where", "eye"])) return "Look here.";
      if (has(q, ["exit", "leave", "done", "finish"])) return "Exit if it hurts.";
      if (has(q, ["chair", "sit"])) return "A chair still opens the door.";
      if (has(q, ["knee"])) return "Soft knees.";
      if (has(q, ["how", "what", "teach", "job", "do"])) return "Look here. Breathe. Exit if it hurts.";
      return FALLBACK;
    }
    if (plate.number === 1) {
      for (var d = 0; d < DOOR1.length; d++) {
        if (has(q, DOOR1[d].k)) return DOOR1[d].t;
      }
      return DOOR1_FALLBACK;
    }
    if (has(q, ["hurt", "pain", "stop", "red"])) {
      return plate.safety || "If it hurts, stop. A chair still opens the door.";
    }
    if (has(q, ["breath", "breathe", "water", "inhale", "exhale", "flower", "bubble"])) {
      return plate.water || "Start on the exhale.";
    }
    if (has(q, ["look", "gaze", "where", "eye", "focus"])) {
      return plate.look ? "Look here: " + plate.look : "Look here.";
    }
    if (has(q, ["exit", "leave", "done", "finish"])) {
      return plate.exit || "If it hurts, stop. A chair still opens the door.";
    }
    if (has(q, ["chair", "sit"])) {
      return plate.open_seat || "A chair still opens the door.";
    }
    if (has(q, ["knee", "knees", "soft"])) return "Soft knees.";
    if (has(q, ["guardian", "who"])) {
      return plate.guardian ? "Guardian: " + plate.guardian : "The guardian is unnamed — waiting.";
    }
    return FALLBACK;
  }

  function ensureCss() {
    if (document.getElementById("meru-css")) return;
    var css = document.createElement("style");
    css.id = "meru-css";
    css.textContent = [
      "#meru-btn{position:fixed;right:16px;bottom:16px;z-index:40;background:#c9a227;color:#0b0a12;border:none;border-radius:999px;padding:12px 16px;font-family:system-ui,sans-serif;font-weight:700;cursor:pointer;box-shadow:0 8px 28px rgba(0,0,0,.35)}",
      "#meru-panel{position:fixed;right:16px;bottom:68px;z-index:40;width:min(380px,calc(100vw - 32px));background:#14121c;color:#f4efe6;border:1px solid rgba(201,162,39,.45);border-radius:16px;padding:16px;font-family:Georgia,serif;box-shadow:0 18px 50px rgba(0,0,0,.45)}",
      "#meru-panel h2{margin:0 0 8px;font-weight:500;font-size:1.15rem}",
      "#meru-panel p{margin:0 0 10px;line-height:1.45;color:#f4efe6}",
      "#meru-panel .foot{color:#9a8f7a;font-size:.78rem;margin:8px 0 0}",
      "#meru-panel form{display:flex;gap:8px}",
      "#meru-q{flex:1;background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.16);border-radius:10px;padding:10px;color:#f4efe6;font-family:Georgia,serif}",
      "#meru-panel button.send{background:#c9a227;color:#0b0a12;border:none;border-radius:10px;padding:0 12px;font-weight:700;cursor:pointer}"
    ].join("");
    document.head.appendChild(css);
  }

  function ensureButton() {
    ensureCss();
    if (document.getElementById("meru-btn")) return;
    var btn = document.createElement("button");
    btn.id = "meru-btn";
    btn.type = "button";
    btn.textContent = "Ask Guru Meru";
    var panel = document.createElement("div");
    panel.id = "meru-panel";
    panel.hidden = true;
    panel.innerHTML = "<h2>Guru Meru</h2><p id=\"meru-say\">Ask from this door. I answer from its plate.</p><form><input id=\"meru-q\" autocomplete=\"off\" aria-label=\"Question for Guru Meru\" /><button class=\"send\" type=\"submit\">Ask</button></form><p class=\"foot\">" + FOOT + "</p>";
    document.body.appendChild(panel);
    document.body.appendChild(btn);
    btn.addEventListener("click", function () {
      panel.hidden = !panel.hidden;
      if (!panel.hidden) document.getElementById("meru-q").focus();
    });
    panel.querySelector("form").addEventListener("submit", function (e) {
      e.preventDefault();
      var input = document.getElementById("meru-q");
      var q = input.value.trim();
      if (!q) return;
      document.getElementById("meru-say").textContent = answer(q, window.MERU_PLATE || {});
      input.value = "";
    });
  }

  function plateFromDom() {
    var el = document.getElementById("meru-plate");
    if (!el) return null;
    try { return JSON.parse(el.textContent); } catch (e) { return null; }
  }

  function plateFromDoor(door) {
    if (!door || door.status === "sealed_unnamed") {
      return { number: door ? door.number : null, sealed: true };
    }
    return {
      number: door.number,
      sealed: false,
      english: door.english,
      sanskrit: door.sanskrit,
      guardian: door.guardian,
      look: door.look,
      water: door.water,
      exit: door.exit,
      safety: (door.safety_notes && door.safety_notes[0]) || "If it hurts, stop. A chair still opens the door.",
      open_seat: door.open_seat || null
    };
  }

  function fillFromRegistry() {
    if (window.MERU_PLATE && (window.MERU_PLATE.look || window.MERU_PLATE.sealed)) return;
    var match = location.pathname.match(/door-0*(\d+)\.html$/i);
    if (!match) return;
    var n = parseInt(match[1], 10);
    var urls = ["doors.json", "public/doors.json", "../public/doors.json"];
    function next(i) {
      if (i >= urls.length) return;
      fetch(urls[i]).then(function (r) {
        if (!r.ok) throw new Error("missing");
        return r.json();
      }).then(function (doors) {
        if (window.MERU_PLATE && (window.MERU_PLATE.look || window.MERU_PLATE.sealed)) return;
        var door = null;
        for (var k = 0; k < doors.length; k++) if (doors[k].number === n) door = doors[k];
        window.MERU_PLATE = plateFromDoor(door || { number: n, status: "sealed_unnamed" });
      }).catch(function () { next(i + 1); });
    }
    next(0);
  }

  function applyAsk() {
    var ask = location.search.match(/[?&]ask=([^&]+)/);
    if (!ask || !window.MERU_PLATE) return;
    var panel = document.getElementById("meru-panel");
    if (!panel) return;
    panel.hidden = false;
    var q = decodeURIComponent(ask[1].replace(/\+/g, " "));
    document.getElementById("meru-say").textContent = answer(q, window.MERU_PLATE);
    var input = document.getElementById("meru-q");
    if (input) input.value = q;
  }

  function boot(plate) {
    if (plate) window.MERU_PLATE = plate;
    else if (!window.MERU_PLATE) window.MERU_PLATE = plateFromDom();
    ensureButton();
    fillFromRegistry();
    applyAsk();
  }

  window.MERU = { answer: answer, boot: boot, FALLBACK: FALLBACK };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { boot(); });
  else boot();
})();
