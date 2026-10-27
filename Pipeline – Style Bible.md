# Pipeline — Style Bible (v2)

25 Oct 2026, v2 on 27 Oct 2026 (library v2: cast, signature devices, organs, environments, layout; Decisions #41–50). The channel's visual rules, as enforced by `style.js` and the library. **Status: Proposed** until Sebastian signs off library v2 (checkpoint E). Change the look by changing `style.js`; every scene reads from it. The inventory of what exists is knowledge file 7, *Animation System Spec*, generated from the code.

## Palette (`P` in style.js)

| Role | Name | Hex |
| --- | --- | --- |
| Background | navy / navyD / navyL | #1F2A44 / #121A2E / #2B3B62 |
| Normal, calm, brand | teal / tealD | #2BB3A3 / #23958A |
| "Burnt toast" (sore but harmless) | amber | #F2994A |
| "Fire" (serious) | red / redD | #EB5757 / #C94545 |
| Text, bone, light | ivory / ivoryD | #EDE6D6 / #CFC6B2 |
| Nerves | yellow | #F2C94C |
| Disc, joint space | disc (blue-grey) | #8FA9C4 |
| Skin | skin / skinD | #F0C7A0 / #D9AD86 |
| Organs | organ / organD / organL | #E8949F / #C46A77 / #F7C6CC |
| Trousers (lead) | pants / pantsD | #2B3B62 / #22304F |
| Outline | OUT | #141A2E |

Colour is never the only cue: urgency tiers, the worry meter and organ states always carry an icon or a face as well as a colour.

## The cast (Decision #45)
- One rig (`rig.js`), five members chosen by `outfit`: **lead** (bald, teal jumper — the default "you"), **woman** (bob, lavender), **older** (grey hair, glasses, burgundy), **child** (0.74 scale, bigger head, tuft, sky blue), **doctor** (white coat, glasses, stethoscope). `alt` = the woman's colours, for crowds.
- Variant B drawing for all: eyes with whites and tracking pupils, 6 px silhouette outline, soft shading, cheek. Two-pass drawing so the outline only traces the outside edge. Hair carries its own outline.
- Topics pick the member; no per-episode sliders. Props (chairs, beds) do not scale with the child yet — place the child where the prop fits.
- Poses live in `library.js` (`POSES`); expressions in `rig.js` (`drawHead`). New acting = a sequence of named poses + a face list, never new drawing.

## Signature devices (Decision #46)
- **Worry meter** (`meter.js`): three zones, each colour + icon — teal/check "fine", amber/toast "burnt toast", red/flame "fire". Styles: `gauge` (half dial, needle) or `bar` (slider). Appears in the hook, moves as evidence lands, settles at the answer. As a corner overlay it carries no label; as the hero it reads "Should I worry?".
- **Opening ident**: 2.0–2.6 s, before the hook. Option 1 "the dial" (gauge draws on, needle sweeps fine → fire → settles on burnt toast, wordmark lands) or option 2 "the character" (the lead walks in, stops, "?" pops, wordmark lands). Sound mark synthesised in code (`soundmark.py`): three soft rising notes and a low settle; variant A rising, variant B rise-then-settle. No stock audio.
- **Wordmark**: "Should I Worry" in ivory, "?" in amber, Inter 800. The end card shows the wordmark, the two standing lines, the meter at its settled value, and the subscribe line.

## Organs (Decisions #41–42, #47)
- Every organ icon is drawn in the organ colour with the house outline, a gloss and soft shading; bones are ivory, nerves yellow, the disc blue-grey with an ivory centre.
- **Organs get faces, channel-wide**: house eyes, a calm smile with cheeks normally; a worried face (frown, raised brows, sweat drop) in a red-flag state.
- The icon's colour argument is a *state*, not a paint: omitted = normal; `P.red` = red-flag → pulsing red halo, worried face, and for hollow organs a brim-full fluid line. The organ's own colour never changes.
- **No ducts or tubes** on organ icons (ureters, vessels, bronchi) unless the duct is the point of the shot: beside a face, side tubes read as arms. The heart keeps its two short vessel stubs on top; that is the one exception, and they sit above the face.
- Set so far: bladder, vertebra (from above, with the canal), disc, nerve (cord with root pairs), brain, heart, knee, long bone. Shared helpers in `icons.js` (`organHalo`, `organShade`, `organOutline`, `organFluid`, `organFace`); a new organ is one body path plus these.

## Line and finish
- Silhouette outline 6 px, interior lines lighter (face features 4–5.5 px). No outlines on environments.
- Soft-light warm wash from the lamp side, blacks lifted 7 %, animated grain at 6 %, radial vignette.
- Contact shadows under furniture and the character are blurred (8–10 px).
- Motion blur: 4 sub-frames over a 180° shutter, on every render.

## Type and layout (Decision #49)
- Inter everywhere. Cards 800/64 px on a navy pill at 78 % opacity, ≤ 7 words. **Safe band:** on CHAR and FIGURE shots the card sits in the top band (8 % height, pill clear of a raised hand by 20 px) so it never crosses a standing figure; on every other template at 80 % height. `cardLow:true` on a shot overrides.
- Citations 600/36 px bottom-left on a 92 % navy pill (raised contrast, QA 26 Oct 2026). Tag 700/22 px top-left. Disclaimer 500/30 px bottom-right, first 10 s only.
- Chapter cards: amber kicker 500/44 px, ivory title 800/92 px, teal rule; one style for every chapter.
- Corner meter default position: bottom-right (86 % width, 82 % height), 300 px; it never shares a baseline with a banner's icon row and stays clear of the citation pill (bottom-left).

## Motion rules (`MOTION`)
- 25 fps, 1920×1080. Crossfade 0.35 s between template shots; **hard cuts** inside character scenes and into FIGURE shots that follow a crowd (`cut:true`).
- Every template shot gets a slow push-in of 4 %. Camera shake only on physical jolts.
- Easing: `io` for body moves, `swing` for arms and the meter needle, `snap` for reflexes, `ob` for pop-ins.
- Reflex order on pain: jolt and face first, hand a beat later.
- A visual change at least every 8 s (gate 4.6); the checker enforces it, counting internal cuts.

## Sound (verified)
- **No transition whooshes.** Card pops only, at −12 dB from the Test A level.
- Music bed −16 dB under the narration, sidechain-ducked from the voice, 2 s in, 2.5 s out. Programme −14 LUFS, −1.5 dBTP. The sound mark sits under the ident only.

## Environments (`env/`, Decision #48)
home (living room, night) · bedroom · clinic · **hospital / emergency bay** · **street at dusk** · **workplace desk** · void (data and icons) · body (anatomy stage). All two-layer parallax, all read `P`, no outlines.

## Maps (Decision #43)
- The GLOBE template draws the real Earth: Natural Earth 1:110m coastlines (public domain, `world.js`) on an orthographic projection (d3-geo, ISC, `vendor/`), turning eastward at 11°/s, with markers on real population centres that fade before the limb. No stock or AI maps.

## What stays outside the system
- Anatomy is **Servier only**, restyled by `restyle.py`, credited on screen (gate 4.2). No AI anatomy, no AI anything.
- Numbers on screen come from the Claim–Source table and carry a citation (gate 4.4). The checker refuses a numeric card without one.

## Versioning (Decision #50)
- The library lives in `sgreeff1/should-i-worry-pipeline`; every change is committed in the session that makes it; `05 Brand/Pipeline/code` mirrors it. Every episode JSON carries `library` (the commit); `checks.py` refuses one without it. `python3 spec.py check "07 Animation System Spec.md"` must print SPEC OK before hand-over.
