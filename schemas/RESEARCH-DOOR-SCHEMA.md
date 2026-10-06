# Research door schema (`schemas/research-door.schema.json`)

House 1 door format. The engine validates it in `engine/doors.ts` (Ajv 2020-12, `strict: false`).
`schemas/door.schema.json` is the separate prototype schema for doors 049 and 112. This change does not touch it.

**Current version: 2.0.0** (2026-10-06)

## 2.0.0 (2026-10-06): VBT-dharana framing for House 1

A major version bump because it changes what a door *is*. In 1.0.0 a door was a standing posture paired with a VBT
method by school index. In 2.0.0, door N is VBT dhāraṇā N (Jaideva Singh numbering, dhāraṇā 1 = verse 24),
and any posture is an optional school device.

Backward compatible at the validation level: every 1.0.0 required field is still required, and a door without
`schema_version` still validates as 1.0.0.

### New top-level fields

| Field | Type | Notes |
|-------|------|-------|
| `schema_version` | `"2.0.0"` | Absent = 1.0.0 |
| `framing` | `"vbt_dharana"` | |
| `practice_mode` | `"practice"` \| `"historical/observe_only"` | Sexual, extreme, breath-retention-heavy or otherwise risky techniques must be `historical/observe_only` |
| `previous_label` | string | Retired 1.0.0 label, e.g. `"Tadasana — Mountain (asana framing, retired 2026-10)"`. The only field that may carry a posture name |
| `previous_file` | string | Path and commit of the retired file |
| `previous_vbt_ref` | string | The old `adiyogi.vbt_ref`, marked `(superseded)` if the verse changed |
| `dharana` | object | See below |
| `seat` | object | `{ school_device: true, label, summary, honesty }`: the optional position, flagged as a school addition |
| `reframed_by`, `reframed_at` | string | |
| `review` | object | `{ status, previous_review }` |

### `dharana` object

Required: `number`, `verses[]`, `numbering_edition`, `sanskrit_iast`, `sanskrit_status`, `rendering`,
`rendering_kind` (`paraphrase` \| `quote`), `technique_name`, `category`, and
`verification { status: verified|partial|unverified, checked_against[], notes }`.
Optional: `sanskrit_source`, `sanskrit_variants[]`, `rendering_attribution`, `commentary_note`,
`category_secondary[]`, `numbering_variants{}` (for example the Wallis yukti number, or hatha.es numbering not followed).

`category` enum: `breath`, `visualization`, `sensation`, `concentration`, `sound`, `emptiness/space`,
`devotion`, `everyday activity`, `other`.

### Changed meaning of existing fields

- `name`: the technique name. `sanskrit`: a short IAST phrase from the verse, not a posture name.
- `geometry.kind` (new, optional): `body_shape` (1.0.0 default) or `attention_map`. In 2.0.0 the geometry is the dharana's
  own spatial map of attention. New optional `geometry.points[]` and `geometry.honesty`.
- `breath.mode` (new, optional): `natural` \| `sounded_exhale` \| `paced`. In 2.0.0 the counts are an optional school
  pacing aid, and `breath.hold` must be `0`.
- `honesty.flags[]` (new, append-only) and `honesty.legacy` (the 1.0.0 disclosure and notes, kept).
  `honesty.pairing_type` stays `school_device`, because the engine gate `gateNoDoorwayOwned` requires it.
- `safety.legacy_notes` (the 1.0.0 posture-specific notes, kept) and `safety.observe_only_note`.
- `status`: reframed doors are `draft` until the guardians re-review them.

### Conditional rules

- If `schema_version` is `2.0.0`, then `framing`, `practice_mode`, `previous_label`, `previous_file`, `dharana` and `seat` are
  required, and `breath.hold` must be `0`.
- If `practice_mode` is `historical/observe_only`, then `adiyogi.practice_mode` must be `observe_only` or `historical`
  (this keeps the engine's `vbtMode` gate working), and `safety.observe_only_note` is required.

## 1.0.0 (2026-09-25)

The original House 1 format: id, name, sanskrit (posture), house, status, the six instruments (geometry, reaction, breath,
orientation, attention, adiyogi), honesty, safety, sources, eight beats, and researcher.
