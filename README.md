# Should I Worry? — animation pipeline

Code-drawn 2D animation system for the medical explainer channel: a character rig with pose and expression libraries, five environments, ten JSON-driven shot templates, a composer, a renderer (HTML canvas → Playwright → ffmpeg) and automated quality-gate checks.

- **How it works:** `Pipeline – How It Works.md`
- **Visual rules:** `Pipeline – Style Bible.md` (enforced by `style.js`)
- **Render:** `EP=episodes/E01_segment.json PAGE=scene_ep.html python3 render.py video out.mp4 62.85 4`
- **Checks:** `python3 checks.py episodes/E01_segment.json out.mp4 timings.json`

Third-party content: anatomy from Servier Medical Art (CC BY 4.0, restyled, credited on screen); land outlines from Natural Earth 1:110m (public domain) via `world.js`; `vendor/` holds d3-geo and d3-array (ISC). No generative-AI images or video.

The folder `05 Brand/Pipeline/code` on the production Mac is a clone of this repository. The Channel Brief (live doc) remains the source of truth for decisions.
