/* Guru Meru guidance player for the door pages.
   Data-driven: the door number comes from #guidance-slot (data-door), the script and the visual come
   from guidance/house-N.json with N = ceil(door / 16). Any door 1 to 112 works with no code change.
   Scripts are read exactly as written in the JSON. "[pause Ns]" markers become quiet gaps.
   Voice: the browser speech engine, sentence by sentence. A recorded file (data-guidance-audio, or
   guidance.audio in the door registry) takes its place when present. Captions always show.
   Visual: shapes and light only (points, lines, rings, waves, bands, glows), timed by the door's
   visual.timeline. With prefers-reduced-motion nothing moves; elements only fade. */
(function () {
  "use strict";

  var OBSERVE_FALLBACK = [4, 8, 13, 14, 29, 30, 41, 44, 45, 46, 47, 54, 55, 70, 87, 89, 90];
  var RATE = 0.85;
  var DOORS_PER_HOUSE = 16;
  var DOORS_PER_PART = 28;
  var BREATH_CYCLE = 8; // seconds, an even four in and four out, used only to pace soft halos

  var slot = document.getElementById("guidance-slot");
  if (!slot || slot.getAttribute("data-guidance-mounted") === "1") return;
  slot.setAttribute("data-guidance-mounted", "1");

  var BASE = guidanceBase();
  var ROOT = BASE.replace(/guidance\/?$/, "");

  // ---------- small helpers ----------

  function guidanceBase() {
    var s = document.currentScript;
    if (!s || !s.src) {
      var list = document.querySelectorAll("script[src*='guidance/player.js']");
      s = list.length ? list[list.length - 1] : null;
    }
    var src = s && s.src ? s.src : "guidance/player.js";
    return src.replace(/player\.js(?:[?#].*)?$/, "");
  }
  function pad(n) { return String(n).padStart(3, "0"); }
  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    if (attrs) for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) node.setAttribute(k, attrs[k]);
    if (text != null) node.textContent = text;
    return node;
  }
  function fmt(sec) {
    sec = Math.max(0, Math.round(sec));
    return Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0");
  }
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function getJson(url) {
    return fetch(url, { credentials: "same-origin" }).then(function (r) {
      if (!r.ok) throw new Error(url + " " + r.status);
      return r.json();
    });
  }
  /** A verse is a number or an array of numbers. Returns e.g. "Verse 24" or "Verses 105–106". */
  function verseLabel(v) {
    var list = [];
    if (Array.isArray(v)) list = v;
    else if (typeof v === "number") list = [v];
    else if (typeof v === "string") list = v.split(/[^0-9]+/).filter(Boolean);
    list = list.map(Number).filter(function (x) { return isFinite(x) && x > 0; });
    if (!list.length) return "";
    if (list.length === 1) return "Verse " + list[0];
    var contiguous = list.every(function (x, i) { return i === 0 || x === list[i - 1] + 1; });
    return "Verses " + (contiguous ? list[0] + "–" + list[list.length - 1] : list.join(", "));
  }
  function isObserve(mode) { return /observe/i.test(String(mode || "")); }

  // ---------- door number, data sources ----------

  var doorNo = parseInt(slot.getAttribute("data-door") || "", 10);
  if (!(doorNo >= 1 && doorNo <= 112)) {
    var m = location.pathname.match(/door-(\d{1,3})\.html/) || location.search.match(/[?&]n=(\d{1,3})/);
    doorNo = m ? parseInt(m[1], 10) : NaN;
  }
  if (!(doorNo >= 1 && doorNo <= 112)) return;

  var house = Math.ceil(doorNo / DOORS_PER_HOUSE);
  var visualAttr = (slot.getAttribute("data-guidance-visual") || "").trim();
  var audioAttr = (slot.getAttribute("data-guidance-audio") || "").trim();
  var guidanceUrl = visualAttr && /\.json(?:[?#].*)?$/i.test(visualAttr) ? visualAttr : BASE + "house-" + house + ".json";

  function pickEntry(data) {
    if (Array.isArray(data)) {
      for (var i = 0; i < data.length; i++) if (data[i] && Number(data[i].door) === doorNo) return data[i];
      return null;
    }
    if (data && Number(data.door) === doorNo) return data;
    if (data && Array.isArray(data.doors)) return pickEntry(data.doors);
    return null;
  }
  function registryAudio() {
    if (audioAttr) return Promise.resolve(audioAttr);
    var part = Math.ceil(doorNo / DOORS_PER_PART);
    return getJson(ROOT + "doors-part" + part + ".json").then(function (list) {
      for (var i = 0; i < list.length; i++) {
        var d = list[i];
        if (d && d.number === doorNo) return d.guidance && typeof d.guidance.audio === "string" ? d.guidance.audio.trim() : "";
      }
      return "";
    }).catch(function () { return ""; });
  }

  Promise.all([getJson(guidanceUrl).then(pickEntry), registryAudio()]).then(function (res) {
    var entry = res[0];
    if (!entry || typeof entry.script !== "string") return; // nothing for this door yet: the slot stays empty and hidden
    var audio = res[1] || (typeof entry.audio === "string" ? entry.audio.trim() : "");
    mount(entry, audio);
  }).catch(function (e) {
    if (window.console) console.warn("guidance player:", e && e.message ? e.message : e);
  });

  // ---------- script parsing ----------

  /** Split the script into spoken sentences and quiet gaps, without changing any word. */
  function parseScript(script) {
    var items = [];
    var re = /\[pause\s+(\d+(?:\.\d+)?)\s*s\]/gi;
    var last = 0, m;
    while ((m = re.exec(script))) {
      pushSentences(script.slice(last, m.index), items);
      items.push({ kind: "quiet", secs: parseFloat(m[1]) });
      last = re.lastIndex;
    }
    pushSentences(script.slice(last), items);
    return items;
  }
  function pushSentences(text, items) {
    var re = /[^.!?]*?[.!?]+["'”’)]*(?=\s|$)|[^.!?]+$/g;
    var m;
    while ((m = re.exec(text))) {
      var s = m[0].trim();
      if (s) items.push({ kind: "say", text: s });
      if (re.lastIndex === m.index) re.lastIndex++;
    }
  }
  /** Quiet runs in the visual timeline: consecutive steps that are not "Voice speaks". */
  function quietRuns(timeline) {
    var runs = [], cur = null;
    (timeline || []).forEach(function (st) {
      var voiced = /^\s*voice speaks/i.test(String(st.action || ""));
      var a = Number(st.t_start), b = Number(st.t_end);
      if (voiced || !isFinite(a) || !isFinite(b)) { cur = null; return; }
      if (cur && Math.abs(cur[1] - a) < 0.01) cur[1] = b;
      else { cur = [a, b]; runs.push(cur); }
    });
    return runs;
  }
  /** Place every item on the visual timeline's clock. Each "[pause Ns]" is matched to the timeline's
      quiet run in the same order, and the sentences between are spread over the voiced stretch by length.
      If the two do not line up, fall back to spreading everything over est_seconds. */
  function plan(items, est, timeline) {
    var runs = quietRuns(timeline);
    var quietItems = items.filter(function (it) { return it.kind === "quiet"; });
    var end = timeline && timeline.length ? Number(timeline[timeline.length - 1].t_end) : 0;
    var fits = end > 0 && runs.length === quietItems.length && runs.every(function (r, i) { return Math.abs((r[1] - r[0]) - quietItems[i].secs) < 1; });
    if (fits) {
      var q = 0, from = 0, group = [];
      var place = function (until) {
        var chars = group.reduce(function (n, it) { return n + it.text.length; }, 0);
        var t = from, span = Math.max(0, until - from);
        group.forEach(function (it) { it.start = t; it.dur = chars ? span * it.text.length / chars : 0; t += it.dur; });
        group = [];
      };
      items.forEach(function (it) {
        if (it.kind === "say") { group.push(it); return; }
        var r = runs[q++];
        place(r[0]);
        it.start = r[0];
        it.dur = r[1] - r[0];
        from = r[1];
      });
      place(end);
      return end;
    }
    return planByLength(items, est);
  }
  function planByLength(items, est) {
    var quiet = 0, chars = 0;
    items.forEach(function (it) { if (it.kind === "quiet") quiet += it.secs; else chars += it.text.length; });
    var speak = Math.max(est - quiet, chars / 14);
    var t = 0;
    items.forEach(function (it) {
      it.dur = it.kind === "quiet" ? it.secs : Math.max(1.2, speak * it.text.length / Math.max(1, chars));
      it.start = t;
      t += it.dur;
    });
    return t;
  }

  // ---------- the player ----------

  function mount(entry, audioSrc) {
    var observe = isObserve(slot.getAttribute("data-practice-mode")) || isObserve(entry.practice_mode) || OBSERVE_FALLBACK.indexOf(doorNo) !== -1;
    var items = parseScript(entry.script);
    if (!items.length) return;
    var est = Number(entry.est_seconds) > 0 ? Number(entry.est_seconds) : 0;
    var visual = entry.visual || {};
    var total = plan(items, est || items.length * 5, visual.timeline);
    var reduced = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
    var verse = entry.verse != null ? entry.verse : slot.getAttribute("data-verse");

    if (!document.getElementById("guidance-player-css")) {
      var link = el("link", { rel: "stylesheet", href: BASE + "player.css", id: "guidance-player-css" });
      document.head.appendChild(link);
    }

    // DOM
    var root = el("div", { class: "gp" + (observe ? " gp-observe" : ""), "data-state": "idle" });
    var head = el("div", { class: "gp-head" });
    head.appendChild(el("p", { class: "gp-eyebrow" }, "Guru Meru · " + (observe ? "history narration" : "spoken guidance")));
    head.appendChild(el("p", { class: "gp-title" }, "Door " + pad(doorNo) + (verseLabel(verse) ? " · " + verseLabel(verse) : "") + (entry.title ? " · " + entry.title : "")));
    if (observe) head.appendChild(el("p", { class: "gp-note" }, "History narration only. This door is read and understood, not practised."));
    root.appendChild(head);

    var stage = el("div", { class: "gp-stage" });
    var canvas = el("canvas", { role: "img", "aria-label": "Visual: " + (visual.concept || "shapes and light") });
    stage.appendChild(canvas);
    root.appendChild(stage);

    var now = el("p", { class: "gp-now", "aria-live": "polite", "aria-atomic": "true" });
    root.appendChild(now);

    var controls = el("div", { class: "gp-controls", role: "group", "aria-label": "Guidance controls for door " + pad(doorNo) });
    function button(cls, label, text) {
      var b = el("button", { type: "button", class: "gp-btn " + cls, "aria-label": label }, text);
      controls.appendChild(b);
      return b;
    }
    var bPlay = button("gp-play", "Play guidance", "Play");
    var bStop = button("gp-stop", "Stop guidance", "Stop");
    var bBack = button("gp-back", "Previous sentence", "‹ Back");
    var bNext = button("gp-next", "Next sentence", "Next ›");
    var bVoice = button("gp-voice", "Voice", "Voice on");
    var time = el("span", { class: "gp-time", "aria-hidden": "true" }, "0:00 / " + fmt(total));
    controls.appendChild(time);
    root.appendChild(controls);

    var bar = el("div", { class: "gp-bar", role: "progressbar", "aria-label": "Guidance progress", "aria-valuemin": "0", "aria-valuemax": String(Math.round(total)), "aria-valuenow": "0" });
    var fill = el("div", { class: "gp-fill" });
    bar.appendChild(fill);
    root.appendChild(bar);

    var status = el("p", { class: "gp-status", role: "status" });
    root.appendChild(status);

    var details = el("details", { class: "gp-transcript", open: "" });
    details.appendChild(el("summary", null, "Full script"));
    var list = el("div", { class: "gp-lines" });
    var spans = items.map(function (it, i) {
      var sp = el("span", { class: it.kind === "quiet" ? "gp-s gp-quiet" : "gp-s", "data-i": String(i) }, it.kind === "quiet" ? "· · ·" : it.text);
      if (it.kind === "quiet") sp.setAttribute("aria-label", "Quiet, " + it.secs + " seconds");
      list.appendChild(sp);
      list.appendChild(document.createTextNode(" "));
      return sp;
    });
    details.appendChild(list);
    root.appendChild(details);

    if (audioSrc) {
      var audioEl = el("audio", { preload: "metadata", src: new URL(audioSrc, location.href).href });
      root.appendChild(audioEl);
    }
    slot.appendChild(root);

    // State
    var S = { state: "idle", idx: 0, clock: 0, mode: "captions", voiceOn: true, token: 0, spokeAt: 0, last: 0 };
    var synth = typeof window.speechSynthesis !== "undefined" && typeof window.SpeechSynthesisUtterance === "function" ? window.speechSynthesis : null;
    var voice = null;
    var scene = createScene(canvas, visual, total, reduced);

    try { S.voiceOn = localStorage.getItem("guidance-voice") !== "0"; } catch (e) { /* default on */ }
    function baseMode() {
      if (audioEl && !S.audioFailed) return "audio";
      if (synth && S.voiceOn && !S.voiceFailed) return "tts";
      return "captions";
    }
    function setStatus(msg) { status.textContent = msg || ""; }
    function syncButtons() {
      root.setAttribute("data-state", S.state);
      root.setAttribute("data-mode", S.mode);
      var playing = S.state === "playing";
      bPlay.textContent = playing ? "Pause" : S.state === "paused" ? "Resume" : "Play";
      bPlay.setAttribute("aria-label", playing ? "Pause guidance" : S.state === "paused" ? "Resume guidance" : "Play guidance");
      bStop.disabled = S.state === "idle";
      bBack.disabled = S.idx <= 0;
      bNext.disabled = S.idx >= items.length - 1;
      bVoice.hidden = !!audioEl && !S.audioFailed;
      bVoice.disabled = !synth;
      bVoice.textContent = synth && S.voiceOn && !S.voiceFailed ? "Voice on" : "Voice off";
      bVoice.setAttribute("aria-pressed", synth && S.voiceOn && !S.voiceFailed ? "true" : "false");
      bVoice.setAttribute("aria-label", synth ? "Spoken voice (captions always show)" : "Spoken voice is not available in this browser");
    }
    function showCaption(i) {
      spans.forEach(function (sp, k) {
        var on = k === i && S.state !== "idle";
        sp.classList.toggle("gp-current", on);
        if (on) sp.setAttribute("aria-current", "true"); else sp.removeAttribute("aria-current");
      });
      var it = items[i];
      now.textContent = S.state === "idle" ? "" : it.kind === "quiet" ? "· · ·" : it.text;
      now.classList.toggle("gp-now-quiet", S.state !== "idle" && it.kind === "quiet");
      var sp = spans[i];
      if (details.open && sp && S.state !== "idle") list.scrollTop = Math.max(0, sp.offsetTop - list.clientHeight / 3);
    }
    function updateTime() {
      time.textContent = fmt(S.clock) + " / " + fmt(total);
      fill.style.width = (100 * clamp(S.clock / total, 0, 1)).toFixed(2) + "%";
      bar.setAttribute("aria-valuenow", String(Math.round(S.clock)));
    }

    // Voice choice: a local English voice first, then any English voice, then the default.
    function chooseVoice() {
      if (!synth) return null;
      var voices = synth.getVoices() || [];
      var best = null, bestScore = -1;
      voices.forEach(function (v) {
        var score = 0;
        if (/^en/i.test(v.lang)) score += 4;
        if (/^en-(GB|IE|AU|IN|US)/i.test(v.lang)) score += 1;
        if (v.localService) score += 3;
        if (/natural|enhanced|premium|neural/i.test(v.name)) score += 1;
        if (/whisper|bad news|bells|boing|bubbles|cellos|jester|organ|superstar|trinoids|zarvox|albert|fred|junior|ralph|wobble|novelty/i.test(v.name)) score -= 10;
        if (score > bestScore) { best = v; bestScore = score; }
      });
      return best;
    }
    function voicesReady() {
      return new Promise(function (resolve) {
        if (!synth) return resolve(false);
        if ((synth.getVoices() || []).length) return resolve(true);
        var done = false;
        function finish() { if (!done) { done = true; resolve((synth.getVoices() || []).length > 0); } }
        try { synth.addEventListener("voiceschanged", finish, { once: true }); } catch (e) { /* older engines */ }
        setTimeout(finish, 1200);
      });
    }
    function voiceFailed(msg) {
      S.voiceFailed = true;
      if (synth) try { synth.cancel(); } catch (e) { /* ignore */ }
      S.mode = baseMode();
      setStatus(msg);
      syncButtons();
      if (S.state === "playing") enter(S.idx, S.clock);
    }

    function speak(i) {
      var it = items[i];
      var token = ++S.token;
      try { synth.cancel(); } catch (e) { /* ignore */ }
      var u = new SpeechSynthesisUtterance(it.text);
      u.rate = RATE;
      u.pitch = 1;
      if (voice) { u.voice = voice; u.lang = voice.lang; } else { u.lang = document.documentElement.lang || "en"; }
      u.onend = function () {
        if (token !== S.token || S.state !== "playing") return;
        if (performance.now() - S.spokeAt < 120 && it.text.length > 24) {
          voiceFailed("No voice could be heard on this device. Captions continue on their own.");
          return;
        }
        enter(i + 1);
      };
      u.onerror = function (e) {
        if (token !== S.token) return;
        if (e && (e.error === "interrupted" || e.error === "canceled")) return;
        voiceFailed("The voice stopped working here. Captions continue on their own.");
      };
      S.spokeAt = performance.now();
      synth.speak(u);
    }

    /** Go to item i. Optional clock lets a resume keep the visual where it was. */
    function enter(i, keepClock) {
      if (i >= items.length) { finish(); return; }
      S.idx = clamp(i, 0, items.length - 1);
      var it = items[S.idx];
      S.clock = keepClock != null && keepClock >= it.start && keepClock <= it.start + it.dur ? keepClock : it.start;
      S.itemStartedAt = performance.now();
      showCaption(S.idx);
      updateTime();
      syncButtons();
      if (S.state !== "playing") return;
      if (S.mode === "tts") {
        if (it.kind === "say") { S.clock = it.start; speak(S.idx); }
        else { S.token++; try { synth.cancel(); } catch (e) { /* ignore */ } }
      }
    }
    function finish() {
      S.token++;
      if (synth && S.mode === "tts") try { synth.cancel(); } catch (e) { /* ignore */ }
      S.state = "idle";
      S.idx = items.length - 1;
      S.clock = total;
      showCaption(S.idx);
      now.textContent = "";
      updateTime();
      syncButtons();
      setStatus("The guidance has finished.");
    }

    function play() {
      if (S.state === "playing") return;
      var resumeFrom = S.state === "paused" ? S.clock : null;
      if (S.state === "idle") { S.idx = 0; S.clock = 0; }
      S.mode = baseMode();
      setStatus("");
      if (S.mode === "audio") {
        S.state = "playing";
        syncButtons();
        var p = audioEl.play();
        if (p && p.catch) p.catch(function () {
          S.audioFailed = true;
          S.mode = baseMode();
          setStatus("The recording could not be played. Using the reader instead.");
          startReader(resumeFrom);
        });
        tickSoon();
        return;
      }
      startReader(resumeFrom);
    }
    function startReader(resumeFrom) {
      var go = function () {
        S.state = "playing";
        if (S.mode === "tts") voice = voice || chooseVoice();
        if (S.mode === "captions" && !synth) setStatus("This browser has no speech voice. Captions move on their own; use Back and Next to read at your own pace.");
        enter(S.idx, resumeFrom);
        tickSoon();
      };
      if (S.mode === "tts") {
        S.state = "playing";
        syncButtons();
        voicesReady().then(function (ok) {
          if (S.state !== "playing") return;
          if (!ok) {
            S.voiceFailed = true;
            S.mode = baseMode();
            setStatus("No speech voice was found on this device. Captions move on their own.");
          }
          go();
        });
      } else go();
    }
    function pause() {
      if (S.state !== "playing") return;
      S.state = "paused";
      S.token++;
      if (S.mode === "audio") audioEl.pause();
      else if (S.mode === "tts" && synth) try { synth.cancel(); } catch (e) { /* ignore */ }
      syncButtons();
      setStatus("Paused.");
    }
    function stop() {
      S.token++;
      if (S.mode === "audio" && audioEl) { audioEl.pause(); try { audioEl.currentTime = 0; } catch (e) { /* ignore */ } }
      if (synth) try { synth.cancel(); } catch (e) { /* ignore */ }
      S.state = "idle";
      S.idx = 0;
      S.clock = 0;
      showCaption(0);
      updateTime();
      syncButtons();
      setStatus("Stopped.");
    }
    function jump(delta) {
      var i = clamp(S.idx + delta, 0, items.length - 1);
      if (S.mode === "audio" && audioEl) {
        S.idx = i;
        seekAudio(items[i].start);
        showCaption(i);
        syncButtons();
        return;
      }
      if (S.state === "idle") { S.state = "paused"; setStatus("Paused. Press Resume to continue from here."); }
      enter(i);
    }

    // Recorded audio: the planned clock is stretched over the file's real length.
    function audioScale() { return audioEl && isFinite(audioEl.duration) && audioEl.duration > 0 ? total / audioEl.duration : 1; }
    function seekAudio(t) { try { audioEl.currentTime = t / audioScale(); } catch (e) { /* ignore */ } S.clock = t; updateTime(); }
    if (audioEl) {
      audioEl.addEventListener("ended", function () { if (S.mode === "audio") finish(); });
      audioEl.addEventListener("error", function () {
        S.audioFailed = true;
        var wasPlaying = S.state === "playing";
        S.mode = baseMode();
        syncButtons();
        setStatus("The recording could not be loaded. Using the reader instead.");
        if (wasPlaying) startReader(S.clock);
      });
    }
    function indexAt(t) {
      for (var i = items.length - 1; i >= 0; i--) if (t >= items[i].start) return i;
      return 0;
    }

    // Logic tick: moves the clock and the captions. Runs on a timer so it keeps going when the tab is hidden.
    var timer = null;
    function tickSoon() { if (!timer) timer = setInterval(tick, 200); S.last = performance.now(); }
    function tick() {
      var t = performance.now();
      var dt = (t - S.last) / 1000;
      S.last = t;
      if (S.state !== "playing") { if (S.state === "idle" && timer) { clearInterval(timer); timer = null; } return; }
      if (S.mode === "audio") {
        S.clock = audioEl.currentTime * audioScale();
        var i = indexAt(S.clock);
        if (i !== S.idx) { S.idx = i; showCaption(i); syncButtons(); }
        updateTime();
        return;
      }
      var it = items[S.idx];
      var end = it.start + it.dur;
      if (S.mode === "tts" && it.kind === "say") {
        S.clock = Math.max(it.start, Math.min(S.clock + dt, end - 0.05));
        // A voice that never reports the end of a sentence must not stall the reading.
        if ((t - S.itemStartedAt) / 1000 > it.dur * 2.5 + 8) enter(S.idx + 1);
      } else {
        S.clock += dt;
        if (S.clock >= end) enter(S.idx + 1);
      }
      updateTime();
    }

    bPlay.addEventListener("click", function () { if (S.state === "playing") pause(); else play(); });
    bStop.addEventListener("click", stop);
    bBack.addEventListener("click", function () { jump(-1); });
    bNext.addEventListener("click", function () { jump(1); });
    bVoice.addEventListener("click", function () {
      if (!synth) return;
      S.voiceOn = !(S.voiceOn && !S.voiceFailed);
      S.voiceFailed = false;
      try { localStorage.setItem("guidance-voice", S.voiceOn ? "1" : "0"); } catch (e) { /* ignore */ }
      var was = S.state;
      if (synth) try { synth.cancel(); } catch (e) { /* ignore */ }
      S.token++;
      S.mode = baseMode();
      syncButtons();
      setStatus(S.voiceOn ? "Voice on." : "Voice off. Captions move on their own.");
      if (was === "playing") {
        if (S.mode === "tts") { S.state = "paused"; startReader(S.clock); } else enter(S.idx, S.clock);
      }
    });
    window.addEventListener("pagehide", function () { if (synth) try { synth.cancel(); } catch (e) { /* ignore */ } });

    showCaption(0);
    syncButtons();
    updateTime();

    // Visual loop.
    // While playing every frame is drawn; at rest a slow redraw is enough.
    var lastDraw = 0;
    function frame(ts) {
      if (S.state === "playing" || ts - lastDraw > 400) {
        scene.draw(S.clock, S.state === "playing");
        lastDraw = ts;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    window.GURU_MERU_GUIDANCE = {
      door: doorNo, observe: observe, items: items, total: total,
      state: function () { return { state: S.state, mode: S.mode, idx: S.idx, clock: S.clock }; },
      play: play, pause: pause, stop: stop, next: function () { jump(1); }, back: function () { jump(-1); }
    };
  }

  // ---------- the visual: shapes and light, read from visual.elements and visual.timeline ----------

  var COLORS = { gold: "#F2D8A0", blue: "#A9C4E8", white: "#F4EFE6", bg: "#0A0F1E", vermilion: "#C0392B" };
  var NUMBERS = { two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, twelve: 12, many: 9, several: 6 };
  var STOP = { the: 1, and: 1, of: 1, a: 1, an: 1, breath: 1, soft: 1, small: 1, one: 1, two: 1, field: 0 };

  function rgba(hex, a) {
    var h = hex.replace("#", "");
    if (h.length === 3) h = h.split("").map(function (c) { return c + c; }).join("");
    var n = parseInt(h, 16);
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + clamp(a, 0, 1).toFixed(3) + ")";
  }
  function has(text, re) { return re.test(text); }

  function parseElement(e, index) {
    var d = String(e.description || "").toLowerCase();
    var shape = String(e.shape || "circle").toLowerCase();
    var id = String(e.id || "el" + index).toLowerCase();
    var hex = (String(e.description || "").match(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b/i) || [])[0];
    var color = hex || (has(d, /blue/) ? COLORS.blue : has(d, /white|pale|clear|silver/) ? COLORS.white : has(d, /red|vermilion/) ? COLORS.vermilion : COLORS.gold);
    var o = { id: id, shape: shape, d: d, color: color, index: index, x: null, y: null, alpha: 0, scale: 1 };
    var fullFrame = has(d, /full-frame|full frame|background|whole frame|nothing else lives/);
    if ((shape === "rect" || shape === "gradient") && fullFrame && index === 0) o.kind = "bg";
    else if (shape === "blank") o.kind = "blank";
    else if (/^(ring|rings|concentric_rings|arc|arcs|spiral)$/.test(shape)) o.kind = "ring";
    else if (/^(line|lines|dotted_line|arrow|arrows|path)$/.test(shape)) o.kind = "line";
    else if (shape === "points") o.kind = "points";
    else if (/^waves?$/.test(shape)) o.kind = "wave";
    else if (/^(band|rect|rects)$/.test(shape)) o.kind = "band";
    else o.kind = "glow"; // circle, circles, glow, sphere, star, gradient, ellipse, ellipses
    if (has(d, /\bleft\b/)) o.x = 0.25;
    else if (has(d, /\bright\b/) && !has(d, /right of/)) o.x = 0.75;
    else if (has(d, /forward|in front/)) o.x = 0.72;
    else if (has(d, /centre|center|middle/)) o.x = 0.5;
    if (has(d, /upper|\btop\b|above|\bhigh|crown|brow|nose|skull|head/)) o.y = 0.32;
    else if (has(d, /\blow\b|lower|bottom|below|\bbase\b|belly|heart|floor|ground/)) o.y = 0.7;
    else if (has(d, /centre|center|middle/)) o.y = 0.5;
    o.small = has(d, /small|point|dot|tiny|mark|seed|spark/);
    o.large = shape === "gradient" || (!o.small && has(d, /whole frame|across the frame|everywhere|spread|\bwide\b|\bfills?\b|entire|open field|surface|\bsky\b|space inside|whole space/));
    var num = d.match(/\b(two|three|four|five|six|seven|eight|nine|ten|twelve|many|several|\d+)\b/);
    o.count = num ? (NUMBERS[num[1]] || parseInt(num[1], 10) || 5) : (/s$/.test(shape) ? 3 : 1);
    o.vertical = has(d, /vertical|bottom to top|up the middle|upward|column|spine|rising line/);
    o.inCircle = has(d, /in a circle|around a|circle of|ring of/);
    o.around = has(d, /around|halo|surrounds|rim|edge of/);
    o.pace = has(d, /in-breath|out-breath|paces|swells/);
    o.dotted = shape === "dotted_line" || has(d, /dotted|dashed/);
    o.curve = has(d, /\barc\b|curve|curved|bow/);
    o.bars = o.kind === "line" && /s$/.test(shape) && has(d, /short|\bbars?\b|each point/);
    o.pair = o.kind === "ring" && /^(rings|circles)$/.test(shape) && !has(d, /concentric|nested|inside one another/);
    o.words = id.split(/[_\-\s]+/).filter(function (w) { return w.length > 2 && !STOP[w]; });
    if (id.indexOf("_") !== -1) o.words.unshift(id.replace(/_/g, " "));
    o.shapeWord = shape.replace(/_/g, " ").replace(/s$/, "");
    return o;
  }

  function layout(els) {
    var glows = els.filter(function (o) { return o.kind === "glow"; });
    var free = glows.filter(function (o) { return o.x == null && o.y == null && !o.large; });
    var spots = free.length === 1 ? [[0.5, 0.5]] : [[0.36, 0.5], [0.64, 0.5], [0.5, 0.5], [0.5, 0.3], [0.5, 0.72]];
    free.forEach(function (o, k) { o.x = spots[k % spots.length][0]; o.y = spots[k % spots.length][1]; });
    var bands = els.filter(function (o) { return o.kind === "band"; });
    bands.forEach(function (o, k) {
      if (o.y == null) o.y = bands.length > 1 ? 0.74 - k * (0.4 / Math.max(1, bands.length - 1)) : 0.72;
      o.w = o.large || has(o.d, /across/) ? 1 : has(o.d, /narrow(?!er)/) ? 0.32 : has(o.d, /narrower/) ? 0.52 : has(o.d, /wide/) ? 0.78 : 0.6;
    });
    var anchors = glows.filter(function (o) { return !o.large; });
    els.forEach(function (o) {
      if (o.x == null) o.x = 0.5;
      if (o.y == null) o.y = 0.5;
      if (o.kind === "ring" && o.around && anchors.length) {
        // A halo or rim sits around the first point-like element (or the field for a rim).
        var a = has(o.d, /rim|edge of the field/) ? (glows.filter(function (g) { return g.large; })[0] || anchors[0]) : anchors[0];
        o.x = a.x; o.y = a.y; o.anchor = a;
      }
      if (o.kind === "line") {
        if (has(o.d, /between/) && anchors.length >= 2) { o.x1 = anchors[0].x; o.y1 = anchors[0].y; o.x2 = anchors[1].x; o.y2 = anchors[1].y; o.ends = [anchors[0], anchors[1]]; }
        else if (o.vertical) { o.x1 = o.x; o.x2 = o.x; o.y1 = 0.86; o.y2 = 0.14; }
        else { o.x1 = 0.1; o.x2 = 0.9; o.y1 = o.y; o.y2 = o.y; }
      }
    });
    var vline = els.filter(function (o) { return o.kind === "line" && o.vertical; })[0];
    var firstLine = els.filter(function (o) { return o.kind === "line" && !o.bars; })[0];
    els.forEach(function (o) { if (o.bars && firstLine) o.barsOn = firstLine; });
    els.forEach(function (o) { if (o.kind === "points" && vline && has(o.d, /on the line|marks|stations|bottom to top/)) o.along = vline; });
  }

  /** Read each timeline step into per-element effects. Matching is by the element's id words or shape. */
  function hitsWords(o, c) {
    for (var i = 0; i < o.words.length; i++) if (c.indexOf(o.words[i]) !== -1) return true;
    return c.indexOf(o.shapeWord) !== -1 || (o.kind === "glow" && /\b(points?|dots?|light)\b/.test(c) && o.small) || (o.kind === "line" && /\bline\b/.test(c));
  }
  function readTimeline(els, timeline) {
    var ALL = /\b(shapes|everything|all|whole image|the image|image)\b/;
    var PARTS = ["bead", "crest", "flash"];
    var lastTargets = [];
    var steps = (timeline || []).map(function (s) {
      var action = String(s.action || "").toLowerCase();
      var clauses = action.split(/[.;]+/).map(function (c) { return c.trim(); }).filter(Boolean);
      var fx = {};
      clauses.forEach(function (c) {
        if (/^voice speaks$|^pause \d/.test(c)) return;
        if (/^no\b|\bnot yet\b|\byet$|\b(?:not|no)\b[^,]*\bshown\b/.test(c)) return; // "No line yet", "not shown" name nothing
        var partHit = PARTS.filter(function (w) { return c.indexOf(w) !== -1; });
        var targets = els.filter(function (o) {
          if (o.kind === "bg") return false;
          return ALL.test(c) || hitsWords(o, c);
        });
        // "It drifts", "They draw toward each other": the pronoun means the last things named.
        if (!targets.length && /^(it|its|they|their|both|each)\b/.test(c)) targets = lastTargets.slice();
        if (targets.length) lastTargets = targets;
        var e = {
          appear: /fade in|fades in|appear|draws? itself|begins|forms|gathers|come[s]? in|light up|\blit\b/.test(c),
          out: /fade out|fades out|fades? to|fades? away|have faded|vanish|dissolv|slow fade|fade continues|disappear|goes out|tapers/.test(c),
          glow: /glow|bright|\blit\b|flare|crest|flash|shine|warm/.test(c),
          dim: /\bdim/.test(c),
          faint: /faint|very soft|barely/.test(c),
          still: /nothing moves|still|stillness|rest/.test(c),
          draw: /draws? itself|draws in|draw in/.test(c),
          travel: /travel|climb|steps? up|moves? along|flows?|runs? along|bead/.test(c),
          spread: /spread|\bfill|widen|expand|\bgrow|wells? up|welling|overflow|swell|\bopens\b/.test(c),
          gather: /toward each other|draw toward|merge|together|gather|converge|meet/.test(c),
          drift: /drift|wander|float/.test(c),
          rise: /\brise|rising|lift|upward/.test(c),
          oneByOne: /one by one|one at a time|in turn|station by station/.test(c)
        };
        var all = ALL.test(c);
        targets.forEach(function (o) {
          var f = fx[o.id] || (fx[o.id] = {});
          for (var k in e) if (e[k]) f[k] = true;
          f.named = true;
          if (!all || hitsWords(o, c)) f.explicit = true; // only an explicit mention brings an element in
        });
        // A part of an element (the bead on a line, a crest on a wave) moves without changing the element.
        els.forEach(function (o) {
          if (targets.indexOf(o) !== -1 || !partHit.some(function (w) { return o.d.indexOf(w) !== -1; })) return;
          var f = fx[o.id] || (fx[o.id] = {});
          if (e.travel) f.travel = true;
          if (e.out) f.partOut = true;
        });
        // Direction of travel along a line between two named points: from the one named first.
        els.forEach(function (o) {
          if (!o.ends || !e.travel) return;
          var a = c.indexOf(o.ends[0].words[0] || "\u0000"), b = c.indexOf(o.ends[1].words[0] || "\u0000");
          var f = fx[o.id] || (fx[o.id] = {});
          if (a !== -1 && b !== -1) f.from = a < b ? 0 : 1;
        });
        if (!targets.length && ALL.test(c) === false && /dark field/.test(c) && /fades? to|everything/.test(c)) els.forEach(function (o) { (fx[o.id] = fx[o.id] || {}).out = true; });
      });
      return { t0: Number(s.t_start) || 0, t1: Number(s.t_end) || 0, fx: fx, faint: /faint/.test(action), dim: /\bdim/.test(action) };
    });
    els.forEach(function (o) {
      o.appearStep = 0;
      for (var i = 0; i < steps.length; i++) if (steps[i].fx[o.id] && steps[i].fx[o.id].explicit) { o.appearStep = i; break; }
    });
    return steps;
  }

  function createScene(canvas, visual, total, reducedQuery) {
    var ctx = canvas.getContext && canvas.getContext("2d");
    var els = (visual.elements || []).map(parseElement);
    layout(els);
    var steps = readTimeline(els, visual.timeline);
    var span = steps.length ? Math.max(steps[steps.length - 1].t1, 1) : total;
    var bg = els.filter(function (o) { return o.kind === "bg"; })[0];
    var bgColor = bg ? bg.color : COLORS.bg;
    var W = 0, H = 0, lastT = performance.now();

    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = canvas.clientWidth || 640, h = canvas.clientHeight || 360;
      if (Math.round(w * dpr) !== canvas.width || Math.round(h * dpr) !== canvas.height) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      W = canvas.width; H = canvas.height;
    }
    function stepAt(t) {
      for (var i = 0; i < steps.length; i++) if (t < steps[i].t1) return i;
      return steps.length - 1;
    }
    function glow(x, y, r, color, a) {
      if (a <= 0.003 || r <= 0) return;
      var g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, rgba(color, a));
      g.addColorStop(0.18, rgba(color, a * 0.75));
      g.addColorStop(0.5, rgba(color, a * 0.22));
      g.addColorStop(1, rgba(color, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    function draw(clock, playing) {
      if (!ctx) return;
      size();
      var reduced = !!reducedQuery.matches;
      var nowT = performance.now();
      var dt = Math.min(0.25, (nowT - lastT) / 1000);
      lastT = nowT;
      var t = clock * (span / Math.max(total, 1));
      var si = steps.length ? stepAt(t) : 0;
      var st = steps[si] || { t0: 0, t1: span, fx: {} };
      var p = clamp((t - st.t0) / Math.max(0.001, st.t1 - st.t0), 0, 1);
      var ease = 0.5 - 0.5 * Math.cos(Math.PI * p);
      var breath = reduced || !playing ? 0 : Math.sin((nowT / 1000) * (2 * Math.PI / BREATH_CYCLE));
      var M = Math.min(W, H);

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, W, H);
      var vg = ctx.createRadialGradient(W / 2, H * 0.45, 0, W / 2, H * 0.45, Math.max(W, H) * 0.7);
      vg.addColorStop(0, "rgba(40,48,80,0.35)");
      vg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);

      els.forEach(function (o) {
        if (o.kind === "bg" || o.kind === "blank") return;
        // Target brightness from the timeline.
        var target = 0;
        var f = st.fx[o.id] || {};
        if (si >= o.appearStep) {
          target = 0.5;
          if (st.faint) target = 0.38;
          if (st.dim) target = 0.3;
          if (f.faint) target = 0.36;
          if (f.dim) target = 0.28;
          if (f.glow) target = 0.78;
          if (f.named && !f.dim && !f.faint && !f.out && !f.glow) target = Math.max(target, 0.6);
          if (f.out) target = 0.02;
          // An element that faded in an earlier step stays faded unless named again.
          for (var k = o.appearStep; k < si; k++) if (steps[k].fx[o.id] && steps[k].fx[o.id].out && !f.named) target = 0.02;
        }
        if (o.pace) target *= 0.55;
        var tau = target < o.alpha ? (reduced ? 4 : 3) : (reduced ? 3 : 1.6);
        o.alpha += (target - o.alpha) * (1 - Math.exp(-dt / tau));
        if (!playing && clock === 0) o.alpha = si >= o.appearStep ? target : 0; // idle preview, settled
        var a = o.alpha;
        if (a < 0.004) return;
        var move = playing && !reduced && !f.still;
        var x = o.x * W, y = o.y * H;

        if (o.kind === "glow") {
          var r = (o.large ? 0.42 : o.small ? 0.09 : 0.15) * M;
          if (move && f.spread) r *= 1 + 1.4 * ease;
          if (move && f.gather) { x += (W / 2 - x) * 0.85 * ease; y += (H / 2 - y) * 0.85 * ease; }
          if (move && f.drift) { x += Math.sin(nowT / 5200 + o.index) * 0.08 * W; y += Math.cos(nowT / 6100 + o.index) * 0.05 * H; }
          if (move && f.rise) y -= 0.12 * H * ease;
          o.cx = x; o.cy = y;
          if (o.large) { glow(x, y, r * 1.6, o.color, a * 0.5); return; }
          glow(x, y, r, o.color, a);
          glow(x, y, r * 0.22, COLORS.white, a * 0.55);
        } else if (o.kind === "ring") {
          var anchor = o.anchor;
          if (anchor && anchor.cx != null) { x = anchor.cx; y = anchor.cy; }
          var rr = (o.anchor && o.anchor.large ? 0.3 : 0.11) * M;
          if (o.pace) rr *= 1 + 0.07 * breath;
          if (move && f.spread) rr *= 1 + 0.6 * ease;
          var n = o.shape === "concentric_rings" || o.shape === "rings" ? Math.max(2, Math.min(o.count, 5)) : 1;
          ctx.lineWidth = Math.max(1, M * 0.004);
          if (o.pair) {
            // Separate small circles side by side (for example, two open circles where two points were).
            var pr = 0.07 * M * (o.pace ? 1 + 0.07 * breath : 1);
            for (var pj = 0; pj < n; pj++) {
              var pxr = (n === 1 ? 0.5 : 0.3 + 0.4 * pj / (n - 1)) * W;
              ctx.strokeStyle = rgba(o.color, a);
              ctx.beginPath();
              ctx.arc(pxr, y, pr, 0, Math.PI * 2);
              ctx.stroke();
              glow(pxr, y, pr * 1.8, o.color, a * 0.25);
            }
            return;
          }
          for (var j = 0; j < n; j++) {
            ctx.strokeStyle = rgba(o.color, a * (1 - j * 0.15));
            ctx.beginPath();
            if (o.shape === "arc" || o.shape === "arcs") ctx.arc(x, y, rr * (1 + j * 0.45), Math.PI * 1.1, Math.PI * 1.9);
            else if (o.shape === "spiral") {
              for (var s = 0; s <= 120; s++) {
                var ang = s / 120 * Math.PI * 5 + (move ? nowT / 9000 : 0), rad = rr * 1.4 * s / 120;
                if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x + Math.cos(ang) * rad, y + Math.sin(ang) * rad);
              }
            } else ctx.arc(x, y, rr * (1 + j * 0.45), 0, Math.PI * 2);
            ctx.stroke();
          }
          glow(x, y, rr * 1.3, o.color, a * 0.12);
        } else if (o.kind === "line") {
          var x1 = o.x1 * W, y1 = o.y1 * H, x2 = o.x2 * W, y2 = o.y2 * H;
          if (o.ends && o.ends[0].cx != null) { x1 = o.ends[0].cx; y1 = o.ends[0].cy; x2 = o.ends[1].cx; y2 = o.ends[1].cy; }
          var drawn = f.draw && !reduced ? ease : 1;
          if (o.bars) {
            // Short bars, one at each end of the first line (or spread across the middle).
            var host = o.barsOn, cntb = Math.max(2, Math.min(o.count, 6));
            ctx.save();
            ctx.lineCap = "round";
            ctx.lineWidth = Math.max(2, M * 0.008);
            ctx.strokeStyle = rgba(o.color, a);
            for (var bi = 0; bi < cntb; bi++) {
              var u = cntb === 1 ? 0.5 : bi / (cntb - 1);
              var bx = host ? (host.x1 + (host.x2 - host.x1) * u) * W : (0.3 + 0.4 * u) * W;
              var byy = host ? (host.y1 + (host.y2 - host.y1) * u) * H : 0.5 * H;
              ctx.beginPath();
              ctx.moveTo(bx, byy - 0.05 * M);
              ctx.lineTo(bx, byy + 0.05 * M);
              ctx.stroke();
            }
            ctx.restore();
            return;
          }
          var cxq = (x1 + x2) / 2, cyq = Math.min(y1, y2) - 0.28 * H;
          ctx.save();
          ctx.lineCap = "round";
          ctx.lineWidth = Math.max(1, M * 0.005);
          if (o.dotted) ctx.setLineDash([M * 0.01, M * 0.018]);
          ctx.shadowColor = rgba(o.color, a);
          ctx.shadowBlur = M * 0.03;
          ctx.strokeStyle = rgba(o.color, a * 0.85);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          if (o.curve) {
            for (var ci = 1; ci <= 40; ci++) {
              var cu = ci / 40 * drawn;
              ctx.lineTo((1 - cu) * (1 - cu) * x1 + 2 * (1 - cu) * cu * cxq + cu * cu * x2, (1 - cu) * (1 - cu) * y1 + 2 * (1 - cu) * cu * cyq + cu * cu * y2);
            }
          } else ctx.lineTo(x1 + (x2 - x1) * drawn, y1 + (y2 - y1) * drawn);
          ctx.stroke();
          ctx.restore();
          if (f.travel && playing && !f.partOut) {
            // The bead: a small light travelling along the line, paced by the timeline step.
            var ph = f.from === 1 ? 1 - ease : f.from === 0 ? ease : 0.5 - 0.5 * Math.cos((nowT / 1000) * (2 * Math.PI / BREATH_CYCLE));
            var beadA = Math.max(a, 0.5);
            if (reduced) {
              // No movement: the far end brightens gently instead.
              var tx = ph > 0.5 ? x2 : x1, ty = ph > 0.5 ? y2 : y1;
              glow(tx, ty, M * 0.06, COLORS.white, beadA * Math.abs(ph - 0.5) * 2 * 0.8);
            } else {
              glow(x1 + (x2 - x1) * ph, y1 + (y2 - y1) * ph, M * 0.045, COLORS.white, beadA);
            }
          }
        } else if (o.kind === "points") {
          var cnt = Math.max(2, Math.min(o.count, 16));
          var lit = f.oneByOne && !reduced ? Math.ceil(ease * cnt) : cnt;
          var step = move && f.travel ? Math.floor(((nowT / 1000) / BREATH_CYCLE) % cnt) : -1;
          for (var q = 0; q < cnt; q++) {
            var px, py;
            if (o.along) { px = o.along.x1 * W; py = (o.along.y1 + (o.along.y2 - o.along.y1) * (0.08 + 0.84 * q / (cnt - 1))) * H; }
            else if (o.inCircle || has(o.d, /circle/)) { var an = -Math.PI / 2 + q * 2 * Math.PI / cnt; px = W / 2 + Math.cos(an) * 0.26 * M; py = H / 2 + Math.sin(an) * 0.26 * M; }
            else if (o.vertical) { px = o.x * W; py = (0.82 - 0.64 * q / (cnt - 1)) * H; }
            else { px = (0.18 + 0.64 * q / (cnt - 1)) * W; py = o.y * H; }
            if (move && f.gather) { px += (W / 2 - px) * 0.85 * ease; py += (H / 2 - py) * 0.85 * ease; }
            var qa = q < lit ? a : a * 0.08;
            glow(px, py, M * 0.05, o.color, qa * (q === step ? 1.4 : 1));
          }
        } else if (o.kind === "wave") {
          var waves = o.shape === "waves" ? 3 : 1;
          var amp = (has(o.d, /taper/) ? 0.08 : 0.06) * H;
          var flow = move && (f.travel || f.rise || f.named) ? nowT / 2600 : 0;
          ctx.save();
          ctx.lineWidth = Math.max(1, M * 0.005);
          ctx.shadowColor = rgba(o.color, a);
          ctx.shadowBlur = M * 0.03;
          for (var wv = 0; wv < waves; wv++) {
            ctx.strokeStyle = rgba(o.color, a * (1 - wv * 0.25));
            ctx.beginPath();
            for (var sx = 0; sx <= 80; sx++) {
              var u = sx / 80;
              var taper = has(o.d, /taper/) ? 1 - u : 1;
              var wy = (o.y + wv * 0.06) * H + Math.sin(u * Math.PI * 3 - flow + wv) * amp * taper;
              if (sx === 0) ctx.moveTo(0.08 * W + u * 0.84 * W, wy); else ctx.lineTo(0.08 * W + u * 0.84 * W, wy);
            }
            ctx.stroke();
          }
          ctx.restore();
        } else if (o.kind === "band") {
          var bw = (o.w || 0.6) * W, bh = (o.large ? 0.16 : 0.09) * H;
          var by = o.y * H;
          if (move && f.rise) by -= 0.06 * H * ease;
          // A soft band: an elliptical glow stretched sideways, with no hard edges.
          ctx.save();
          ctx.translate(W / 2, by);
          ctx.scale(bw / 2 / bh, 1);
          var lg = ctx.createRadialGradient(0, 0, 0, 0, 0, bh);
          lg.addColorStop(0, rgba(o.color, a * 0.5));
          lg.addColorStop(0.55, rgba(o.color, a * 0.3));
          lg.addColorStop(1, rgba(o.color, 0));
          ctx.fillStyle = lg;
          ctx.beginPath();
          ctx.arc(0, 0, bh, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });
    }
    return { draw: draw };
  }
})();
