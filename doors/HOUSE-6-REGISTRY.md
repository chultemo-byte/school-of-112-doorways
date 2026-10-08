# House 6: Doors 081–096 (Vijñāna Bhairava Tantra dhāraṇās 81–96, verses 104–121)

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
| D-081 | 81 | 104 | 'I Am Everywhere' | *sarvatrāsmīti bhāvayan* | other / contemplation | practice | verified |
| D-082 | 82 | 105–106 | Knowing and Willing in Everything, and Attention to the Link | *ghaṭādau yac ca vijñānam* | other / contemplation | practice | verified |
| D-083 | 83 | 107 | The Same Awareness in Another's Body | *svavad anyaśarīre 'pi saṃvittim anubhāvayet* | other / contemplation | practice | verified |
| D-084 | 84 | 108 | A Supportless Mind That Builds No Thoughts | *nirādhāraṃ manaḥ kṛtvā vikalpān na vikalpayet* | other / contemplation | practice | verified |
| D-085 | 85 | 109 | I Share the Qualities of Śiva | *sa evāhaṃ śaivadharmā* | devotion / contemplation | practice | verified |
| D-086 | 86 | 110 | Waves from Water: The World Arising from Me | *jalasyevormayo vahner jvālābhaṅgyaḥ prabhā raveḥ* | visualization / visualization/space | practice | verified |
| D-087 | 87 | 111 | Whirling Until Falling (Classical) | *bhrāntvā bhrāntvā śarīreṇa* | sensation / sensation | historical/observe_only | verified |
| D-088 | 88 | 112 | When the Mind Gives Up: The Stillness After an Impasse | *ādhāreṣv athavā 'śaktyā 'jñānāc cittalayena vā* | emptiness/space / gap | practice | verified |
| D-089 | 89 | 113–114 | Unmoving Eyes; Ears and Lower Openings Closed (Classical) | *netrayoḥ stabdhamātrayoḥ … saṃkocaṃ karṇayoḥ kṛtvā hy adhodvāre* | sound / sound | historical/observe_only | verified |
| D-090 | 90 | 115 | Gazing into a Deep Well (Classical) | *kūpādike mahāgarte sthitvopari nirīkṣaṇāt* | sensation / sight | historical/observe_only | verified |
| D-091 | 91 | 116 | Wherever the Mind Goes | *yatra yatra mano yāti* | devotion / contemplation | practice | verified |
| D-092 | 92 | 117 | Consciousness Shining Through the Senses | *yatra yatrākṣamārgeṇa caitanyaṃ vyajyate vibhoḥ* | sensation / sensation | practice | verified |
| D-093 | 93 | 118 | Sneezes, Shocks and Sudden Moments | *kṣutādyante bhaye śoke* | everyday activity / ordinary life | practice | verified |
| D-094 | 94 | 119 | Seeing a Familiar Place, Letting Memories Go | *vastuṣu smaryamāṇeṣu dṛṣṭe deśe manas tyajet* | everyday activity / ordinary life | practice | verified |
| D-095 | 95 | 120 | Placing the Gaze, Then Withdrawing It | *kvacid vastuni vinyasya śanair dṛṣṭiṃ nivartayet* | sensation / sight | practice | verified |
| D-096 | 96 | 121 | The Understanding Born of Devotion | *bhaktyudrekād viraktasya yādṛśī jāyate matiḥ* | devotion / devotion | practice | verified |

## Observe-only doors

- **D-087** (verse 111): The classical method is whirling the body until falling to the ground; this risks dizziness, falls, head injury and fainting. Taught as text to understand, not as a class drill.
- **D-089** (verse 113–114): The classical method combines a sustained unblinking gaze with closing the ears and contracting the anal and genital openings (a lock, bandha) while meditating on the unstruck inner sound; these are commentary-dependent lineage techniques. Taught as text to understand, not as a class drill.
- **D-090** (verse 115): The classical method is standing at the edge of a deep well or chasm and gazing down into it; Singh's commentary describes the giddiness and fear it produces. Taught as text to understand, not as a class drill.

## Unverified or partial doors

None. Every door's dhāraṇā number and verse were read in Singh's headings and cross-checked.

## Source disagreements and numbering variants

- **D-082**: Grouping: Singh counts verse 106 as part of dhāraṇā 82 (no separate dhāraṇā); Wallis counts verse 106 as its own yukti (Y81, 'pay attention to the connection'). The Mystery Within's Session Two list also groups 105–106 as Dhāraṇā 82. / mystery_within_parallel: The parallel-translations section of The Mystery Within labels verse 105 'Dharana 82' (agrees) but verse 106 'Dharana 83'. Singh and the same book's Session Two count verse 106 as part of dhāraṇā 82, not a separate dhāraṇā. Not followed. / two_verses: Singh heads verses 105 and 106 as one dhāraṇā (82) and notes that 106 contains no separate dhāraṇā; Wallis counts them as two yuktis (Y80, Y81).
- **D-083**: mystery_within_parallel: The parallel-translations section of The Mystery Within labels verse 107 'Dharana 84', because from verse 106 on it gives every verse its own number (106 = 83 … 137 = 114). Singh and the same book's Session Two list put this at dhāraṇā 83. Not followed.
- **D-084**: mystery_within_parallel: The parallel-translations section of The Mystery Within labels verse 108 'Dharana 85', because from verse 106 on it gives every verse its own number (106 = 83 … 137 = 114). Singh and the same book's Session Two list put this at dhāraṇā 84. Not followed.
- **D-085**: mystery_within_parallel: The parallel-translations section of The Mystery Within labels verse 109 'Dharana 86', because from verse 106 on it gives every verse its own number (106 = 83 … 137 = 114). Singh and the same book's Session Two list put this at dhāraṇā 85. Not followed.
- **D-086**: mystery_within_parallel: The parallel-translations section of The Mystery Within labels verse 110 'Dharana 87', because from verse 106 on it gives every verse its own number (106 = 83 … 137 = 114). Singh and the same book's Session Two list put this at dhāraṇā 86. Not followed.
- **D-087**: Method: Singh, Dyczkowski and Bäumer read whirling round and round, then falling; Wallis adds an alternative, 'roaming on foot for hours and finally collapsing', and Dubois renders 'wandering for a long time'. The printed Sanskrit (bhrāntvā bhrāntvā) can mean either whirling or wandering. / mystery_within_parallel: The parallel-translations section of The Mystery Within labels verse 111 'Dharana 88', because from verse 106 on it gives every verse its own number (106 = 83 … 137 = 114). Singh and the same book's Session Two list put this at dhāraṇā 87. Not followed. / OCR note: Singh's heading is OCR'd as '[Dhāraṇā 81]' (a misread of 87): it sits between [Dhāraṇā 86] VERSE 110 and [Dhāraṇā 88] VERSE 112, and the verse is headed VERSE 111.
- **D-088**: Reading of ādhāreṣu: Singh takes it as objects of knowledge (inability to apprehend them); Wallis keeps 'loci (ādhāras)', and Dyczkowski reads the senses and their objects as the foundations of perception. The door follows the shared sense: incapacity, then stillness after agitation. / mystery_within_parallel: The parallel-translations section of The Mystery Within labels verse 112 'Dharana 89', because from verse 106 on it gives every verse its own number (106 = 83 … 137 = 114). Singh and the same book's Session Two list put this at dhāraṇā 88. Not followed.
- **D-089**: Grouping: Singh heads verses 113–114 together as one dhāraṇā (89), as does The Mystery Within's Session Two list; Wallis counts them as two yuktis (Y88, Y89). / The lower opening: Singh reads the openings of the anus and the genital; Wallis 'the lower gate'; Dyczkowski, Bäumer and Dubois the anus only. / mystery_within_parallel: The parallel-translations section of The Mystery Within labels verse 113 'Dharana 90', verse 114 'Dharana 91', because from verse 106 on it gives every verse its own number (106 = 83 … 137 = 114). Singh and the same book's Session Two list put this at dhāraṇā 89. Not followed. / two_verses: Singh heads verses 113 and 114 together as one dhāraṇā; Wallis counts them as two yuktis (Y88, Y89).
- **D-090**: Gaze: Singh adds 'without blinking' in brackets (from his commentary); Wallis, Dyczkowski and Bäumer simply have 'gazing into it'. / mystery_within_parallel: The parallel-translations section of The Mystery Within labels verse 115 'Dharana 92', because from verse 106 on it gives every verse its own number (106 = 83 … 137 = 114). Singh and the same book's Session Two list put this at dhāraṇā 90. Not followed. / OCR note: Singh's heading is OCR'd as '[Dhāraṇā 90] ,VERSE 115' (stray comma).
- **D-091**: mystery_within_parallel: The parallel-translations section of The Mystery Within labels verse 116 'Dharana 93', because from verse 106 on it gives every verse its own number (106 = 83 … 137 = 114). Singh and the same book's Session Two list put this at dhāraṇā 91. Not followed.
- **D-092**: mystery_within_parallel: The parallel-translations section of The Mystery Within labels verse 117 'Dharana 94', because from verse 106 on it gives every verse its own number (106 = 83 … 137 = 114). Singh and the same book's Session Two list put this at dhāraṇā 92. Not followed.
- **D-093**: gahvara: Singh reads 'deep sigh' (noting it can mean a cavern); Bäumer and Dyczkowski read a deep pit or abyss. / Wallis's and Dyczkowski's translations mention the onset or end of anger, which is not in the Sanskrit printed by GRETIL, Wallis, Singh or The Mystery Within (kṣutādyante, 'beginning and end of a sneeze'); Dyczkowski has anger in place of the sneeze. The concordance gives no reason. The door follows the printed Sanskrit. / Final word: The Mystery Within's parallel section reads brahmasattāsamīpagā ('close to the being of brahman'); GRETIL, Wallis, Singh, Pradīpaka and its Session Two list read brahmasattāmayī ('filled with the being of brahman'). / mystery_within_parallel: The parallel-translations section of The Mystery Within labels verse 118 'Dharana 95', because from verse 106 on it gives every verse its own number (106 = 83 … 137 = 114). Singh and the same book's Session Two list put this at dhāraṇā 93. Not followed.
- **D-094**: Singh reads the instruction as letting go of the remembered objects while fixing on the original experience behind the memory; Wallis specifies a place one has been before. Both agree on releasing memory and the supportless body. / mystery_within_parallel: The parallel-translations section of The Mystery Within labels verse 119 'Dharana 96', because from verse 106 on it gives every verse its own number (106 = 83 … 137 = 114). Singh and the same book's Session Two list put this at dhāraṇā 94. Not followed.
- **D-095**: Singh's commentary gives an unblinking open-eyed gaze (bhairavī mudrā) as one way to eliminate the object; this is not in the verse and is not taught here. / mystery_within_parallel: The parallel-translations section of The Mystery Within labels verse 120 'Dharana 97', because from verse 106 on it gives every verse its own number (106 = 83 … 137 = 114). Singh and the same book's Session Two list put this at dhāraṇā 95. Not followed.
- **D-096**: mystery_within_parallel: The parallel-translations section of The Mystery Within labels verse 121 'Dharana 98', because from verse 106 on it gives every verse its own number (106 = 83 … 137 = 114). Singh and the same book's Session Two list put this at dhāraṇā 96. Not followed.

Wallis numbers by yukti, not dhāraṇā: D-081 = verse 104: I am everywhere (Y79 ~ B1); D-082 = verse 105: Consciousness in everything (Y80 ~ B3); verse 106: Pay attention to the connection (Y81 ~ B3); D-083 = verse 107: Becoming all-pervasive (Y82 ~ B3); D-084 = verse 108: Don’t fabricate (Y83 ~ C3); D-085 = verse 109: I have Śiva’s qualities (Y84 ~ B3); D-086 = verse 110: The waves arise from me (Y85 ~ B2); D-087 = verse 111: Cessation of the energy of excitation (Y86 ~ C1); D-088 = verse 112: The power of incapacity (Y87 ~ C2); D-089 = verse 113: Eyes ‘paralyzed’ (Y88 ~ C1); verse 114: Blocking the ears and hearing the unstruck sound (Y89 ~ A2); D-090 = verse 115: Gazing into a well (Y90 ~ C1); D-091 = verse 116: Wherever the mind goes (Y91 ~ B1); D-092 = verse 117: Dissolution into awareness (Y92 ~ C2); D-093 = verse 118: The intensity of the moment  (Y93 ~ C1); D-094 = verse 119: Letting go of memories (Y94 ~ B3); D-095 = verse 120: Yogic withdrawal (Y95 ~ A3); D-096 = verse 121: Intense devotion (Y96 ~ A3).

## Sanskrit corrections and variants

- **D-081** verse 104: GRETIL, Singh and Pradīpaka read nijadehasthaṃ; Wallis prints nijadehasthāṃ. Meaning is the same ('what abides in one's own body').
- **D-082** verse 105: Sandhi corrected: GRETIL bhāvayan iti; Wallis bhāvayann iti.
- **D-082** verse 106: GRETIL encoding artefact '=B9' restored as avagraha: viśeṣo 'sti.
- **D-083** verse 107: GRETIL encoding artefact '=B9' restored as avagraha: anyaśarīre 'pi.
- **D-085** verse 109: GRETIL and Singh read śaivadharmā iti dārḍhyāc chivo bhavet; Pradīpaka applies sandhi (śaivadharmeti); Wallis and The Mystery Within read dārḍhyād bhavec chivaḥ. Meaning is the same.
- **D-090** verse 115: Sandhi corrected: GRETIL (and Pradīpaka) sadyas citta-; Wallis sadyaś citta-.
- **D-091** verse 116: GRETIL (and Pradīpaka) read śivāvāsthā; corrected to śivāvasthā with Wallis.
- **D-093** verse 118: Word division corrected: GRETIL runs kutūhalekṣudhādyante together; Wallis, Pradīpaka and The Mystery Within divide kutūhale kṣudhādyante. The Mystery Within's parallel section ends the verse brahmasattāsamīpagā ('close to the being of brahman', as in Bäumer's translation) instead of brahmasattāmayī ('consisting of the being of brahman'); its Session Two list reads brahmasattāmayī.
- **D-095** verse 120: GRETIL (and Pradīpaka) read śūnyālāyo; corrected to śūnyālayo with Wallis.
- **D-096** verse 121: GRETIL, Pradīpaka and (as far as the OCR shows) Singh read bhavayet; Wallis reads bhāvayet ('one should contemplate'). Kept as printed in GRETIL; the sense 'contemplate' follows the translators.

## Traceability

Generated by `/workspace/tmp/vbt/h27/build_houses.py` from `content_h6.py`, `maps.py` and `sanskrit.py`; validated by `validate_houses.mjs` (schema, numbering,
required fields, medical scan incl. treatment/therapy/healing, framing words, posture names) and by the engine's own `validateDoor` and safety gates.
Researcher slots R-081 … R-096; drafted 2026-10-06 by Grok Bot on branch `research/vbt-houses-2-7`.
