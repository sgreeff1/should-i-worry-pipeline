# Animation System Spec

Knowledge-base file 7 of 7. **Generated from the code by `spec.py`** on 27 Oct 2026 (library commit `aa889dd`, repo `sgreeff1/should-i-worry-pipeline`). Regenerate after any library change; `python3 spec.py check` fails if this file and the code disagree. Rules of use are in the Pipeline – Style Bible; this file is the inventory. New chats build from this inventory and never re-invent an item on it.

## How an episode uses the library

An episode is a JSON file (`episodes/<ep>.json`): `library` (the commit that rendered it), `shots` (one object per shot: `kind`, `t0`, `t1`, content), `cards`, `cites`, optional `meter` track. Render: `EP=episodes/<ep>.json PAGE=scene_ep.html python3 render.py video out.mp4 <seconds> 4`. Gates: `python3 checks.py episodes/<ep>.json out.mp4 timings.json`.

## Cast (Decision #45) — one rig, `outfit` picks the member

| Member | Top | Hair | Glasses | Scale |
| --- | --- | --- | --- | --- |
| `lead` | #2BB3A3 | — | no | 1 |
| `woman` | #8C7BD3 | bob | no | 1 |
| `older` | #9B4A5E | short | yes | 1 |
| `child` | #6FB7E8 | cap | no | 0.74 |
| `doctor` | #F2EBDD | — | yes | 1 |

`alt` is an alias of `woman` (crowd colour from v1). Props do not scale with the child yet.

## Poses (`library.js` POSES) — `seq: [[time, pose, transition s]]`

`stand`, `lookDown`, `bend`, `locked`, `point`, `shrug`, `think`, `phone`, `wave`, `handsOnHips`, `sit`, `lie`, `walk`, `backPain`

## Expressions (`rig.js` drawHead) — `face: [[time, name]]`

`calm`, `focus`, `happy`, `ouch`, `peek`, `relief`, `surprise`, `talking`, `thinking`, `tired`, `worried`

## Organs (Decisions #41–42, #47) — rose, faces, state colour drives halo/mood

`bladder`, `bone`, `brain`, `disc`, `heart`, `knee`, `nerve`, `vertebra`

Call with no colour for the normal state, `P.red` (`'#EB5757'`) for the red-flag state. Bones are ivory, nerves yellow, organs rose; no ducts or tubes on organ icons.

## Icons (`icons.js` ICON) — `drawIcon(ctx,name,x,y,size,t,color)`; plus the organs above

`toast`, `flame`, `alarm`, `bladder`, `bowel`, `legs`, `scanner`, `clock`, `calendar`, `siren`, `hospital`, `thermometer`, `flag`, `magnifier`, `question`, `check`, `sun`, `moon`, `pill`, `hand`, `document`, `earMute`, `arrowUp`, `arrowDown`, `triangle`, `person`

## Environments (`env/*.js`, Decision #48) — `env:` on CHAR shots

`home`, `bedroom`, `clinic`, `hospital`, `street`, `workplace`, `void`

## Shot templates (`templates.js`) — `kind:` on every shot; cap: ten kinds

`CHAR`, `FIGURE`, `COUNT`, `CHART`, `ICONS`, `ANATOMY`, `BANNER`, `CHAPTER`, `GLOBE`, `END`

CHAPTER also carries the opening idents: `ident:'dial'` (option 1) or `ident:'char'` (option 2). END without a `title` shows the wordmark and the worry meter.

## Signature devices (Decision #46)

- **Worry meter** (`meter.js`): `drawMeter(ctx,t,{x,y,size,value,style})`, styles `gauge` and `bar`; three zones with colour + icon (teal/check, amber/toast, red/flame). Episode track: `meter:[{t0,t1,from,to,hold,size,x,y,style}]`; sizes under 320 px carry no label (corner overlay).
- **Opening ident**: 2.0–2.6 s CHAPTER shot; sound mark `audio/soundmark_a.wav` (rising) or `_b.wav` (rise-then-settle), synthesised by `soundmark.py`.
- **Wordmark**: `wordmark(ctx,x,y,size)` — "Should I Worry" in ivory, "?" in amber.

## Palette (`style.js` P)

| Name | Hex |
| --- | --- |
| `navy` | #1F2A44 |
| `navyD` | #121A2E |
| `navyL` | #2B3B62 |
| `teal` | #2BB3A3 |
| `tealD` | #23958A |
| `amber` | #F2994A |
| `red` | #EB5757 |
| `redD` | #C94545 |
| `ivory` | #EDE6D6 |
| `ivoryD` | #CFC6B2 |
| `yellow` | #F2C94C |
| `white` | #FFFFFF |
| `disc` | #8FA9C4 |
| `skin` | #F0C7A0 |
| `skinD` | #D9AD86 |
| `organ` | #E8949F |
| `organD` | #C46A77 |
| `organL` | #F7C6CC |
| `pants` | #2B3B62 |
| `pantsD` | #22304F |
| `shoe` | #EDE6D6 |
| `floorNear` | #D9C9A8 |
| `floorFar` | #B9A585 |
| `plank` | #A89474 |
| `wallTop` | #1C2642 |
| `wallBot` | #131B31 |

## Layout rules enforced in code

- Cards: top band (15 % height) on CHAR and FIGURE shots, 80 % elsewhere (`cardLow:true` overrides); ≤ 7 words.
- Citations: bottom-left pill, 600/36 px. Disclaimer: bottom-right, first 10 s. Tag: top-left.
- `checks.py` fails an episode without a `library` stamp, with an unknown cast member, or with a meter value outside 0–1, besides the Quality-Criteria gates (4.2, 4.4, 4.5, 4.6, 6.4, format).
