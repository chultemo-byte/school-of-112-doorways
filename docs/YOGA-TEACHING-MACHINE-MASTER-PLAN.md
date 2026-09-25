# School of 112 Doorways — Yoga Teaching Machine
## Master Plan (Engineer Blueprint)

**Status:** Draft v1 — combine-all plan  
**Owner:** Chief of Staff (coordination) → Engineer (build)  
**Date:** 2026-09-25  
**Scope:** One teaching instrument that braids six layers per door across all 112 doors.

---

## 1. VISION

The Yoga Teaching Machine is not an app, feed, or pose library. It is a living instrument that teaches **112 doors as dimensions of practice**, not as shapes to copy. For every door it holds six braided instruments at once: a geometry (polygon / skeletal map), a chemical reaction (named phase change in the body-field), a breath signature, an orientation adjustment (how the body meets gravity and space), an attention lock (where awareness is held — including chakra foci when that door uses one), and an Adiyogi / Vijnana Bhairava Tantra (VBT) research method tied to that door’s verse or research lane. The machine sequences doors by house and by student readiness, shows each door as an 8-beat temple-mural tutorial, and refuses force: pain is information; lotus and other extremes are never coerced. Serial pairing of asana ↔ VBT method is an explicit **school device**, not a claim of ancient one-to-one canon.

---

## 2. THE STACK PER DOOR

Every door record (`D-001` … `D-112`) must contain these six fields. Empty fields block “live” status.

| # | Instrument | Field ID | What it stores | Engineer constraint |
|---|------------|----------|----------------|---------------------|
| 1 | Geometry | `geometry` | Named polygon / line set + joint map for that door | SVG or JSON skeleton; one primary polygon |
| 2 | Chemical reaction | `reaction` | Named phase change (e.g. solid→fluid attention, heat rise, cool settle) | Enum + short prose; no medical claims |
| 3 | Breath signature | `breath` | Pattern: pace, ratio, where breath lands | Machine-readable: `{inhale, hold, exhale, cycles}` + cue text |
| 4 | Orientation adjustment | `orientation` | Gravity / axis / facing tweak vs a neutral stand | Degrees or named cue (e.g. “crown over heels”, “gaze soft front”) |
| 5 | Attention lock | `attention` | Focal point; may name a chakra when the door uses one | Single primary lock; optional secondary |
| 6 | Adiyogi method | `adiyogi` | VBT verse ref + research method summary from bot R-nnn | Cite verse id; flag `historical_extreme: true` when non-practice |

**Interlock rule:** Teaching output for a door always emits all six in one 8-beat script. No door ships with only asana geometry.

### Exemplar — Door 001 (Tadasana / Mountain)

| Instrument | Content (concrete draft) |
|------------|--------------------------|
| Geometry | Vertical line + base triangle (two feet → pelvic floor). Polygon: upright column. |
| Reaction | “Settle” — scattered charge → grounded stillness (name only; not a lab claim). |
| Breath | Natural lengthen: inhale 4 / exhale 4; 6 cycles. Breath lands in lower belly then ribs. |
| Orientation | Crown over heels; weight even on triple foot points; gaze soft horizontal. |
| Attention | Lock at soles + crown axis (mula–sahasrara line as school attention map, not medical). |
| Adiyogi | Pair with opening / still-point VBT lane assigned to D-001 by research bot R-001; verse text in knowledge graph only. |

### Exemplar — Door 049 (Bhujangasana / Cobra)

| Instrument | Content (concrete draft) |
|------------|--------------------------|
| Geometry | Arc from pubis through thoracic; arms as props. Polygon: low crescent. |
| Reaction | “Heat lift” — cool belly → warm open front body (metaphorical phase label). |
| Breath | Inhale to rise, brief hold at top, exhale to soften chest; no forced max height. |
| Orientation | Pubis and tops of feet stay heavy; elbows soft; gaze forward-up only if neck free. |
| Attention | Lock at sternum / anahata band; secondary: length of back body. |
| Adiyogi | R-049 supplies VBT method for heart-space / rising awareness; if verse is extreme, `practice_mode: observe_only`. |

### Exemplar — Door 112 (Padmasana / Lotus)

| Instrument | Content (concrete draft) |
|------------|--------------------------|
| Geometry | Closed seat polygon; knees as hinges — **never force**. Alternate geometry: sukhasana / siddhasana for most bodies. |
| Reaction | “Seal” — outer motion → inner closed circuit (school label). |
| Breath | Slow equal breath; longer exhale if agitation. |
| Orientation | Both sit bones; spine tall; if knees complain → exit to open seat immediately. |
| Attention | Lock at brow or heart per student’s lane; default brow for D-112 school map. |
| Adiyogi | Culminating VBT method from R-112; lotus as **optional seat**, not proof of mastery. Safety layer overrides geometry. |

---

## 3. ARCHITECTURE

Five layers. Build bottom-up; do not skip safety.

### (a) 112-door knowledge graph

- **Nodes:** `Door`, `House`, `Geometry`, `Reaction`, `Breath`, `Orientation`, `Attention`, `VBTVerse`, `ResearchNote`, `TutorialBeat`.
- **Edges:** `Door -[:IN_HOUSE]-> House`, `Door -[:HAS]->` each of the six instruments, `Door -[:PAIRED_WITH]-> VBTVerse` (school pairing, tagged `pairing_type: school_device`), `Door -[:TAUGHT_BY]-> TutorialBeat` (exactly 8 beats).
- **Store (Phase 1–2):** JSON/YAML files under `doors/D-XXX/door.json` + optional graph export later.
- **Required schema keys:** `id`, `name`, `house`, `status` (`stub`|`researched`|`live`), six instruments, `safety`, `beats[8]`.

### (b) 112 research bots (R-001 … R-112)

- One bot (or one bot-run) per door. Output = fill the six instruments + sources + honesty flags.
- Feed **guardians** (review roles): accuracy, safety, non-canon pairing disclosure, language tone.
- Pipeline: `R-nnn draft → guardian check → merge to door.json → status=researched`.
- Bots never invent medical outcomes; extreme VBT methods marked historical.

### (c) Teaching engine

- Inputs: student profile (readiness, contraindications, language), current house path, completed doors.
- Logic: sequence by house order unless readiness gate fails; then offer regression door or prep door.
- Readiness gates (minimal v1): pain flag, lotus/knee gate, breath capacity, attention stability score (self-report).
- Output: next door id + 8-beat script + “do not force” overlays.

### (d) Safety layer (hard rules)

1. Pain = information → pause, regress, or exit; never “push through.”  
2. Never force lotus (or any closed hip/knee bind). Offer open-seat twin.  
3. Extreme VBT methods = historical / contemplative text, not class drills.  
4. Practice ≠ medical treatment; no diagnose/cure language in UI.  
5. No doorway is owned — lineage credited; school pairing labeled as school device.

### (e) Presentation layer

- Format: **cartoon temple-mural tutorials**, **8 beats per door**.
- Beat map (fixed): (1) name the door, (2) geometry, (3) orientation, (4) breath, (5) attention, (6) reaction cue, (7) Adiyogi thread (safe form), (8) exit / integrate.
- Assets: mural frames + short captions; Mongolian + English strings from day one of Phase 5 (structure strings with `i18n` keys from Phase 2).

```
[Student] → [Teaching Engine] → [Door Graph]
                 ↓                    ↑
           [Safety Layer] ←—— [Guardians]
                 ↓
        [8-beat Mural UI]
                 ↑
        [R-001..R-112 research]
```

---

## 4. PHASES

| Phase | Name | Outcome | Exit criteria |
|-------|------|---------|---------------|
| **0** | Volume 0 + charter | Book + school charter exist | **Done** (per current brief) |
| **1** | Light all 112 research bots | Every `doors/D-XXX/door.json` has six instruments + sources + flags | 112 × `status=researched`; guardian sign-off checklist complete |
| **2** | Teaching engine prototype | **3 doors live** (recommend D-001, D-049, D-112) | Student can run full 8-beat flow; safety gates fire in test; i18n keys stubbed |
| **3** | Full 112-door digital twin | All doors `status=live` in digital machine | Graph complete; sequencing by house; regression paths tested |
| **4** | Physical installation / kiosk | On-site mural + kiosk build | Offline-capable lesson player; durability + accessibility pass |
| **5** | Multilingual editions | English + Mongolian first | All UI + beat captions translated; verse handling policy per language |

**Phase 2 door set (locked for prototype):** D-001 Tadasana, D-049 Bhujangasana, D-112 Padmasana (with mandatory open-seat alternate).

---

## 5. RISKS & HONESTY LAWS

| Law | Statement | Product consequence |
|-----|-----------|---------------------|
| School device | Serial asana ↔ VBT pairing is a **School of 112 Doorways** teaching device, not ancient canon | UI footer / door meta: “School pairing” |
| Historical extremes | Some VBT methods are historical or unfit for class | `practice_mode: observe_only` \| `historical` |
| Not medicine | Practice is not medical treatment | No diagnosis, prescription, or cure claims |
| No ownership | No doorway owned by the school | Credits + open citation fields |
| Pain | Pain = information | Safety layer can halt a session |
| Lotus | Never force | Alternate geometry always offered for D-112 and binds |

**Other risks:** hallucination in research bots (mitigate: guardians + source URLs); cultural flattening (mitigate: Mongolian edition + local review); kiosk misuse without teacher (mitigate: Phase 4 always shows safety beat).

---

## 6. DELIVERABLES LIST

### Exists now (Phase 0)

- [x] Volume 0 book  
- [x] School charter  
- [ ] *(Add exact file paths / URLs here when inventoried)*

### Create next (Phase 1 → 2)

| Deliverable | Path / artifact | Owner |
|-------------|-----------------|-------|
| Door schema | `schemas/door.schema.json` | Engineer |
| Door stubs × 112 | `doors/D-001` … `D-112/door.json` | Engineer + bots |
| Research bot prompts | `research/R-NNN.md` or bot configs | Chief of Staff / Engineer |
| Guardian checklist | `guardians/CHECKLIST.md` | Chief of Staff |
| Teaching engine v0 | `engine/` (sequence + readiness) | Engineer |
| Prototype tutorials | 3 × 8-beat mural scripts + art briefs | Engineer + art |
| Safety module | `engine/safety.js` (or equiv.) | Engineer |
| i18n stub | `i18n/en.json`, `i18n/mn.json` | Engineer |
| This master plan | `YOGA-TEACHING-MACHINE-MASTER-PLAN.md` | Chief of Staff |

### Later

- Phase 3: full graph export, house curricula, student progress store  
- Phase 4: kiosk hardware spec + offline package  
- Phase 5: full EN/MN editorial pass + any further languages  

---

## Engineer: first build ticket (do this first)

1. Commit `schemas/door.schema.json` matching the six instruments + safety + 8 beats.  
2. Generate 112 stub `door.json` files (`status: stub`).  
3. Flesh **D-001, D-049, D-112** to `researched` by hand or bot.  
4. Implement teaching engine that plays one door as 8 beats with safety halt.  
5. Do not start kiosk or full bot farm until schema + 3-door prototype pass review.

---

## Changelog

- **2026-09-25** — v1 master plan: vision, stack, architecture, phases, honesty laws, deliverables.
