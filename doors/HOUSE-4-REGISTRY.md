# House 4: Doors 049–064 (Vijñāna Bhairava Tantra dhāraṇās 49–64, verses 72–87)

**Framing (door schema v2.0.0, `framing: "vbt_dharana"`):** door N = VBT dhāraṇā N in Jaideva Singh's numbering
(*Vijñānabhairava or Divine Consciousness*, Motilal Banarsidass 1979; dhāraṇā 1 = verse 24). Same method and standard as
House 1 (`doors/HOUSE-1-REGISTRY.md`). These are **new doors**: `doors/index.json` at 32e76c4 lists them as unassigned, so
`previous_label` / `previous_file` say so honestly (Door 049 and Door 112 also had prototype seeds; see below).

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
| D-049 | 49 | 72 | The Fullness of Savouring Food and Drink | *jagdhipānakṛtollāsarasānandavijṛmbhaṇāt* | everyday activity / ordinary life | practice | verified |
| D-050 | 50 | 73 | Becoming One with the Joy of Music | *gītādiviṣayāsvādāsamasaukhya* | sound / sound | practice | verified |
| D-051 | 51 | 74 | Resting the Mind Wherever It Is Content | *yatra yatra manas tuṣṭir manas tatraiva dhārayet* | everyday activity / ordinary life | practice | verified |
| D-052 | 52 | 75 | The Threshold of Sleep | *anāgatāyāṃ nidrāyām* | other / gap | practice | verified |
| D-053 | 53 | 76 | Gazing at Space Dappled with Light | *ākāśe śabalīkṛte* | sensation / sight | practice | verified |
| D-054 | 54 | 77 | The Five Seals at the Moment of Seeing | *karaṅkiṇyā krodhanayā bhairavyā lelihānayā khecaryā* | other / contemplation | historical/observe_only | verified |
| D-055 | 55 | 78 | Sitting Unsupported on a Soft Seat | *mṛdvāsane sphijaikena hastapādau nirāśrayam* | sensation / sensation | historical/observe_only | verified |
| D-056 | 56 | 79 | The Space in the Armpits | *kakṣavyomni manaḥ kurvañ* | sensation / sensation | practice | verified |
| D-057 | 57 | 80 | A Steady Gaze on a Solid Object | *sthūlarūpasya bhāvasya stabdhāṃ dṛṣṭiṃ nipātya* | sensation / sight | practice | verified |
| D-058 | 58 | 81 | Mouth Open, Mentally Sounding 'Ha' | *hoccāraṃ manasā kurvaṃs* | sound / sound | practice | verified |
| D-059 | 59 | 82 | The Body Contemplated as Unsupported | *nirādhāraṃ vibhāvayan svadehaṃ* | sensation / sensation | practice | verified |
| D-060 | 60 | 83 | Gentle Rocking or Swaying | *calāsane sthitasyātha śanair vā dehacālanāt* | sensation / sensation | practice | verified |
| D-061 | 61 | 84 | Gazing into a Clear Sky | *ākāśaṃ vimalam paśyan* | sensation / sight | practice | verified |
| D-062 | 62 | 85 | The Whole Sky Dissolved in the Head | *līnaṃ mūrdhni viyat sarvam* | visualization / visualization/space | practice | verified |
| D-063 | 63 | 86 | Waking, Dream and Deep Sleep as One Light | *viśvādi bhairavaṃ rūpaṃ jñātvā* | other / contemplation | practice | verified |
| D-064 | 64 | 87 | Contemplating the Darkness of a Moonless Night | *evam eva durniśāyāṃ kṛṣṇapakṣāgame ciram* | sensation / sight | practice | verified |

## Observe-only doors

- **D-054** (verse 77): The verse names five esoteric seals (mudrā) known only from commentary; some involve physical techniques (a tense, tight disposition; turning the tongue back toward the palate; an unblinking fixed gaze) and they belong to initiatory lineages. Taught as text to understand, not as a class drill.
- **D-055** (verse 78): The technique is itself a specific unsupported body position (sitting on the buttocks with hands and feet held off any support). This school does not teach body positions as dharanas, and the unsupported balance can strain the back and hips or cause a fall. Taught as text to understand, not as a class drill.

## Unverified or partial doors

None. Every door's dhāraṇā number and verse were read in Singh's headings and cross-checked.

## Source disagreements and numbering variants

- **D-049**: prototype_seed: The older prototype seed doors/049.json pairs door 49 with verse 49, Wallis yukti 23 (superseded: under Singh, verse 49 is dhāraṇā 26, Door D-026; dhāraṇā 49 is verse 72). Not followed.
- **D-054**: wallis_grouping: Wallis counts the five mudrās of verse 77 as five yuktis (Y49–53).
- **D-056**: Arm position: the verse says only 'arms half-bent'; Singh renders 'arms in the form of an arch overhead' and 'gaze fixed in the armpits'; Wallis and Bäumer follow the verse. This door follows the verse.
- **D-058**: Tongue: Singh reads the tongue inverted toward the palate (khecarī mudrā); Wallis and Bäumer read it resting in the middle of the open mouth. This door follows the latter.

Wallis numbers by yukti, not dhāraṇā: D-049 = verse 72: The Pleasure of Food and Drink (Y44 ~ C1); D-050 = verse 73: Music and Song (Y45 ~ C1); D-051 = verse 74: Wherever the heart-mind finds delight (Y46 ~ C1); D-052 = verse 75: On the edge of sleep (Y47 ~ A1); D-053 = verse 76: Patterns of light (Y48 ~ C1); D-054 = verse 77: Krama mudrās (Y49-53; B2, A2, C2, A2 & A4 respectively); D-055 = verse 78: [Wallis's heading names a posture; withheld under the school's no-posture-names rule] (Y54 ~ A1); D-056 = verse 79: Space in the armpits (Y55 ~ A1); D-057 = verse 80: Looking without a story (Y56 ~ C1); D-058 = verse 81: Mental uccāra of ‘ha’ (Y57 ~ A1); D-059 = verse 82: Floating without support (Y58 ~ A2); D-060 = verse 83: Rocking the body (Y59 ~ A1); D-061 = verse 84: Sky-gazing (Y60 ~ C1); D-062 = verse 85: The sky is in your head (Y61 ~ C2); D-063 = verse 86: The three states (Y62 ~ B2); D-064 = verse 87: Dark night (Y63 ~ C2).

## Sanskrit corrections and variants

- **D-050** verse 73: GRETIL reads gitādi-; corrected to gītādi- with Wallis.
- **D-051** verse 74: GRETIL reads -svārūpaṃ; corrected to -svarūpaṃ with Wallis and Pradīpaka.
- **D-056** verse 79: Sandhi only: GRETIL kurvan śamam; Wallis kurvañ śamam, Pradīpaka kurvañchamam.
- **D-059** verse 82: GRETIL (and Pradīpaka) read kṣiṇe; corrected to kṣīṇe with Wallis (the same line has kṣīṇāśayo).

## Other honesty flags

- **D-055**: Wallis's concordance heading for verse 78 is a posture name; it is withheld in this record under the school's no-posture-names rule.
- **D-057**: School adjustment: the verse and Singh describe an unblinking gaze; this school keeps the steadiness and allows normal blinking.
- **D-061**: School adjustment: Singh reads 'fixed eyes' as without blinking; this school keeps the steady gaze and allows normal blinking.

## Prototype seeds

The prototype seed files `doors/049.json` and `doors/112.json` are **left unchanged** and `doors/index.json` still points at them.
The new research doors `doors/D-049/door.json` and `doors/D-112/door.json` record the seeds as `previous_file`, keep their lineage text and safety notes
(posture names redacted) in `honesty.legacy` / `safety.legacy_notes`, and note that the seeds used a different verse.

## Traceability

Generated by `/workspace/tmp/vbt/h27/build_houses.py` from `content_h4.py`, `maps.py` and `sanskrit.py`; validated by `validate_houses.mjs` (schema, numbering,
required fields, medical scan incl. treatment/therapy/healing, framing words, posture names) and by the engine's own `validateDoor` and safety gates.
Researcher slots R-049 … R-064; drafted 2026-10-06 by Grok Bot on branch `research/vbt-houses-2-7`.
