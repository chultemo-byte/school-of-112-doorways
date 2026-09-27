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

  var OPENING = "Start on the exhale. Soft knees.";
  var CLOSE = "If it hurts, stop. A chair still opens the door.";
  var OBSERVE = "Practice mode: observe_only.";
  var SEALED_SPEECH = [
    "This pot exists. The name waits. Null is not a secret name.",
    "sealed — a name will arrive honestly."
  ];
  var MUTE_KEY = "meru-muted";
  var revealTimer = 0;
  var lastFocus = null;
  var bound = false;

  function pad(n) {
    return String(n == null ? "" : n).padStart(3, "0");
  }
  function muted() {
    try { return localStorage.getItem(MUTE_KEY) === "1"; } catch (e) { return false; }
  }
  function setMuted(on) {
    try { localStorage.setItem(MUTE_KEY, on ? "1" : "0"); } catch (e) { /* ignore */ }
    var btn = document.getElementById("meru-mute");
    if (btn) {
      btn.textContent = on ? "Unmute" : "Mute";
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    }
    if (on) stopSpeech();
  }
  function canSpeak() {
    return typeof window.speechSynthesis !== "undefined" && typeof window.SpeechSynthesisUtterance === "function";
  }
  function stopSpeech() {
    if (window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
    }
  }
  function speakLine(text) {
    if (!text || muted() || !canSpeak()) return;
    try {
      var utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.92;
      window.speechSynthesis.speak(utter);
    } catch (e) { /* voice is optional */ }
  }
  function speakAll(lines) {
    stopSpeech();
    if (muted() || !canSpeak()) return;
    for (var i = 0; i < lines.length; i++) speakLine(lines[i]);
  }
  function linesFor(plate) {
    plate = plate || {};
    var lines = [];
    if (plate.sealed) {
      lines.push(SEALED_SPEECH[0]);
      lines.push(SEALED_SPEECH[1]);
      var where = "Door " + pad(plate.number);
      if (plate.house) where += ". House " + plate.house;
      if (plate.house_name) where += " " + plate.house_name;
      if (plate.bija) where += ". " + plate.bija;
      lines.push(where);
      lines.push(OPENING);
      if (plate.exit && plate.exit !== CLOSE) lines.push(plate.exit);
      lines.push(CLOSE);
      return lines;
    }
    var head = "Door " + pad(plate.number);
    if (plate.house) head += ". House " + plate.house;
    if (plate.house_name) head += " " + plate.house_name;
    lines.push(head);
    if (plate.sanskrit || plate.english) {
      lines.push([plate.sanskrit, plate.english].filter(Boolean).join(" / "));
    }
    lines.push(OPENING);
    if (plate.water) lines.push(plate.water);
    if (plate.look) lines.push(plate.look);
    if (plate.yes) lines.push(plate.yes);
    if (plate.no) lines.push(plate.no);
    if (plate.beat) lines.push(plate.beat);
    if (plate.practice_mode === "observe_only") lines.push(OBSERVE);
    if (plate.safety && /never force/i.test(plate.safety)) lines.push(plate.safety);
    lines.push(CLOSE);
    return lines;
  }
  function meruParam() {
    return /[?&]meru=1(?:&|$)/.test(location.search);
  }
  function showHear(lines, show) {
    var hear = document.getElementById("meru-hear");
    if (!hear) return;
    hear.hidden = !show;
    if (!show) return;
    if (!canSpeak()) {
      hear.disabled = true;
      hear.textContent = "Voice is not available in this browser.";
      return;
    }
    hear.disabled = false;
    hear.textContent = "tap to hear Meru";
    hear.onclick = function () { speakAll(lines); };
  }
  function stopReveal() {
    if (revealTimer) clearTimeout(revealTimer);
    revealTimer = 0;
    stopSpeech();
  }
  function paint(text) {
    var say = document.getElementById("meru-say");
    if (say) say.textContent = text;
  }
  function openPanel() {
    var panel = document.getElementById("meru-panel");
    if (!panel) return;
    lastFocus = document.activeElement;
    panel.hidden = false;
    panel.setAttribute("aria-hidden", "false");
    requestAnimationFrame(function () { panel.classList.add("meru-open"); });
    var close = document.getElementById("meru-close");
    if (close) close.focus();
  }
  function closePanel() {
    var panel = document.getElementById("meru-panel");
    if (!panel || panel.hidden) return;
    stopReveal();
    panel.classList.remove("meru-open");
    panel.setAttribute("aria-hidden", "true");
    setTimeout(function () { panel.hidden = true; }, 280);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function startGreeting(opts) {
    opts = opts || {};
    var lines = linesFor(window.MERU_PLATE || {});
    stopReveal();
    openPanel();
    showHear(lines, false);
    if (opts.immediate) {
      paint(lines.join("\n\n"));
      showHear(lines, true);
      return;
    }
    var i = 0;
    var c = 0;
    function step() {
      if (i >= lines.length) return;
      var line = lines[i];
      if (c === 0 && opts.speak) speakLine(line);
      c += 1;
      var shown = lines.slice(0, i).concat(line.slice(0, c));
      paint(shown.join("\n\n"));
      if (c >= line.length) {
        i += 1;
        c = 0;
        revealTimer = setTimeout(step, 320);
      } else {
        revealTimer = setTimeout(step, 16);
      }
    }
    step();
  }

  function ensureCss() {
    if (document.getElementById("meru-css")) return;
    var css = document.createElement("style");
    css.id = "meru-css";
    css.textContent = [
      "[data-meru='asana']{cursor:pointer}",
      "[data-meru='asana']:focus{outline:2px solid #c9a227;outline-offset:3px}",
      "#meru-btn{position:fixed;right:16px;bottom:16px;z-index:40;background:#c9a227;color:#0b0a12;border:none;border-radius:999px;padding:12px 16px;font-family:system-ui,sans-serif;font-weight:700;cursor:pointer;box-shadow:0 8px 28px rgba(0,0,0,.35)}",
      "#meru-panel{position:fixed;right:16px;bottom:68px;z-index:40;width:min(420px,calc(100vw - 32px));background:#14121c;color:#f4efe6;border:1px solid rgba(201,162,39,.45);border-radius:16px;padding:16px;font-family:Georgia,serif;box-shadow:0 18px 50px rgba(0,0,0,.45);transform:translateY(16px);opacity:0;transition:transform .35s ease,opacity .35s ease}",
      "#meru-panel.meru-open{transform:none;opacity:1}",
      "#meru-panel .bar{display:flex;align-items:center;gap:8px;margin:0 0 8px}",
      "#meru-panel h2{margin:0;font-weight:500;font-size:1.15rem;flex:1}",
      "#meru-panel p{margin:0 0 10px;line-height:1.45;color:#f4efe6}",
      "#meru-say{white-space:pre-wrap;max-height:38vh;overflow:auto}",
      "#meru-panel .foot{color:#9a8f7a;font-size:.78rem;margin:8px 0 0}",
      "#meru-panel form{display:flex;gap:8px}",
      "#meru-q{flex:1;background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.16);border-radius:10px;padding:10px;color:#f4efe6;font-family:Georgia,serif}",
      "#meru-panel button.send,#meru-hear,#meru-mute,#meru-close{background:#c9a227;color:#0b0a12;border:none;border-radius:10px;padding:8px 12px;font-weight:700;cursor:pointer;font-family:system-ui,sans-serif}",
      "#meru-hear{display:block;width:100%;margin:0 0 10px}",
      "#meru-hear[hidden]{display:none}"
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
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "false");
    panel.setAttribute("aria-labelledby", "meru-title");
    panel.setAttribute("aria-hidden", "true");
    panel.innerHTML = "<div class=\"bar\"><h2 id=\"meru-title\">Guru Meru</h2><button type=\"button\" id=\"meru-mute\">Mute</button><button type=\"button\" id=\"meru-close\">Close</button></div><p id=\"meru-say\" aria-live=\"polite\">Ask from this door. I answer from its plate.</p><button type=\"button\" id=\"meru-hear\" hidden>tap to hear Meru</button><form><input id=\"meru-q\" autocomplete=\"off\" aria-label=\"Question for Guru Meru\" /><button class=\"send\" type=\"submit\">Ask</button></form><p class=\"foot\">" + FOOT + "</p>";
    document.body.appendChild(panel);
    document.body.appendChild(btn);
    setMuted(muted());
    btn.addEventListener("click", function () {
      if (!panel.hidden && panel.classList.contains("meru-open")) closePanel();
      else startGreeting({ speak: true, immediate: false });
    });
    document.getElementById("meru-close").addEventListener("click", closePanel);
    document.getElementById("meru-mute").addEventListener("click", function () { setMuted(!muted()); });
    panel.querySelector("form").addEventListener("submit", function (e) {
      e.preventDefault();
      var input = document.getElementById("meru-q");
      var q = input.value.trim();
      if (!q) return;
      stopReveal();
      showHear([], false);
      document.getElementById("meru-say").textContent = answer(q, window.MERU_PLATE || {});
      input.value = "";
    });
  }

  function bindTaps() {
    if (bound) return;
    bound = true;
    document.addEventListener("click", function (e) {
      var t = e.target && e.target.closest ? e.target.closest("[data-meru='asana']") : null;
      if (!t) return;
      lastFocus = t;
      startGreeting({ speak: true, immediate: false });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closePanel();
        return;
      }
      var t = e.target && e.target.closest ? e.target.closest("[data-meru='asana']") : null;
      if (!t) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        lastFocus = t;
        startGreeting({ speak: true, immediate: false });
      }
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
    var beat = door.eight_beats && door.eight_beats[0] && door.eight_beats[0].script;
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
      beat: beat || door.beat || null,
      practice_mode: door.practice_mode || null,
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
        if (meruParam()) startGreeting({ speak: false, immediate: true });
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
    bindTaps();
    fillFromRegistry();
    if (meruParam() && window.MERU_PLATE) startGreeting({ speak: false, immediate: true });
    else applyAsk();
  }

  window.MERU = { answer: answer, boot: boot, FALLBACK: FALLBACK, linesFor: linesFor, startGreeting: startGreeting };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { boot(); });
  else boot();
})();
