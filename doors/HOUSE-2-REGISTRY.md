# House 2: Doors 017–032 (Vijñāna Bhairava Tantra dhāraṇās 17–32, verses 40–55)

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
| D-017 | 17 | 40 | The Silence Before and After a Sound | *yasya kasyāpi varṇasya pūrvāntāv* | sound / sound | practice | verified |
| D-018 | 18 | 41 | Following a Long Musical Note to Its End | *tantryādivādyaśabdeṣu dīrgheṣu* | sound / sound | practice | verified |
| D-019 | 19 | 42 | Sounding a Seed-Mantra into Silence | *śūnyoccārād bhavec chivaḥ* | sound / sound | practice | verified |
| D-020 | 20 | 43 | Space in Every Direction at Once, Within the Body | *nijadehe sarvadikkaṃ yugapad bhāvayed viyat* | emptiness/space / visualization/space | practice | verified |
| D-021 | 21 | 44 | The Void Above and the Void at the Base | *pṛṣṭhaśūnyaṃ mūlaśūnyaṃ yugapad* | emptiness/space / visualization/space | practice | verified |
| D-022 | 22 | 45 | Three Voids at Once: Above, Base and Heart | *hṛcchūnyam bhāvayet sthiram* | emptiness/space / visualization/space | practice | verified |
| D-023 | 23 | 46 | A Moment of Void in the Body | *tanūdeśe śūnyataiva kṣaṇamātraṃ* | emptiness/space / visualization/space | practice | verified |
| D-024 | 24 | 47 | The Body's Tissues Pervaded by Space | *sarvaṃ dehagataṃ dravyaṃ viyadvyāptaṃ* | emptiness/space / visualization/space | practice | verified |
| D-025 | 25 | 48 | The Skin as a Wall with Nothing Inside | *tvagvibhāgam bhittibhūtaṃ vicintayet* | sensation / visualization/space | practice | verified |
| D-026 | 26 | 49 | Senses Dissolved in the Space of the Heart | *hṛdyākāśe nilīnākṣaḥ* | concentration / visualization/space | practice | verified |
| D-027 | 27 | 50 | Mind Dissolved at the Dvādaśānta | *dvādaśānte manolayāt* | concentration / visualization/space | practice | verified |
| D-028 | 28 | 51 | Returning to the Dvādaśānta Wherever You Are | *yathā tathā yatra tatra dvādaśānte manaḥ kṣipet* | everyday activity / ordinary life | practice | verified |
| D-029 | 29 | 52 | The Fire of Time Rising Through One's Own Body | *kālāgninā kālapadād utthitena* | visualization / visualization/space | historical/observe_only | verified |
| D-030 | 30 | 53 | The Whole World Burnt by the Fire of Time | *evam eva jagat sarvaṃ dagdhaṃ* | visualization / visualization/space | historical/observe_only | verified |
| D-031 | 31 | 54 | Principles Dissolving into Their Sources | *tattvāni yāni nilayaṃ dhyātvā* | visualization / visualization/space | practice | verified |
| D-032 | 32 | 55 | Thick Breath, Thin Breath, Entering the Heart | *pīnāṃ ca durbalāṃ śaktiṃ* | breath / breath | practice | verified |

## Observe-only doors

- **D-029** (verse 52): The classical method is a sustained visualisation of one's own body being burnt by fire, with a destruction formula. Intense imagery of one's own body burning can be distressing and is not used as a class drill. Taught as text to understand, not as a class drill.
- **D-030** (verse 53): The classical method is a visualisation of the whole world being burnt. Imagery of the world's destruction can be distressing and is not used as a class drill. Taught as text to understand, not as a class drill.

## Unverified or partial doors

None. Every door's dhāraṇā number and verse were read in Singh's headings and cross-checked.

## Source disagreements and numbering variants

- **D-021**: pṛṣṭha: GRETIL's pṛṣṭa ('asked') is an input error; Singh, Wallis and Bäumer read pṛṣṭha and take it as 'above'. The word can also mean 'back'.
- **D-023**: tanūdeśa: Singh reads 'the body (as the limited self)'; Wallis and Bäumer read 'any part or point of the body'. This door follows Wallis and Bäumer and records Singh.
- **D-027**: Which dvādaśānta: Singh is unsure (probably the brahmarandhra); Ānandabhaṭṭa allows the cosmic void or the central channel; Bäumer reads the line differently ('the body is void in all parts').
- **D-032**: Last quarter: GRETIL, Singh and Pradīpaka read muktaḥ svātantryam ('freed, gains sovereignty'); Abhinavagupta reads suptaḥ svācchandyam and Kṣemarāja svapnasvātantryam ('freedom in dream'); Wallis prints both. / Which place is 'thick' and which 'thin': Singh reads gross breath made subtle, meditated in the dvādaśānta or the heart; Wallis reads thick in the heart and thin at the dvādaśānta; Lakshmanjoo (via Singh) reads 'audible' and 'slow'.

Wallis numbers by yukti, not dhāraṇā: D-017 = verse 40: Syllables emerging from and merging back into silence (Y14 ~ C2); D-018 = verse 41: Sound of the tambura (Y15 ~ C1); D-019 = verse 42: Mantra-mass (Y16 ~ A3); D-020 = verse 43: Inner space (Y17 ~ C2); D-021 = verse 44: Space above and below (Y18 ~ A2); D-022 = verse 45: Three inner voids (Y19 ~ A3); D-023 = verse 46: Space in any body part (Y20 ~ C1); D-024 = verse 47: Space pervading the tissues (Y21 ~ C1); D-025 = verse 48: Wall of skin (Y22 ~ C1); D-026 = verse 49: Lotus in the heart (Y23 ~ A1); D-027 = verse 50: Mindfulness of the dvādaśānta (Y24 ~ A2); D-028 = verse 51: Mindfulness of the dvādaśānta, cont’d; D-029 = verse 52: Burning the body-image (Y25 ~ A2); D-030 = verse 53: Burning the universe (Y26 ~ A2); D-031 = verse 54: Purifying the elements (Y27 ~ A2); D-032 = verse 55: Freedom in the dream state (Y28 ~ A3).

## Sanskrit corrections and variants

- **D-019** verse 42: GRETIL input error 'pi.ṅda-' corrected to piṇḍa- (Singh, Wallis and Pradīpaka read piṇḍamantrasya).
- **D-021** verse 44: GRETIL reads pṛṣṭa- ('asked'); corrected to pṛṣṭha- ('back / top') with Wallis, Pradīpaka and Singh. Singh takes pṛṣṭhaśūnya as 'the void above'; Wallis titles the verse 'space above and below'.
- **D-022** verse 45: GRETIL reads pṛṣṭa-; corrected to pṛṣṭha- with Wallis, Pradīpaka and Singh (legible as 'Pr~thasiinyam' in the scan).
- **D-028** verse 51: Punctuation only: GRETIL prints a double daṇḍa at the half-verse.
- **D-032** verse 55: GRETIL reads pināṃ; corrected to pīnāṃ ('thick') with Wallis and Pradīpaka. Last quarter: GRETIL, Singh and Pradīpaka read muktaḥ svātantryam āpnuyāt. Singh's notes record that Abhinavagupta (Tantrāloka 15.480–81) reads suptaḥ svācchandyam āpnuyāt and Kṣemarāja (Spandanirṇaya) reads svapnasvātantryam āpnuyāt; Wallis prints 'svapna- (or muktaḥ)'.

## Other honesty flags

- **D-019**: School simplification: Oṃ is used as the piṇḍa-mantra. The navātma mantra and the detailed twelve-station mapping of the subtle phases are recorded only as commentary.
- **D-031**: School simplification: the five elements plus awareness stand in for the full classical series of thirty-six principles (tattvas) described in Singh's notes.

## Traceability

Generated by `/workspace/tmp/vbt/h27/build_houses.py` from `content_h2.py`, `maps.py` and `sanskrit.py`; validated by `validate_houses.mjs` (schema, numbering,
required fields, medical scan incl. treatment/therapy/healing, framing words, posture names) and by the engine's own `validateDoor` and safety gates.
Researcher slots R-017 … R-032; drafted 2026-10-06 by Grok Bot on branch `research/vbt-houses-2-7`.
