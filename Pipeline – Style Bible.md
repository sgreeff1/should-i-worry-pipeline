# Pipeline — Style Bible

25 Oct 2026, updated 26 Oct 2026 (organ colour and faces, Decisions #41–42; real globe, #43). The channel's visual rules, as enforced by `style.js`. **Status: Proposed** (built from the decisions verified: D3 route, character variant B, no whooshes, pops −12 dB; organs with faces). Change the look by changing `style.js`; every scene reads from it.

## Palette (`P` in style.js)

| Role | Name | Hex |
| --- | --- | --- |
| Background | navy / navyD / navyL | #1F2A44 / #121A2E / #2B3B62 |
| Normal, calm, brand | teal / tealD | #2BB3A3 / #23958A |
| "Burnt toast" (sore but harmless) | amber | #F2994A |
| "Fire" (serious) | red / redD | #EB5757 / #C94545 |
| Text, bone, light | ivory / ivoryD | #EDE6D6 / #CFC6B2 |
| Nerves | yellow | #F2C94C |
| Disc | disc (blue-grey) | #8FA9C4 |
| Skin | skin / skinD | #F0C7A0 / #D9AD86 |
| Organs (bladder, later heart, lungs, kidneys…) | organ / organD / organL | #E8949F / #C46A77 / #F7C6CC |
| Trousers | pants / pantsD | #2B3B62 / #22304F |
| Outline | OUT | #141A2E |

Colour is never the only cue: urgency tiers always carry an icon and a word (GO NOW / SAME DAY / SOON).

## The character
- One rig (`rig.js`): big round head (r = 108), chunky body, short legs, big ivory shoes. **Variant B**: eyes with whites and tracking pupils, thin silhouette outline (6 px), soft shading, cheek.
- Drawn in **two passes** — one dark silhouette under everything, then fills in depth order — so the outline only traces the outside edge. Limbs crossing the body get a soft contact shadow, never a hard line.
- Outfits: `default` (teal), `doctor` (white coat, glasses, stethoscope), `alt` (lavender, for crowds). New outfits are a colour table.
- Lit on its own layer: warm from the lamp side, cool from the window side.
- Poses live in `library.js` (`POSES`); expressions in `rig.js` (`drawHead`). New acting = a sequence of named poses + a face list, never new drawing.

## Organs (Decisions #41–42, 26 Oct 2026)
- Every organ icon is drawn in the organ colour (rose), with the house outline, a gloss and soft shading, so it reads as an organ and never as "a red thing".
- **Organs get faces, channel-wide**: house eyes (whites, pupil, shine), a calm smile with cheeks normally; a worried face (frown, raised brows, sweat drop) in a red-flag state.
- The icon's colour argument is a *state*, not a paint: omitted = normal; `P.red` = red-flag → pulsing red halo behind the organ, worried face, and for hollow organs a brim-full fluid level. The organ's own colour never changes. Together with the warning triangle this keeps the rule that colour is never the only cue.
- Shared helpers in `icons.js` (`organHalo`, `organShade`, `organOutline`, `organFluid`, `organFace`) — a new organ is one body path plus these.
- Organ icons carry **no ducts or tubes** (ureters, vessels, bronchi) unless the duct is the point of the shot: beside a face, a pair of side tubes reads as arms (QA, 26 Oct 2026). Hollow organs show a fluid line with a bright meniscus; the face stays ≤ 60 % of the body's width.

## Line and finish
- Silhouette outline 6 px, interior lines lighter (face features 4–5.5 px). No outlines on environments.
- Soft-light warm wash from the lamp side, blacks lifted 7 %, animated grain at 6 %, radial vignette.
- Contact shadows under furniture and the character are blurred (8–10 px).
- Motion blur: 4 sub-frames over a 180° shutter, on every render.

## Type
- Inter. Cards 800/64 px, centred at 80 % height on a navy pill at 78 % opacity. ≤ 7 words. Citations 500/26 px bottom-left on a pill. Tag 700/22 px top-left. Disclaimer 500/24 px bottom-right, first 10 s only.

## Motion rules (`MOTION`)
- 25 fps, 1920×1080. Crossfade 0.35 s between template shots; **hard cuts** inside character scenes.
- Every template shot gets a slow push-in of 4 %. Camera shake only on physical jolts.
- Easing: `io` for body moves, `swing` for arms (smooth to 106 % then settle), `snap` for reflexes, `ob` for pop-ins.
- Reflex order on pain: jolt and face first, hand a beat later.
- A visual change at least every 8 s (gate 4.6); the checker enforces it, counting internal cuts.

## Sound (verified)
- **No transition whooshes.** Card pops only, at −12 dB from the Test A level.
- Music bed −16 dB under the narration, sidechain-ducked from the voice, 2 s in, 2.5 s out. Programme −14 LUFS, −1.5 dBTP.

## Environments (`env/`)
home (living room, night) · bedroom · clinic · void (data and icons) · body (anatomy stage). All two-layer parallax, all read `P`.

## Maps (Decision #43)
- The GLOBE template draws the real Earth: Natural Earth 1:110m coastlines (public domain, `world.js`) on an orthographic projection (d3-geo, ISC, `vendor/`), turning eastward at 11°/s, with markers on real population centres that hide on the far side. No stock or AI maps.

## What stays outside the system
- Anatomy is **Servier only**, restyled by `restyle.py`, credited on screen (gate 4.2). No AI anatomy, no AI anything.
- Numbers on screen come from the Claim–Source table and carry a citation (gate 4.4). The checker refuses a numeric card without one.
