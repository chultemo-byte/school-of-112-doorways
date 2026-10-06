# House 7: Doors 097–112 (Vijñāna Bhairava Tantra dhāraṇās 97–112, verses 122–137)

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
| D-097 | 97 | 122 | While One Thing Is Known, the Emptiness of All Others | *vastvantare vedyamāne sarvavastuṣu śūnyatā* | emptiness/space / gap | practice | verified |
| D-098 | 98 | 123 | Beyond Pure and Impure | *na śucir hy aśucis tasmān nirvikalpaḥ sukhī bhavet* | other / contemplation | practice | verified |
| D-099 | 99 | 124 | Bhairava Is Everywhere, Even in the Ordinary | *sarvatra bhairavo bhāvaḥ sāmānyeṣv api gocaraḥ* | other / contemplation | practice | verified |
| D-100 | 100 | 125 | Equal Toward Friend and Foe | *samaḥ śatrau ca mitre ca samo mānāvamānayoḥ* | everyday activity / ordinary life | practice | verified |
| D-101 | 101 | 126 | Neither Aversion nor Attachment | *rāgadveṣavinirmuktau madhye brahma prasarpati* | everyday activity / ordinary life | practice | verified |
| D-102 | 102 | 127 | The Unknowable, Ungraspable and Empty as Bhairava | *yad avedyaṃ yad agrāhyaṃ yac chūnyaṃ yad abhāvagam* | other / contemplation | practice | verified |
| D-103 | 103 | 128 | The Mind Placed in Outer Space | *bāhyākāśe manaḥ kṛtvā nirākāśaṃ samāviśet* | emptiness/space / visualization/space | practice | verified |
| D-104 | 104 | 129 | Wherever the Mind Goes, Let It Go at Once | *yatra yatra mano yāti tat tat tenaiva tatkṣaṇam* | other / contemplation | practice | verified |
| D-105 | 105 | 130 | Sounding the Name 'Bhairava' | *bhairavaśabdasya santatoccāraṇāc chivaḥ* | sound / sound | practice | verified |
| D-106 | 106 | 131 | 'I' and 'Mine': Following Them to No Support | *ahaṃ mamedam ityādi pratipattiprasaṅgataḥ* | other / contemplation | practice | verified |
| D-107 | 107 | 132 | Eternal, Pervading, Supportless: Contemplating the Words | *nityo vibhur nirādhāro vyāpakaś cākhilādhipaḥ* | other / contemplation | practice | verified |
| D-108 | 108 | 133 | All This Is Like a Magic Show | *atattvam indrajālābham idaṃ sarvam avasthitam* | other / contemplation | practice | verified |
| D-109 | 109 | 134 | The Unchanging Self: This World Is Empty | *ātmano nirvikārasya kva jñānaṃ kva ca vā kriyā* | other / contemplation | practice | verified |
| D-110 | 110 | 135 | No Bondage, No Liberation: The Sun in the Water | *na me bandho na mokṣo me* | other / contemplation | practice | verified |
| D-111 | 111 | 136 | Pleasure and Pain Come Through the Senses: Abiding in Oneself | *itīndriyāṇi saṃtyajya svasthaḥ svātmani vartate* | sensation / sensation | practice | verified |
| D-112 | 112 | 137 | Knower and Known as One | *ekam ekasvabhāvatvāj jñānaṃ jñeyaṃ vibhāvyate* | other / contemplation | practice | verified |

## Observe-only doors

None in this house.

## Unverified or partial doors

None. Every door's dhāraṇā number and verse were read in Singh's headings and cross-checked.

## Source disagreements and numbering variants

- **D-097**: mystery_within_parallel: The parallel-translations section of The Mystery Within labels verse 122 'Dharana 99', because from verse 106 on it gives every verse its own number (106 = 83 … 137 = 114). Singh and the same book's Session Two list put this at dhāraṇā 97. Not followed.
- **D-098**: Verse 123: GRETIL and Pradīpaka read sā śuddhiḥ ('that is purity'), as does The Mystery Within's parallel section (sa suddhih); Wallis and the Session Two list read sāśuddhiḥ ('that is impurity'), which Singh's translation supports. Lakshmanjoo (via Singh) reads na śucir nāśucis ('neither pure nor impure'), followed by Wallis's translation. / mystery_within_parallel: The parallel-translations section of The Mystery Within labels verse 123 'Dharana 100', because from verse 106 on it gives every verse its own number (106 = 83 … 137 = 114). Singh and the same book's Session Two list put this at dhāraṇā 98. Not followed.
- **D-099**: mystery_within_parallel: The parallel-translations section of The Mystery Within labels verse 124 'Dharana 101', because from verse 106 on it gives every verse its own number (106 = 83 … 137 = 114). Singh and the same book's Session Two list put this at dhāraṇā 99. Not followed.
- **D-100**: mystery_within_parallel: The parallel-translations section of The Mystery Within labels verse 125 'Dharana 102', because from verse 106 on it gives every verse its own number (106 = 83 … 137 = 114). Singh and the same book's Session Two list put this at dhāraṇā 100. Not followed.
- **D-101**: mystery_within_parallel: The parallel-translations section of The Mystery Within labels verse 126 'Dharana 103', because from verse 106 on it gives every verse its own number (106 = 83 … 137 = 114). Singh and the same book's Session Two list put this at dhāraṇā 101. Not followed.
- **D-102**: mystery_within_parallel: The parallel-translations section of The Mystery Within labels verse 127 'Dharana 104', because from verse 106 on it gives every verse its own number (106 = 83 … 137 = 114). Singh and the same book's Session Two list put this at dhāraṇā 102. Not followed.
- **D-103**: mystery_within_parallel: The parallel-translations section of The Mystery Within labels verse 128 'Dharana 105', because from verse 106 on it gives every verse its own number (106 = 83 … 137 = 114). Singh and the same book's Session Two list put this at dhāraṇā 103. Not followed.
- **D-104**: Verses 116 (D-091) and 129 (D-104) open with the same words (yatra yatra mano yāti) but give opposite instructions: 116 finds Śiva wherever the mind goes; 129 releases wherever the mind goes. Singh, Wallis and The Mystery Within all keep them as separate dhāraṇās. / mystery_within_parallel: The parallel-translations section of The Mystery Within labels verse 129 'Dharana 106', because from verse 106 on it gives every verse its own number (106 = 83 … 137 = 114). Singh and the same book's Session Two list put this at dhāraṇā 104. Not followed.
- **D-105**: Singh reads uccāraṇa as the inner rising of the life-force (prāṇa-śakti) from the heart to the dvādaśānta, not spoken repetition; Wallis renders 'constantly utters'. The door teaches soft sounding, aloud or silent, and does not teach directing the life-force. / The etymology in the verse is read in several ways (Wallis: 'up to five ways to translate this verse'); the paraphrase follows the shared core: radiance, resounding, giving, pervading. / mystery_within_parallel: The parallel-translations section of The Mystery Within labels verse 130 'Dharana 107', because from verse 106 on it gives every verse its own number (106 = 83 … 137 = 114). Singh and the same book's Session Two list put this at dhāraṇā 105. Not followed. / OCR note: Singh's heading is OCR'd as '[Dhāraṇā lOS]' (105).
- **D-106**: mystery_within_parallel: The parallel-translations section of The Mystery Within labels verse 131 'Dharana 108', because from verse 106 on it gives every verse its own number (106 = 83 … 137 = 114). Singh and the same book's Session Two list put this at dhāraṇā 106. Not followed.
- **D-107**: mystery_within_parallel: The parallel-translations section of The Mystery Within labels verse 132 'Dharana 109', because from verse 106 on it gives every verse its own number (106 = 83 … 137 = 114). Singh and the same book's Session Two list put this at dhāraṇā 107. Not followed.
- **D-108**: mystery_within_parallel: The parallel-translations section of The Mystery Within labels verse 133 'Dharana 110', because from verse 106 on it gives every verse its own number (106 = 83 … 137 = 114). Singh and the same book's Session Two list put this at dhāraṇā 108. Not followed.
- **D-109**: Status as a technique: Singh counts verse 134 as dhāraṇā 109 (with a shared commentary on 133–134); Wallis marks it 'not a yukti'. / mystery_within_parallel: The parallel-translations section of The Mystery Within labels verse 134 'Dharana 111', because from verse 106 on it gives every verse its own number (106 = 83 … 137 = 114). Singh and the same book's Session Two list put this at dhāraṇā 109. Not followed. / wallis_grouping: Wallis marks verse 134 '(not a yukti)': he does not count it as a technique. Singh comments on 133 and 134 together but gives each its own dhāraṇā heading (108, 109); The Mystery Within's Session Two list does the same.
- **D-110**: Verse 135: Lakshmanjoo (via Singh) reads jīvasya ('for the embodied individual') for bhītasya ('for the frightened'); the printed texts (GRETIL, Wallis, Pradīpaka, The Mystery Within) read bhītasya. / mystery_within_parallel: The parallel-translations section of The Mystery Within labels verse 135 'Dharana 112', because from verse 106 on it gives every verse its own number (106 = 83 … 137 = 114). Singh and the same book's Session Two list put this at dhāraṇā 110. Not followed.
- **D-111**: mystery_within_parallel: The parallel-translations section of The Mystery Within labels verse 136 'Dharana 113', because from verse 106 on it gives every verse its own number (106 = 83 … 137 = 114). Singh and the same book's Session Two list put this at dhāraṇā 111. Not followed.
- **D-112**: Verse 137: Singh reports a second reading current in the Śaiva tradition (per Lakshmanjoo), jñānaṃ prakāśakaṃ loke ātmā caiva prakāśakaḥ | anayor apṛthagbhāvāj jñāne jñānī vibhāvyate; Wallis prints the standard text but translates the second reading. The paraphrase follows the printed text; both readings arrive at knower and knowing as one. / mystery_within_parallel: The parallel-translations section of The Mystery Within labels verse 137 'Dharana 114', because from verse 106 on it gives every verse its own number (106 = 83 … 137 = 114). Singh and the same book's Session Two list put this at dhāraṇā 112. Not followed. / prototype_seed: The older prototype seed doors/112.json pairs door 112 with verse 138, Wallis yukti 112 (superseded: under Singh, dhāraṇā 112 is verse 137; Singh reads verse 138 as the conclusion that follows the 112 dhāraṇās). Not followed.

Wallis numbers by yukti, not dhāraṇā: D-097 = verse 122: The emptiness of all things (Y97 ~ C2); D-098 = verse 123: Purity and impurity (Y98 ~ B3); D-099 = verse 124: The Bhairava state (Y99 ~ B3); D-100 = verse 125: Equal towards all (Y100 ~ B3); D-101 = verse 126: Neither hatred nor craving (Y101 ~ B3); D-102 = verse 127: Beyond existence (Y102 ~ B3); D-103 = verse 128: Outer space (Y103 ~ C2); D-104 = verse 129: Nothing to hang onto (Y104 ~ C3); D-105 = verse 130: The word ‘Bhairava’ (Y105 ~ B3); D-106 = verse 131: No self, no basis, no support needed (Y106 ~ B2); D-107 = verse 132: Lord of All (Y107 ~ B3); D-108 = verse 133: All this is a magic show (Y108 ~ B2); D-109 = verse 134: The world is ‘empty’ (not a yukti); D-110 = verse 135: Reflections in the mind (Y109 ~ B3); D-111 = verse 136: Abide in oneself (Y110 ~ C3); D-112 = verse 137: One essential nature (Y111 ~ B3).

## Sanskrit corrections and variants

- **D-098** verse 123: GRETIL and Pradīpaka read sā śuddhiḥ ('that is purity'); corrected to sāśuddhiḥ (sā aśuddhiḥ, 'that is impurity') with Wallis and The Mystery Within's Session Two (sa'suddhih); Singh's translation ('only impurity in the Śaiva system') supports it. Singh reports that Lakshmanjoo reads the second line na śucir nāśucis ('neither pure nor impure'), which Wallis's translation follows.
- **D-099** verse 124: GRETIL (and Pradīpaka) read -vyatirekteṇa; corrected to -vyatirekeṇa with Wallis.
- **D-100** verse 125: GRETIL prints a double daṇḍa at the half-verse and paripūrṇatvāt iti; corrected to paripūrṇatvād iti with Wallis and Pradīpaka.
- **D-108** verse 133: GRETIL and Wallis read indrajālasya iti; Pradīpaka applies sandhi (indrajālasyeti).
- **D-110** verse 135: Singh reports that Lakshmanjoo prefers jīvasya ('for the embodied individual') to bhītasya ('for the frightened'); GRETIL, Wallis, Pradīpaka and The Mystery Within read bhītasya.
- **D-112** verse 137: Sandhi corrected: GRETIL -svabhāvatvāt jñānaṃ; Wallis and Pradīpaka -svabhāvatvāj jñānaṃ. Singh reports a second reading current in the Śaiva tradition (per Lakshmanjoo): jñānaṃ prakāśakaṃ loke ātmā caiva prakāśakaḥ | anayor apṛthagbhāvāj jñāne jñānī vibhāvyate; Wallis prints the GRETIL text but his translation follows this second reading.

## Prototype seeds

The prototype seed files `doors/049.json` and `doors/112.json` are **left unchanged** and `doors/index.json` still points at them.
The new research doors `doors/D-049/door.json` and `doors/D-112/door.json` record the seeds as `previous_file`, keep their lineage text and safety notes
(posture names redacted) in `honesty.legacy` / `safety.legacy_notes`, and note that the seeds used a different verse.

## Traceability

Generated by `/workspace/tmp/vbt/h27/build_houses.py` from `content_h7.py`, `maps.py` and `sanskrit.py`; validated by `validate_houses.mjs` (schema, numbering,
required fields, medical scan incl. treatment/therapy/healing, framing words, posture names) and by the engine's own `validateDoor` and safety gates.
Researcher slots R-097 … R-112; drafted 2026-10-06 by Grok Bot on branch `research/vbt-houses-2-7`.
