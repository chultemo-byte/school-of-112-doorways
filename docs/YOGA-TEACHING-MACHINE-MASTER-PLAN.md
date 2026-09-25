# Yoga Teaching Machine — Master Plan

Status: Engineer draft — replace with Chief of Staff verbatim when provided.

This document is a working plan written so the prototype can be built and reviewed. It is not a verbatim Chief of Staff text. Where a later plan disagrees, the later plan wins, except that the five hard laws below stay in force until they are explicitly revised.

## Purpose

The School of 112 Doorways is a teaching machine for āsana and contemplation. It holds one hundred and twelve doors. Three are seeded: Mountain, Cobra, and Lotus. The rest are numbered and unassigned.

A door is not a video and not a feed. It is a record a teacher, or the sequencer, can walk in order. The tone is the tone of a craft: exact, willing to stop, uninterested in keeping a student for one more minute than the practice asks.

The machine does not diagnose, does not clear a student for a pose, and does not claim that a verse number is a medical or initiatory attainment. Verse pairings are teaching references. Editions of the Vijnana Bhairava Tantra differ by a line; the summaries say so.

## Six instruments

Every door carries the same six instruments, in this stored order:

1. **Geometry** — a polygon name and vertices. A sketch of the figure in a teaching plane.
2. **Reaction** — reactants, catalyst, product, and phase. An alchemical metaphor for what the practice is doing. Not laboratory chemistry, and not a substance.
3. **Breath** — inhale, exhale, and pause as equal counts (a comfortable pulse, not a clock second), plus the bandha, which may be “none.”
4. **Orientation** — hand placement, gaze, and the joint that leads.
5. **Attention** — the locus, and optionally a traditional center.
6. **Adiyogi method** — a Vijnana Bhairava Tantra verse number and a short gloss.

Around those six, each door also names its number, Sanskrit and English names, house, element, color, seed syllable, guardian, safety notes, and five ways of teaching it.

Optional fields the sequencer requires in practice, and which fail closed when missing:

- `house_intensity` (1–5)
- `breath_demand` (1–5)
- `requires_lotus` (boolean)
- `adiyogi_method.extreme` (boolean)

## Door flow

The stored order of the six instruments is the order on the door. The spoken tutorial is eight beats, because a student needs an arrival and a close, and because orientation is heard before the count that will limit it:

1. Arrive — name, house, element, color, bija, guardian. Nothing is asked yet.
2. Geometry
3. Orientation
4. Breath
5. Reaction metaphor
6. Attention
7. Adiyogi method
8. Close — leave the figure, one of the five ways, the first safety note.

Breath is spoken after the figure is seen and before anyone is praised for holding it. If breath capacity is below the door’s demand, beats 2 and 3 are marked `observe_only`: the figure is shown and not entered, and the count is shortened.

The three seeded doors:

| Door | Name | House | Intensity | Breath demand | VBT | Extreme |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Tāḍāsana, Mountain | House of the Rooted Axis | 1 | 1 | 24 (yukti 1) | no |
| 49 | Bhujaṅgāsana, Cobra | House of the Wakeful Spine | 3 | 2 | 49 (yukti 23) | no |
| 112 | Padmāsana, Lotus | House of the Unstruck Seat | 5 | 3 | 138 (yukti 112) | yes |

Other houses are not invented here. Unassigned doors stay null in `doors/index.json` until a later plan names them.

## Safety — five hard laws

Encoded as named constants and gate functions in `engine/safety.ts`. Prose copy: `safety/rules.md`.

1. **Pain is a hard stop** (`PAIN_IS_A_HARD_STOP`). Halt. Never push through. No script.
2. **Lotus is never forced** (`LOTUS_IS_NEVER_FORCED`). Door 112, and any `requires_lotus` door, stays shut until `lotus_ready` is true. The teaching script, when the door does open, still tells the student to leave if a knee complains.
3. **Extreme VBT is observe_only** (`EXTREME_VBT_IS_OBSERVE_ONLY`). While `vbt_observe_only` is true, an extreme dharana is heard and not performed. Door 112’s verse is extreme. Verses 24 and 49, as used here, are not.
4. **Breath leads posture** (`BREATH_LEADS_POSTURE`). Geometry is not forced against breath capacity. Low capacity marks geometry and orientation `observe_only` and shortens the count.
5. **Guardian intensity gate** (`GUARDIAN_INTENSITY_GATE`). `intensity_clearance` must meet `house_intensity` before the door opens.

A missing intensity or a missing breath demand fails closed. These laws are ordinary teaching limits, not medical claims.

## Sequencer

`engine/sequencer.ts` loads a door by number, or chooses the next seeded door the laws allow, and returns a session:

- `status`: `teaching`, `halt`, or `blocked`
- `door`: the door, or null when pain stops the meeting before a door opens
- `script`: eight beats, or an empty list when halted or blocked
- `gates`: one result per law
- `message`: a single paragraph a teacher can read aloud as the reason

A blocked or halted session has no tutorial to follow. Callers must not improvise a lotus from the door JSON after a block.

Student profile:

```ts
{
  pain: boolean;
  lotus_ready: boolean;
  vbt_observe_only: boolean;
  completed_doors: number[];
  breath_capacity: number; // 1–5
  intensity_clearance: number; // 1–5
}
```

Run:

```bash
npm install
npx tsc --noEmit
npm run teach -- --door 1
npm run check
```

Exit codes: `0` teaching, `2` halt, `3` blocked, `1` bad input or an unassigned door.

## Bots

Eight roles in `bots/roster.json`: Doorwarden, Geometer, Orienter, Counter, Alembic, Lamp, Reader, Closer. They are duties, not a cast. The Doorwarden may refuse the others their turn. A person in the room outranks the roster when pain appears.

## Roadmap

What this draft does not do, and does not pretend to have done:

- Name doors 2–48, 50–111, or assign their houses.
- Replace this file with a Chief of Staff verbatim plan.
- Build the cartoon as software. The storyboard is `ui/cartoon-tutorial.md`.
- Add accounts, progress streaks, or advice that outruns the five laws.
- Treat a verse gloss as a translation or as śakti-pāta.

When the remaining doors are seeded, each one must validate against `schemas/door.schema.json`, carry real safety notes, and fail closed if intensity or breath demand is omitted. Lotus-like demands set `requires_lotus`. Forceful or culminating dharanas set `adiyogi_method.extreme`.
