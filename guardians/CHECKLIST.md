# Guardian Checklist — Door → `status: researched`

Use this checklist on every door draft from bots `R-001` … `R-112`.  
**Pass = all boxes checked.** Any fail keeps `status: draft` (or `stub`) until fixed.

Door under review: `D-___` Researcher: `R-___` Guardian: `________` Date: `________`

---

## A. Schema & completeness

- [ ] JSON parses and matches `schemas/door.schema.json`
- [ ] `id` matches assigned door (`D-NNN`)
- [ ] `house` correct for door number
- [ ] All six instruments present and non-empty: geometry, reaction, breath, orientation, attention, adiyogi
- [ ] Exactly **8** beats with locked titles (Name → Geometry → Orientation → Breath → Attention → Reaction → Adiyogi → Exit)
- [ ] `researcher` and `researched_at` set

## B. Honesty & pairing

- [ ] `honesty.pairing_type` is one of: `school_device` | `inner_logic` | `axis_pairing`
- [ ] Default serial pairing uses `school_device` unless a stronger claim is **justified** in `honesty.notes`
- [ ] `honesty.disclosure` is plain language suitable for student UI (states school device when applicable)
- [ ] No claim that asana↔VBT pairing is ancient canon unless sources explicitly support it

## C. Adiyogi / VBT

- [ ] `adiyogi.vbt_ref` points at the assigned lane/verse index
- [ ] `verse_paraphrase` is paraphrase, not a long copyrighted dump
- [ ] Extreme or dangerous methods → `practice_mode` is `historical` or `observe_only`
- [ ] Sexual VBT content → `sexual_content: true` and **not** written as a class drill
- [ ] Beat 7 (Adiyogi thread) is the **safe** form only

## D. Safety

- [ ] Pain rule present: pain = information; pause / regress / exit
- [ ] `never_force: true` for lotus and closed hip/knee binds
- [ ] `open_seat_alternate` set when geometry is a bind
- [ ] No instruction to push through sharp pain
- [ ] Contraindication notes are cautionary, not diagnostic

## E. Medical & science honesty

- [ ] No diagnose / cure / treat / heal / therapy / disease claims
- [ ] `reaction` is clearly metaphorical (school phase label), not biochemistry or medicine
- [ ] Breath counts are practice cues, not clinical prescriptions

## F. Sources

- [ ] At least one VBT-related source cited
- [ ] Asana / commentary sources cited where used
- [ ] URLs/refs are real or honestly marked as edition names without fake links

## G. Teaching quality

- [ ] Geometry is teachable (polygon + joints make sense)
- [ ] Orientation and attention are single clear cues (not a laundry list)
- [ ] Breath signature is executable in a class
- [ ] Tone matches school: concrete, non-poetic, non-hype
- [ ] English beat scripts readable aloud in ≤20 seconds each

## H. Sign-off

- [ ] Failures listed below with required fixes
- [ ] If all pass → set `status` to `researched` and record guardian initials

### Failures / required fixes

```
(none | list)
```

### Guardian decision

- [ ] **PASS** → `researched`
- [ ] **FAIL** → remain `draft` (return to R-NNN)

Signature: _______________
