# House 5: Doors 065–080 (Vijñāna Bhairava Tantra dhāraṇās 65–80, verses 88–103)

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
| D-065 | 65 | 88 | Darkness Before Closed Eyes, Then Before Open Eyes | *nimīlyādau netre kṛṣṇābham agrataḥ* | sensation / sight | practice | verified |
| D-066 | 66 | 89 | When a Sense Is Blocked, the Void Behind It | *yasya kasyendriyasyāpi vyāghātāc ca nirodhataḥ* | sensation / sensation | practice | verified |
| D-067 | 67 | 90 | Sounding the Plain Letter 'A' | *abindum avisargaṃ ca akāraṃ japato* | sound / sound | practice | verified |
| D-068 | 68 | 91 | At the End of the Out-Breathed 'Ḥ' | *visargāntaṃ citiṃ kuru* | sound / sound | practice | verified |
| D-069 | 69 | 92 | Oneself as Boundless Sky | *vyomākāraṃ svam ātmānaṃ dhyāyed digbhir anāvṛtam* | emptiness/space / visualization/space | practice | verified |
| D-070 | 70 | 93 | Attention Gathered at the Point of a Prick | *tīkṣṇasūcyādinā* | sensation / sensation | historical/observe_only | verified |
| D-071 | 71 | 94 | No Inner Apparatus of Mind Within Me | *cittādyantaḥkṛtir nāsti mamāntar* | other / contemplation | practice | verified |
| D-072 | 72 | 95 | Seeing Through the Powers That Limit | *māyā vimohinī nāma kalāyāḥ kalanaṃ sthitam* | other / contemplation | practice | verified |
| D-073 | 73 | 96 | Letting a Desire Return to Its Source | *jhagitīcchāṃ samutpannām avalokya śamaṃ nayet* | other / contemplation | practice | verified |
| D-074 | 74 | 97 | Who Am I Before Desire or Knowing Arise? | *yadā mamecchā notpannā jñānaṃ vā kas tadāsmi vai* | other / contemplation | practice | verified |
| D-075 | 75 | 98 | Desire or Knowing Seen as the Self | *icchāyām athavā jñāne jāte cittaṃ niveśayet* | other / contemplation | practice | verified |
| D-076 | 76 | 99 | Thoughts Belong to No One | *tattvataḥ kasyacin naitad* | other / contemplation | practice | verified |
| D-077 | 77 | 100 | The Same Awareness in Every Body | *ciddharmā sarvadeheṣu viśeṣo nāsti kutracit* | other / contemplation | practice | verified |
| D-078 | 78 | 101 | Stillness at the Heart of a Strong Emotion | *kāmakrodhalobhamohamadamātsaryagocare* | everyday activity / ordinary life | practice | verified |
| D-079 | 79 | 102 | The World as a Magic Show or a Painting | *indrajālamayaṃ viśvaṃ vyastaṃ vā citrakarmavat* | other / contemplation | practice | verified |
| D-080 | 80 | 103 | Neither in Pain nor in Pleasure: What Remains Between | *bhairavi jñāyatāṃ madhye kiṃ tattvam avaśiṣyate* | emptiness/space / gap | practice | verified |

## Observe-only doors

- **D-070** (verse 93): The classical method is deliberately piercing the body with a sharp needle and attending to the spot; self-injury is never taught. Taught as text to understand, not as a class drill.

## Unverified or partial doors

None. Every door's dhāraṇā number and verse were read in Singh's headings and cross-checked.

## Source disagreements and numbering variants

- **D-067**: How 'a' is sounded: Singh, following the commentary, implies sounding it with the breath retained; Lakshmanjoo reads the commentary as a mouth position (cakita mudrā) in which 'a' is sounded mentally. This door teaches neither retention nor the mouth position, only the plain vowel.
- **D-072**: Status as a technique: Singh counts verse 95 as dhāraṇā 72; Wallis marks it 'not a yukti'. Variant kalayan nā pṛthag bhavet recorded by Singh. / wallis_grouping: Wallis marks verse 95 '(not a yukti)': he does not count it as a technique.

Wallis numbers by yukti, not dhāraṇā: D-065 = verse 88: Darkness with eyes closed (Y64 ~ C1); D-066 = verse 89: Sensory deprivation (Y65 ~ C1); D-067 = verse 90: The phoneme ‘a’ (Y66 ~ C1); D-068 = verse 91: Aspiration (Y67 ~ C2); D-069 = verse 92: The nature of the sky (Y68 ~ B2); D-070 = verse 93: Piercing (Y69 ~ C1); D-071 = verse 94: There is no mind (Y70 ~ B3); D-072 = verse 95: (not a yukti); D-073 = verse 96: Let desire dissolve (Y71 ~ C2); D-074 = verse 97: I am as I am (Y72 ~ B2); D-075 = verse 98: When desire or thought arises (Y73 ~ B1); D-076 = verse 99: Thoughts belong to no one (Y74 ~ B1); D-077 = verse 100: Awareness in all beings (Y75 ~ B1); D-078 = verse 101: Reality is that which remains (Y76 ~ C2); D-079 = verse 102: Like a painting (Y77 ~ B1); D-080 = verse 103: Reality in the center (Y78 ~ C2).

## Sanskrit corrections and variants

- **D-067** verse 90: GRETIL and Wallis read ca akāraṃ; Pradīpaka applies sandhi (cākāraṃ). Same words.
- **D-072** verse 95: Singh records the variant reading kalayan nā pṛthag bhavet ('such a person becomes isolated, i.e. established in the Self').
- **D-074** verse 97: GRETIL encoding artefact '=B9' restored as avagraha: tattvato 'haṃ.

## Traceability

Generated by `/workspace/tmp/vbt/h27/build_houses.py` from `content_h5.py`, `maps.py` and `sanskrit.py`; validated by `validate_houses.mjs` (schema, numbering,
required fields, medical scan incl. treatment/therapy/healing, framing words, posture names) and by the engine's own `validateDoor` and safety gates.
Researcher slots R-065 … R-080; drafted 2026-10-06 by Grok Bot on branch `research/vbt-houses-2-7`.
