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

The door stores the six instruments. The sequencer speaks them as eight beats:

1. **Arrive** — name, house, element, color, seed syllable, guardian.
2. **Geometry** — the polygon and its vertices, as a sketch.
3. **Orientation** — hands, gaze, and the joint that leads.
4. **Breath** — inhale, exhale, and pause in equal counts (a comfortable pulse, not a clock second), and the bandha or the refusal to use one.
5. **Reaction** — reactants, catalyst, product, phase. A metaphor. Nothing is mixed or applied.
6. **Attention** — the locus.
7. **Adiyogi method** — VBT verse number and a teaching gloss. Extreme verses are marked observe-only until the profile allows practice.
8. **Close** — leave the figure, one of the five ways, the first safety note.

Five laws can interrupt that order. Pain halts the session with no script. Lotus (door 112) never opens until the profile says the student is ready, and even then a complaining knee ends it. A house above the student’s intensity clearance stays shut. If breath capacity is below the door’s demand, the shape is shown and not entered, and the count is shortened. The laws are in `engine/safety.ts` and `safety/rules.md`. The working plan is `docs/YOGA-TEACHING-MACHINE-MASTER-PLAN.md` (an engineer draft, until a Chief of Staff text replaces it).

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

Lotus stays shut on that profile. Both the guardian gate and the lotus law refuse it, and there is no tutorial to follow:

```bash
npm run teach -- --door 112
```

A profile that has cleared the house and is willing to study the extreme verse without being asked to perform it:

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
docs/        master plan (engineer draft)
profiles/    example readiness files
```
