# House 3: Doors 033–048 (Vijñāna Bhairava Tantra dhāraṇās 33–48, verses 56–71)

**Framing (door schema v2.0.0, `framing: "vbt_dharana"`):** door N = VBT dhāraṇā N in Jaideva Singh's numbering
(*Vijñānabhairava or Divine Consciousness*, Motilal Banarsidass 1979; dhāraṇā 1 = verse 24). Same method and standard as
House 1 (`doors/HOUSE-1-REGISTRY.md`). These are **new doors**: `doors/index.json` at 32e76c4 lists them as unassigned, so
`previous_label` / `previous_file` say so honestly.

- Numbering read from Singh's own `[Dhāraṇā N] VERSE V` headings (scanned copy, pdftotext), cross-checked against *The Mystery Within* (2019)
  'Session Two' list, which follows Singh, and Wallis's verse-by-verse concordance (hareesh.org, Parts 1 and 2).
- Sanskrit: GRETIL e-text, compared with Wallis's concordance, Pradīpaka and the Singh scan. GRETIL input errors are corrected and every
  correction is listed in the door's `dharana.sanskrit_variants`. Pradīpaka shares much of GRETIL's input, so it is not counted as independent.
- English is a school paraphrase drawing on Singh, Wallis and Bäumer, never a quotation.
- Any position is an optional `seat` flagged as a school device. Breath counts are an optional pacing aid; `breath.hold` is always 0.
- `historical/observe_only` doors are taught as text to understand, with no practice cues.
- All doors are `status: "draft"`, `review.status: "pending_guardian_review"`.
- Optional fields added in the `dharana` object (the schema allows extra properties; no schema change): `category_plain` (one of breath, sensation,
  sound, gap, sight, ordinary life, visualization/space; or contemplation / devotion where none of those honestly fits), `instruction`
  (one plain-English line), and `source_disagreements` where sources differ. `drafted_by` is added at the top level.

| Door | Dhāraṇā | Verse (Singh) | Technique | Sanskrit tag | Category (schema / plain) | Practice mode | Verification |
|------|---------|---------------|-----------|--------------|---------------------------|---------------|--------------|
| D-033 | 33 | 56 | The Paths of Manifestation Dissolving Step by Step | *bhuvanādhvādirūpeṇa cintayet kramaśo 'khilam* | visualization / visualization/space | practice | verified |
| D-034 | 34 | 57 | The Whole Universe Seen as Śiva, All at Once | *tattvaṃ śaivaṃ dhyātvā mahodayaḥ* | other / contemplation | practice | verified |
| D-035 | 35 | 58 | The Universe as Void | *viśvam etan mahādevi śūnyabhūtaṃ vicintayet* | emptiness/space / visualization/space | practice | verified |
| D-036 | 36 | 59 | Gazing into the Space Inside a Pot | *ghaṭādibhājane dṛṣṭiṃ bhittīs tyaktvā* | sensation / sight | practice | verified |
| D-037 | 37 | 60 | Gazing over Open Country | *nirvṛkṣagiribhittyādideśe dṛṣṭiṃ vinikṣipet* | sensation / sight | practice | verified |
| D-038 | 38 | 61 | The Middle Between Two Perceptions | *ubhayor bhāvayor jñāne dhyātvā madhyaṃ samāśrayet* | emptiness/space / gap | practice | verified |
| D-039 | 39 | 62 | Not Moving On to the Next Thing | *bhāve tyakte niruddhā cin naiva bhāvāntaraṃ vrajet* | emptiness/space / gap | practice | verified |
| D-040 | 40 | 63 | Body and World as Consciousness, All at Once | *sarvaṃ dehaṃ cinmayaṃ hi jagad vā* | other / contemplation | practice | verified |
| D-041 | 41 | 64 | The Meeting of the Two Breaths | *vāyudvayasya saṃghaṭṭād* | breath / breath | historical/observe_only | verified |
| D-042 | 42 | 65 | Body and World Filled with One's Own Bliss | *svānandabharitaṃ smaret* | sensation / sensation | practice | verified |
| D-043 | 43 | 66 | Sudden Joy from a Trick or a Wonder | *kuhanena prayogeṇa* | everyday activity / ordinary life | practice | verified |
| D-044 | 44 | 67 | All Streams Closed, the Creeping of Ants | *pipīlasparśavelāyām* | sensation / sensation | historical/observe_only | verified |
| D-045 | 45 | 68 | Between Fire and Poison | *vahner viṣasya madhye tu* | other / sensation | historical/observe_only | verified |
| D-046 | 46 | 69 | The Delight at the Culmination of Union | *tat sukhaṃ svākyam ucyate* | other / sensation | historical/observe_only | verified |
| D-047 | 47 | 70 | The Memory of Love's Delight | *strīsukhasya bharāt smṛteḥ* | other / sensation | historical/observe_only | verified |
| D-048 | 48 | 71 | Merging with a Great Joy, Such as Meeting a Friend | *dṛṣṭe vā bāndhave cirāt* | everyday activity / ordinary life | practice | verified |

## Observe-only doors

- **D-041** (verse 64): In Singh's reading the practice culminates in the complete cessation of in-breath and out-breath; this school does not induce breath cessation. Taught as text to understand, not as a class drill.
- **D-044** (verse 67): The classical method closes all the sense openings (in commentary, by a sensory seal and breath retention) to make the breath-power rise; this school does not teach sense-sealing or retention. Taught as text to understand, not as a class drill.
- **D-045** (verse 68): The verse concerns sexual union (read esoterically by Singh, literally by Wallis) and, in both readings, breath restraint. Taught as text to understand, not as a class drill.
- **D-046** (verse 69): The verse concerns the delight of sexual union. Taught as text to understand, not as a class drill.
- **D-047** (verse 70): The verse concerns the memory of sexual pleasure. Taught as text to understand, not as a class drill.

## Unverified or partial doors

None. Every door's dhāraṇā number and verse were read in Singh's headings and cross-checked.

## Source disagreements and numbering variants

- **D-034**: wallis_grouping: Wallis counts verse 57 as the continuation of verse 56 (Y29), not a separate yukti.
- **D-036**: OCR note: Singh's heading reads '[Dhāraṇā 36] VERSE' with the verse number lost in the OCR; the verse text that follows carries the end-number 59 and sits between VERSE 58 and VERSE 60.
- **D-041**: saṃghaṭṭa: Singh reads 'fusion' leading to complete cessation of both breaths; Wallis reads 'dynamic tension' of the two prāṇas; Bäumer 'meeting'.
- **D-043**: kuhana: Singh reads 'magic / a magical performance' (wonder); Lakshmanjoo (via Singh) reads 'tickling the armpit'; Wallis 'a trick'. This door follows the wonder reading and records the others.
- **D-045**: Singh reads vahni and viṣa esoterically (contraction and expansion of kuṇḍalinī; viṣa from viṣ 'to pervade', not 'poison') and the union as internal; Wallis reads the verse as concerning sexual union itself, with breath retention.

Wallis numbers by yukti, not dhāraṇā: D-033 = verse 56: The system of paths (Y29 ~ A3); D-034 = verse 57: (The system of paths cont’d); D-035 = verse 58: Everything is empty (Y30 ~ C3); D-036 = verse 59: Space in a pot (Y31 ~ C2); D-037 = verse 60: Gazing on an open field (Y32 ~ C1); D-038 = verse 61: Noticing the space between (Y33 ~ C2); D-039 = verse 62: Centering in the space between (Y34 ~ C2); D-040 = verse 63: The body-world is awareness (Y35 ~ B2); D-041 = verse 64: Fusion of inhalation and exhalation (Y36 ~ A3); D-042 = verse 65: Body of bliss (Y37 ~ A2); D-043 = verse 66: Trick-method (Y38 ~ C1); D-044 = verse 67: Formication (Y39 ~ A3); D-045 = verse 68: Mindful sex: between fire and poison (Y40 ~ A3); D-046 = verse 69: Blissful Sex (Y41 ~ A2); D-047 = verse 70: Memories of Sex (Y42 ~ A1); D-048 = verse 71: The Joy of Meeting Friends (Y43 ~ C1).

## Sanskrit corrections and variants

- **D-034** verse 57: GRETIL (and Pradīpaka) read dhyatvā; corrected to dhyātvā with Wallis.
- **D-036** verse 59: GRETIL reads ghatādi- and bhittis; corrected to ghaṭādi- and bhittīs with Wallis and Pradīpaka.
- **D-037** verse 60: GRETIL reads vṛttikṣiṇaḥ; corrected to vṛttikṣīṇaḥ with Wallis and Pradīpaka.
- **D-038** verse 61: Singh records that Jayaratha (Tantrāloka commentary) reads jñātvā ('having known') for dhyātvā ('having meditated') and prefers it.
- **D-039** verse 62: Singh records that the Kashmir Series edition reads bhāve nyakte; he follows bhāve tyakte (as GRETIL, Wallis and Pradīpaka do) on the authority of Jayaratha.
- **D-042** verse 65: Singh reports Lakshmanjoo's reading of vā as ca ('and': the world and the body together) rather than 'or'.

## Other honesty flags

- **D-033**: School simplification: the six Trika paths are presented as three levels (gross, subtle, supreme); the full scheme is recorded in commentary_note.
- **D-045**: Sexual content: the verse concerns sexual union or its memory. Recorded as classical text only; no practice cues are given.
- **D-046**: Sexual content: the verse concerns sexual union or its memory. Recorded as classical text only; no practice cues are given.
- **D-047**: Sexual content: the verse concerns sexual union or its memory. Recorded as classical text only; no practice cues are given.

## Traceability

Generated by `/workspace/tmp/vbt/h27/build_houses.py` from `content_h3.py`, `maps.py` and `sanskrit.py`; validated by `validate_houses.mjs` (schema, numbering,
required fields, medical scan incl. treatment/therapy/healing, framing words, posture names) and by the engine's own `validateDoor` and safety gates.
Researcher slots R-033 … R-048; drafted 2026-10-06 by Grok Bot on branch `research/vbt-houses-2-7`.
