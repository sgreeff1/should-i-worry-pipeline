# Pipeline — How It Works

25 Oct 2026, updated 26 Oct 2026 (code v1.1). Folder: `05 Brand/Pipeline/` (mirrored from the build environment). **Status: Proposed.**

## One episode, end to end

1. **Script v3 → voice-over.** Julian (ElevenLabs, verified). Save the MP3 into `02 Scripts/` or the Render test folder.
2. **Voice-over → `timings.json`.** `ffmpeg silencedetect` finds the sentence starts; every shot boundary sits on one (the checker warns if not).
3. **Visual Brief → `episodes/<ep>.json`.** Each row of the brief becomes one shot: `{kind, t0, t1, …content}`. The ten kinds are in *Pipeline – Shot Templates*. Cards and citations are two lists with start/end times.
4. **Render.** `EP=episodes/E01.json PAGE=scene_ep.html python3 render.py video out.mp4 <duration> 4` — Playwright drives `scene_ep.html` frame by frame with 4-sub-frame motion blur into ffmpeg (H.264, CRF 18). About 2× real time.
5. **Audio.** Voice + card pops (−12 dB) + music bed (ducked), two-pass loudnorm to −14 LUFS, mux with `-c:v copy`.
6. **Checks.** `python3 checks.py episodes/<ep>.json out.mp4 timings.json` — gates 4.2, 4.4, 4.5, 4.6, 6.4 and format. Must print PASS.
7. **Independent review** by a fresh agent (visual QA against the brief), then Sebastian's gate 6.2 anatomy check and sign-off.

## The files

| File | What it is |
| --- | --- |
| `style.js` | palette, outline, fonts, motion rules — the single source of truth |
| `core.js` | maths, keyframe engine (`ch`, `step`), 2-bone IK, drawing primitives, grain tile |
| `rig.js` | the character: skeleton, pose solver, arm targets, two-pass drawing, expressions, outfits |
| `library.js` | `POSES` (14 named poses), `poseAnim()` (sequence → animation), `staticPose()`, walk cycle |
| `icons.js` | 26 house icons, each in a 100 px box: `drawIcon(ctx,name,x,y,size,t,color)`; organ helpers (faces, halo, fluid level) — for organs `color` is a state, not a paint |
| `globe.js` + `world.js` | the real Earth for GLOBE shots: orthographic projection, Natural Earth 1:110m land (public domain), city markers |
| `vendor/` | d3-geo and d3-array (ISC) — the only third-party code in the renderer |
| `data/` + `build_world.py` | the source TopoJSON and the script that regenerates `world.js` from it |
| `env/*.js` | home, bedroom, clinic, void, body — each `draw<Env>(ctx,t,pose,cam)` |
| `camera.js` | shot-list camera: cuts, eased moves, tracking, shake; `layer()` for parallax |
| `finish.js` | character lighting, grade, grain, vignette, disclaimer, tag |
| `anims/hook.js` | the E01 hook performance (keyframes + its six camera shots) |
| `templates.js` | the ten shot kinds: CHAR, FIGURE, COUNT, CHART, ICONS, ANATOMY, BANNER, CHAPTER, GLOBE, END |
| `episode.js` | the composer: finds the shot, draws it, crossfades, cards, citations, finish |
| `scene_ep.html` | the page the renderer drives; loads an episode JSON |
| `render.py` | stills and video; `checks.py` the gates; `sheets.py` the library sheets |
| `episodes/E01_segment.json` | shots 1–13 of E01 (0:00–1:03) — the proof segment |
| `assets/` | restyled Servier PNGs (`A_*.png`) and the disc mask |

## Adding things

- **A new shot** → one JSON object. If its kind exists, no code.
- **A new pose** → one line in `POSES`. **A new expression** → one branch in `drawHead`. **A new icon** → one function in `ICON`. **A new organ** → one body path + the organ helpers (it gets a face automatically). **A new environment** → one file in `env/`.
- **A new kind of shot** → one function in `TEMPLATES`. Cap: ten kinds; argue before adding an eleventh.
- **A brand change** → `style.js` only. Everything downstream follows.

## Determinism
All randomness is seeded (`rnd(i)`), so the same JSON renders the same frames every time. Grain is seeded per frame.

## Known limits (honest)
- Hand-drawn warmth has a ceiling in code; a commissioned layered-SVG character would drop straight onto this rig.
- The lie pose needs its blanket; "think" lands at the mouth; "wave" is a raised hand. Tune per shot.
- `fetch` of the episode JSON over `file://` is not allowed by the browser, so `render.py` injects it (`EP=` env var).
- Renders run in a cloud container; the Mac needs the desktop app open to receive files.
