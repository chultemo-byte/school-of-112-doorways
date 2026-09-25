# School of 112 Doorways

A teaching machine for yoga. One hundred and twelve doors. Each door is six instruments and a set of limits: geometry, an alchemical metaphor, breath, orientation, attention, and a verse from the Vijnana Bhairava Tantra, plus a guardian and serious safety notes.

Three doors are fully seeded. The others are numbered in `doors/index.json` and left unnamed.

| Door | File | Practice |
| --- | --- | --- |
| 1 | `doors/001.json` | Tāḍāsana, Mountain |
| 49 | `doors/049.json` | Bhujaṅgāsana, Cobra |
| 112 | `doors/112.json` | Padmāsana, Lotus |

This is a craft record, not a feed. It does not diagnose, and it does not claim a pose or a verse as medical treatment.

## How a door is spoken

The door stores the six instruments. The sequencer speaks them as eight beats, in the master plan’s order:

1. **Name the door** — Sanskrit, English, house, lineage, and the `school_device` pairing label.
2. **Geometry** — the polygon and its vertices, as a sketch. Lotus offers the open-seat twin here.
3. **Orientation** — hands, gaze, and the joint that leads.
4. **Breath** — inhale, exhale, and pause in equal counts (a comfortable pulse, not a clock second), and the bandha or the refusal to use one. A short breath shortens the count.
5. **Attention** — the locus.
6. **Reaction** — reactants, catalyst, product, phase. A metaphor. Nothing is mixed or applied.
7. **Adiyogi thread** — VBT verse number and a teaching gloss, in its safe form. Extreme methods are observe-only, not class drills.
8. **Exit / integrate** — leave the figure, one of the five ways, and the line that practice is not medical treatment.

Five laws can interrupt that order. Pain pauses, names a regression door when there is an earlier one, and exits — the script is empty, and nothing is pushed through. Lotus and any closed hip or knee bind are never forced; door 112 teaches Sukhāsana or a chair unless the profile is lotus-ready, and even then the knee is not hauled. Extreme VBT stays historical or observe-only. Diagnose and cure language blocks a door. Every taught door credits its lineage and is labeled `school_device`. The laws are in `engine/safety.ts` and `safety/rules.md`. The plan is `docs/YOGA-TEACHING-MACHINE-MASTER-PLAN.md`, the Chief of Staff text, verbatim.

## Run the prototype

```bash
npm install
npx tsc --noEmit
npm run teach -- --door 1
```

Cobra, with the default profile (breath 3, intensity clearance 3):

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

Omit `--door` and the sequencer opens the next seeded door the laws allow. `npm run check` validates the three doors and the gates.

`--json` prints the session object. npm itself writes a banner on stdout, so for a clean document use:

```bash
npm run --silent teach -- --json --door 1
```

Exit codes: `0` teaching, `2` halted for pain, `3` door blocked, `1` bad input or an unassigned number.

## Layout

```
doors/       001, 049, 112, and index.json for all 112
schemas/     door.schema.json
engine/      types, safety gates, sequencer
safety/      the five laws in prose; index.ts re-exports the gates
bots/        eight teaching roles
ui/          cartoon storyboard (not an app)
docs/        Chief of Staff master plan, verbatim
profiles/    example readiness files
```
