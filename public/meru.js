/* Guru Meru on the door pages (doors 001-112). Keyword matching only, from the door's own plate.
   No network call for an answer. Observe-only doors never get practice cues. */
(function () {
  var FOOT = "Guru Meru answers only from this door's page. He does not invent. He does not rush.";
  var CLOSE = "If anything hurts or feels distressing, stop, open the eyes and rest attention on the feet and the floor.";
  var OBSERVE = "This door is historical, observe only. It is read and understood, not practised.";
  var REMEMBERED = "This door's page did not load its plate. Find the door in the City of 112.";
  var MUTE_KEY = "meru-muted";
  var bound = false;
  var lastFocus = null;

  function pad(n) { return String(n == null ? "" : n).padStart(3, "0"); }
  function has(q, words) {
    for (var i = 0; i < words.length; i++) if (q.indexOf(words[i]) !== -1) return true;
    return false;
  }
  function verseLine(p) {
    var many = p.verses && p.verses.length > 1;
    return "Door " + pad(p.number) + " is dhāraṇā " + p.dharana + " of the Vijñāna Bhairava Tantra, " + (many ? "verses " : "verse ") + p.verse + " in Jaideva Singh's numbering.";
  }
  function insteadLine(p) {
    var k = p.practise_instead || [];
    if (!k.length) return "";
    return " To practise, open " + k.map(function (x) { return "Door " + pad(x); }).join(" or ") + ".";
  }

  function answer(q, plate) {
    q = (q || "").toLowerCase();
    var p = plate || {};
    if (p.sealed || !p.title) return REMEMBERED;
    if (has(q, ["hurt", "pain", "stop", "dizzy", "distress", "safe"])) return p.safety + " " + CLOSE;
    if (has(q, ["verse", "dharana", "dhāraṇā", "number", "singh", "which"])) return verseLine(p);
    if (p.observe_only) {
      if (has(q, ["how", "do", "practi", "try", "breath", "breathe", "start", "begin", "teach"])) {
        return OBSERVE + (p.observe_note ? " " + p.observe_note : "") + insteadLine(p);
      }
      return OBSERVE + " " + verseLine(p);
    }
    if (has(q, ["how", "do", "practi", "start", "begin", "what", "teach", "breath", "breathe"])) return p.instruction;
    if (has(q, ["exit", "leave", "done", "finish", "end"])) return "Take one free breath without watching it, open the eyes, and move on when ready.";
    if (has(q, ["guardian", "who", "meru"])) return "I am Guru Meru. I keep the door and answer from its page.";
    return p.instruction + " " + CLOSE;
  }

  function linesFor(plate) {
    var p = plate || {};
    if (p.sealed || !p.title) return [REMEMBERED];
    var lines = ["Door " + pad(p.number) + ". House " + p.house + " " + (p.house_name || "") + ".", p.title + ".", verseLine(p)];
    if (p.observe_only) lines.push(OBSERVE + insteadLine(p));
    else lines.push(p.instruction);
    lines.push(CLOSE);
    return lines;
  }

  function muted() { try { return localStorage.getItem(MUTE_KEY) === "1"; } catch (e) { return false; } }
  function canSpeak() { return typeof window.speechSynthesis !== "undefined" && typeof window.SpeechSynthesisUtterance === "function"; }
  function stopSpeech() { if (window.speechSynthesis) { try { window.speechSynthesis.cancel(); } catch (e) { /* ignore */ } } }
  function speakAll(lines) {
    stopSpeech();
    if (muted() || !canSpeak()) return;
    for (var i = 0; i < lines.length; i++) {
      try { var u = new SpeechSynthesisUtterance(lines[i]); u.rate = 0.92; window.speechSynthesis.speak(u); } catch (e) { /* voice is optional */ }
    }
  }
  function setMuted(on) {
    try { localStorage.setItem(MUTE_KEY, on ? "1" : "0"); } catch (e) { /* ignore */ }
    var btn = document.getElementById("meru-mute");
    if (btn) { btn.textContent = on ? "Unmute" : "Mute"; btn.setAttribute("aria-pressed", on ? "true" : "false"); }
    if (on) stopSpeech();
  }

  function ensureUi() {
    if (document.getElementById("meru-btn")) return;
    var css = document.createElement("style");
    css.id = "meru-css";
    css.textContent = [
      "[data-meru='door']{cursor:pointer}",
      "[data-meru='door']:focus{outline:2px solid #c9a227;outline-offset:3px}",
      "#meru-btn{position:fixed;right:16px;bottom:16px;z-index:40;background:#c9a227;color:#0b0a12;border:none;border-radius:999px;padding:12px 16px;font-family:system-ui,sans-serif;font-weight:700;cursor:pointer;box-shadow:0 8px 28px rgba(0,0,0,.35)}",
      "#meru-panel{position:fixed;right:16px;bottom:68px;z-index:40;width:min(420px,calc(100vw - 32px));background:#14121c;color:#f4efe6;border:1px solid rgba(201,162,39,.45);border-radius:16px;padding:16px;font-family:Georgia,serif;box-shadow:0 18px 50px rgba(0,0,0,.45)}",
      "#meru-panel .bar{display:flex;align-items:center;gap:8px;margin:0 0 8px}",
      "#meru-panel h2{margin:0;font-weight:500;font-size:1.15rem;flex:1}",
      "#meru-say{white-space:pre-wrap;max-height:38vh;overflow:auto;line-height:1.45;margin:0 0 10px}",
      "#meru-panel .foot{color:#9a8f7a;font-size:.78rem;margin:8px 0 0}",
      "#meru-panel form{display:flex;gap:8px}",
      "#meru-q{flex:1;background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.16);border-radius:10px;padding:10px;color:#f4efe6;font-family:Georgia,serif}",
      "#meru-panel button{background:#c9a227;color:#0b0a12;border:none;border-radius:10px;padding:8px 12px;font-weight:700;cursor:pointer;font-family:system-ui,sans-serif}"
    ].join("");
    document.head.appendChild(css);
    var panel = document.createElement("div");
    panel.id = "meru-panel";
    panel.hidden = true;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-labelledby", "meru-title");
    panel.innerHTML = "<div class=\"bar\"><h2 id=\"meru-title\">Guru Meru</h2><button type=\"button\" id=\"meru-hear\">Hear</button><button type=\"button\" id=\"meru-mute\">Mute</button><button type=\"button\" id=\"meru-close\">Close</button></div><p id=\"meru-say\" aria-live=\"polite\"></p><form><input id=\"meru-q\" autocomplete=\"off\" aria-label=\"Question for Guru Meru\" placeholder=\"Ask about the verse, the practice, or safety\" /><button type=\"submit\">Ask</button></form><p class=\"foot\">" + FOOT + "</p>";
    var btn = document.createElement("button");
    btn.id = "meru-btn";
    btn.type = "button";
    btn.textContent = "Ask Guru Meru";
    document.body.appendChild(panel);
    document.body.appendChild(btn);
    setMuted(muted());
    btn.addEventListener("click", function () { if (panel.hidden) open(); else close(); });
    document.getElementById("meru-close").addEventListener("click", close);
    document.getElementById("meru-mute").addEventListener("click", function () { setMuted(!muted()); });
    document.getElementById("meru-hear").addEventListener("click", function () { speakAll(linesFor(window.MERU_PLATE)); });
    if (!canSpeak()) document.getElementById("meru-hear").hidden = true;
    panel.querySelector("form").addEventListener("submit", function (e) {
      e.preventDefault();
      var input = document.getElementById("meru-q");
      var q = input.value.trim();
      if (!q) return;
      stopSpeech();
      document.getElementById("meru-say").textContent = answer(q, window.MERU_PLATE);
      input.value = "";
    });
  }
  function open() {
    var panel = document.getElementById("meru-panel");
    if (!panel) return;
    lastFocus = document.activeElement;
    document.getElementById("meru-say").textContent = linesFor(window.MERU_PLATE).join("\n\n");
    panel.hidden = false;
    document.getElementById("meru-close").focus();
  }
  function close() {
    var panel = document.getElementById("meru-panel");
    if (!panel || panel.hidden) return;
    stopSpeech();
    panel.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function bindTaps() {
    if (bound) return;
    bound = true;
    document.addEventListener("click", function (e) {
      var t = e.target && e.target.closest ? e.target.closest("[data-meru='door']") : null;
      if (t) open();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { close(); return; }
      var t = e.target && e.target.closest ? e.target.closest("[data-meru='door']") : null;
      if (t && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); open(); }
    });
  }
  function plateFromDom() {
    var el = document.getElementById("meru-plate");
    if (!el) return null;
    try { return JSON.parse(el.textContent); } catch (e) { return null; }
  }
  function boot(plate) {
    window.MERU_PLATE = plate || window.MERU_PLATE || plateFromDom() || { sealed: true };
    ensureUi();
    bindTaps();
    if (/[?&]meru=1(?:&|$)/.test(location.search)) open();
  }

  window.MERU = { answer: answer, boot: boot, linesFor: linesFor };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { boot(); });
  else boot();
})();
