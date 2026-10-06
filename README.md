# School of 112 Doorways

Living memory of the Vijñāna Bhairava Tantra. One hundred and twelve doors, one for each dhāraṇā. Door N is VBT dhāraṇā N in Jaideva Singh's numbering (1979), so Door 001 is dhāraṇā 1, verse 24. The door-to-dhāraṇā index is a school device, not an ancient one-to-one canon.

House 1, doors 001–016, is published at https://www.yoga112.com. Each door is `doors/D-00N/door.json` (schema 2.0.0, `framing: vbt_dharana`), validated with `schemas/research-door.schema.json` and described in `schemas/RESEARCH-DOOR-SCHEMA.md`. The registry is `doors/HOUSE-1-REGISTRY.md`. Doors 004, 008, 013 and 014 are `historical/observe_only`: the site shows them as classical descriptions to read, with no practice cues. Doors 017–112 are being remembered and are not published. Earlier House 1 drafts paired each door with a standing posture; that framing is retired, and the old labels survive only in `previous_label` and the `legacy` fields of each record.

| Door | File | Status |
| --- | --- | --- |
| D-001–D-016 | `doors/D-00N/door.json` | House 1, VBT dhāraṇās 1–16, published |
| 017–112 | `doors/index.json` (null names) | Being remembered |
| 49, 112 | `doors/049.json`, `doors/112.json` | Legacy prototype records, used only by the engine self-check, not published |

This is a craft record, not a feed. It does not diagnose, and it does not claim any practice or verse as medical treatment.

## The public site

Vercel serves `public/`. `npm run build:public` (`scripts/build-public-doors.mjs`) regenerates it from the door records:

- `public/door-001.html` … `door-016.html`: door number, VBT verse, technique name, category, the plain one-line instruction (`doors/HOUSE-1-PLAIN-LINES.json`), practice mode, safety and honesty flags. Observe-only doors show the classical description and a link to a door to practise instead.
- `public/index.html` (the gate), `public/112.html` (the city map), `public/doors.json` and `public/doors-part1..4.json`.
- `public/door-sealed.html?n=N` is the "being remembered" page for doors 017–112. `door-049.html`, `door-112.html` and `pose.html` are redirects kept for old links.
- Every door page has an empty `<section id="guidance-slot">` for a later spoken guidance player and visual. It carries `data-door`, `data-dharana`, `data-verse` and `data-practice-mode`, and is hidden while empty.

The build refuses to write if any public file carries a retired posture name, market framing words, or a diagnose/cure claim, or if an observe-only page carries practice cues. `npm run check` repeats those scans over everything in `public/`.

## How a door is spoken

A House 1 door already stores eight beats. The sequencer speaks those scripts as written. Doors 004, 008, 013 and 014 keep `adiyogi.practice_mode` `observe_only`; their Adiyogi beat is marked observe-only and the recorded script is not rewritten.

The legacy prototype records 049 and 112 still store the six instruments. The sequencer speaks them as eight beats, in the master plan’s order:

1. **Name the door** — Sanskrit, English, house, lineage, and the `school_device` pairing label.
2. **Geometry** — the polygon and its vertices, as a sketch. Record 112 gives the open-seat twin here.
3. **Orientation** — hands, gaze, and the joint that leads.
4. **Breath** — inhale, exhale, and pause in equal counts (a comfortable pulse, not a clock second), and the bandha or the refusal to use one. A short breath shortens the count.
5. **Attention** — the locus.
6. **Reaction** — the reaction fields and phase. A metaphor. Nothing is mixed or applied.
7. **Adiyogi thread** — VBT verse number and a teaching gloss, in its safe form. Extreme methods are observe-only, not class drills.
8. **Exit / integrate** — leave the figure, one of the five ways, and the line that practice is not medical treatment.

Five laws can interrupt that order. Pain pauses, names a regression door when there is an earlier one, and exits — the script is empty, and nothing is pushed through. Lotus and any closed hip or knee bind are never forced; door 112 teaches Sukhāsana or a chair unless the profile is lotus-ready, and even then the knee is not hauled. Extreme VBT stays historical or observe-only. Diagnose and cure language blocks a door. Every taught door credits its lineage and is labeled `school_device`. The laws are in `engine/safety.ts` and `safety/rules.md`. The plan is `docs/YOGA-TEACHING-MACHINE-MASTER-PLAN.md`, the Chief of Staff text, verbatim.

## Run the prototype

```bash
npm install
npx tsc --noEmit
npm run teach -- --door 1
npm run teach -- --door 2
npm run teach -- --door 13
npm run teach -- --door 16
```

Legacy record 049, with the default profile (breath 3, intensity clearance 3):

```bash
npm run teach -- --door 49
```

Door 112 on that profile teaches the open-seat twin and reads verse 138 as observe-only. It does not ask for lotus:

```bash
npm run teach -- --door 112
```

With `lotus_ready` true the closed seat may be described, still never forced, and the verse stays observe-only:

```bash
npm run teach -- --door 112 --profile profiles/lotus-cleared.json
```

Omit `--door` and the sequencer opens the next researched or seeded door the laws allow. `npm run check` validates House 1, the legacy records 049 and 112, the gates, and the public site.

`--json` prints the session object. npm itself writes a banner on stdout, so for a clean document use:

```bash
npm run --silent teach -- --json --door 1
```

Exit codes: `0` teaching, `2` halted for pain, `3` door blocked, `1` bad input or an unassigned number.

## Layout

```
doors/       D-001…D-016/door.json, 049, 112, index.json, HOUSE-1-REGISTRY.md, HOUSE-1-PLAIN-LINES.json
schemas/     door.schema.json (prototype), research-door.schema.json (House 1)
engine/      types, safety gates, sequencer
guardians/   checklist and House 1 reviews
safety/      the five laws in prose; index.ts re-exports the gates
bots/        eight teaching roles
public/      the deployed site (generated by scripts/build-public-doors.mjs)
ui/          earlier storyboards and posture-era prototypes (not deployed)
docs/        Chief of Staff master plan, verbatim
profiles/    example readiness files
```
