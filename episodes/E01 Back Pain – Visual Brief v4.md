# E01 "The Back Pain That Can Kill You" — Visual brief v4 (built from the voice-over)

Claude, 27 Oct 2026. Supersedes v3 (25 Oct). v4 is **generated from `build_E01.py`** in the pipeline repo (`sgreeff1/should-i-worry-pipeline`, library `9364439` (v2 after the fresh-eyes check)), which writes `episodes/E01.json`; every shot, card and citation is timed from the recorded Julian voice-over (`episodes/E01_timings.json`, 102 sentences, aligned 27 Oct). Change the brief by changing the builder, then re-run it. Rows keep the v3 numbers (ids) where the shot survived; letters (24b, 33b, 85b) are splits.

**Timeline:** opening ident 0.0–2.4 s, then the voice starts (all VO times + 2.4 s). Programme length 7:12.9.

## What changed from v3 (for Checkpoint 2)

| v3 rows | Change | Why |
| --- | --- | --- |
| — | Opening ident added (dial sweeps fine → fire → settles on burnt toast; sound mark A), 2.4 s before the voice | Decision #46/#51 signature device |
| 1–3, 83 | Hook and the "back to that sock" callback are the code rig (lead, home), not GenAI stills; the callback replays the hook's locked → relieved beat | Decisions #37–38, #40; resolves the gate-4.3 question in v3 (no GenAI reuse needed) |
| 7, 56, 81 | Crowds use the cast: lead, woman, older (+ doctor in 81) | Decision #45 |
| 17 | Horse-tail icon, then legs / bladder / bowel / "sexual function" (two linked rings) | neutral icon for sexual function |
| 22, 79 | Bar charts with the two figures the claim table holds (52 → 23; 30 % → 84 %), not a 7-point line | gate 4.4: only numbers from the claim–source table go on screen |
| 28, 80 | Disc herniation = the four-frame Servier sequence you added (Hernie_discale 1 → 4, and 4 → 1 for the shrinking disc), with the nerve-bundle organ icon turning red | real Servier frames instead of a hand-made composite |
| 29–30 | Signal dots run from the nerve bundle to the bladder and saddle-skin icons, then stop; targets turn red / grey | code-drawn, no anatomy needed |
| 31 | 600-dot field, two dots turn red; the card carries "1–3 per 100,000" | gate 4.5 (card words) |
| 34, 43, 48 | Chapter insets: bacteria icon, tumour icon, vertebra organ icon (the epidural image cut the title) | layout |
| 37 | Abscess: bacteria drift into the posterior epidural space of the sagittal lumbar image, a red pocket grows there | **check at gate 6.2** (position) |
| 47 | Tumour: a dark-rose mass grows on a vertebral body of the same image toward the cord; legs icon greys; siren | **check at gate 6.2** |
| 50 | Two vertebra organ icons, a crack draws across the weak one (red state) | Osteoporose assets were not downloaded; icon version reads at phone size |
| 51 | "Now the twist" over a 1,000-dot field; no music sting | Decision #39 (no stings) |
| 52 | Vertebra icon vs kidney icon, "Outside the spine: more common", no ratio | Shaw 2020 full text pending (gate 2.6) |
| 54 | aorte_abdo laid over the front-view spine (colonne_02) | composite from your downloads |
| 55 | anev_03 (ring on the bulge) + Dissection_intima2 | your downloads |
| 60–70, 84–85 | Urgency tiers are the BANNER template (icon + word + colour) | Decision #46 (colour never alone) |
| 71–72 | rein_01 + thermometer; then kidney organ icon + check stamp | kidney organ icon is new (library) |
| 15–16 | Cord end = ring on colonne_02 at 60 % of its height ("L1–L2"); cauda equina = nerve pulses fanning below it | **check the level at gate 6.2 (C7)** |
| 86 | "Look after your back": lead waves at home; then the END card (wordmark, credit, disclaimer, meter settled at burnt toast) | Decision #46 |
| all | Worry meter (corner, bottom-right) moves five times: rises at "a few can kill you", falls at "burnt toast", jumps at "a real fire", eases at "calmly", settles at the callback | Decision #46 |

Retired from v3: all GenAI rows (P1–P3), the editor icon-library licence question (every icon is code), the "music hit" at the twist.

## Gates (checks.py, 27 Oct 2026): PASS
4.2 Servier credit on every shot with Servier art · 4.4 every numeric card has a citation on screen · 4.5 ≤ 7 words · 4.6 no stretch over 8 s (hook has internal cuts) · library stamp · cast names · meter 0–1. Sync notes: four shots start mid-sentence by design (5, 57, 61, 86).

## Servier assets on screen (CC BY 4.0, restyled by `restyle.py`, credited on screen)
Colonne_normale2, Dissection_intima2, Espace_epidural, Hernie_discale1, Hernie_discale2, Hernie_discale3, Hernie_discale4, Systeme_nerveux, anev_03, aorte_abdo, colonne_02, rein_01, vertebre_06.

## Shot list (generated)

| # | Time | S## | Kind | What is on screen | Card(s) | Citation(s) |
| --- | --- | --- | --- | --- | --- | --- |
| ident | 0:00.0–0:02.4 | — | CHAPTER | Opening ident (dial + sound mark) |  |  |
| 1 | 0:02.4–0:15.3 | S001–004 | CHAR | Rig: `lead` in `home` — hook performance (anims/hook.js) |  |  |
| 4 | 0:15.3–0:19.5 | S005 | COUNT | Count: 125 figures, 1 highlighted | About 1 in 125: spine problem | Reginato et al., Pain Med, 2026 |
| 5 | 0:19.5–0:23.6 | S005 | COUNT | Count: 125 figures, 1 highlighted; zoom-in | A serious spine problem | Reginato et al., Pain Med, 2026 |
| 6 | 0:23.6–0:27.7 | S006 | GLOBE | Globe: Natural Earth land on d3-geo orthographic, markers on real cities | #1 cause of disability worldwide | Hartvigsen et al., Lancet, 2018 |
| 7 | 0:27.7–0:34.4 | S007–009 | FIGURE | Figure ×5 (lead, woman, older, woman, lead), pose `backPain`; tints ['back', 'back', 'back', 'back', 'back']; icons ['earMute'] | So common, we stop listening |  |
| 8 | 0:34.4–0:41.2 | S010–011 | FIGURE | Figure ×1 (lead), pose `stand`; tints ['legs', 'saddle']; icons ['bladder', 'triangle'] | Rare, but serious |  |
| 9 | 0:41.2–0:46.1 | S012 | FIGURE | Figure ×2 (lead, lead), pose `backPain`; tints ['back', 'back', 'back']; x-ray sweep | Often missed at first | Budiman et al., Emerg Med Australas, 2026 |
| 10 | 0:46.1–0:51.3 | S013 | ICONS | Icons: `toast` (Burnt toast), `flame` (Fire) | Dangerous, or just feels it? |  |
| 11 | 0:51.3–0:55.3 | S014 | ICONS | Icons: `alarm`; checklist ['Legs', 'Bladder', 'Numbness', 'Sudden pain'] | Signs that mean "go now" |  |
| 12 | 0:55.3–1:00.8 | S015–016 | ANATOMY | Anatomy (`spineIntro`): Colonne_normale2, vertebre_06 | Vertebrae: the stacked bones | Anatomy: Servier Medical Art, CC BY 4.0 |
| 13 | 1:00.8–1:06.6 | S017 | ANATOMY | Anatomy (`discZoom`): Espace_epidural | Disc: tough ring, soft center | Anatomy: Servier Medical Art, CC BY 4.0 |
| 14 | 1:06.6–1:13.9 | S018 | ANATOMY | Anatomy (`layers`): Systeme_nerveux; marks ['label', 'line', 'pulses'] | Spinal cord: the nerve cable | Anatomy: Servier Medical Art, CC BY 4.0 |
| 15 | 1:13.9–1:17.2 | S019 | ANATOMY | Anatomy (`layers`): colonne_02; marks ['label', 'line', 'ring'] | Cord ends near top of lower back | Anatomy: Servier Medical Art, CC BY 4.0 |
| 16 | 1:17.2–1:22.0 | S020 | ANATOMY | Anatomy (`layers`): colonne_02; marks ['label', 'pulses', 'ring'] | Cauda equina | Anatomy: Servier Medical Art, CC BY 4.0 |
| 17 | 1:22.0–1:28.9 | S021–022 | ICONS | Icons: `horsetail` (Horse's tail), `legs` (Legs), `bladder` (Bladder), `bowel` (Bowel), `rings` (Sexual function) | "Horse's tail": legs, bladder, bowel |  |
| 18 | 1:28.9–1:34.6 | S023–024 | FIGURE | Figure ×1 (lead), pose `backPain`; tints ['back']; icons ['alarm'] | Back pain = smoke alarm |  |
| 20 | 1:34.6–1:39.5 | S025 | ICONS | Icons: `toast` | Usually: burnt toast |  |
| 20b | 1:39.5–1:42.7 | S026 | FIGURE | Figure ×1 (lead), pose `backPain`; tints ['back']; icons ['toast'] | Loud, miserable, usually harmless |  |
| 21 | 1:42.7–1:47.7 | S027 | FIGURE | Figure ×1 (lead), pose `shrug`; icons ['question'] | Often no single cause found | Hartvigsen et al., Lancet, 2018 |
| 22 | 1:47.7–1:51.6 | S028 | CHART | Chart (bar): Average pain, acute back pain (0–100) — {'Week 0': 52, 'Week 6': 23} | Average pain drops fast | da C Menezes Costa et al., CMAJ, 2012 |
| 23 | 1:51.6–1:56.7 | S029–030 | ICONS | Icons: `toast` → `flame` | Sometimes: a real fire |  |
| 24 | 1:56.7–2:00.5 | S031 | CHAPTER | Chapter card: Fire number one — A squeezed horse's tail; inset `horsetail` |  |  |
| 24b | 2:00.5–2:03.3 | S032 | FIGURE | Figure ×1 (lead), pose `backPain`; tints ['back']; icons ['calendar'] | A week of grumbling |  |
| 25 | 2:03.3–2:06.2 | S033 | FIGURE | Figure ×1 (lead), pose `stand`; tints ['legs'] | Pain down both legs |  |
| 26 | 2:06.2–2:11.4 | S034 | FIGURE | Figure ×1 (lead), pose `stand`; tints ['saddle'] | Numb "saddle" area |  |
| 27 | 2:11.4–2:17.5 | S035–036 | FIGURE | Figure ×1 (lead), pose `stand`; tints ['saddle']; icons ['bladder', 'triangle'] | Cauda equina syndrome |  |
| 28 | 2:17.5–2:22.9 | S037 | ANATOMY | Anatomy (`layers`): sequence Hernie_discale1 → Hernie_discale2 → Hernie_discale3 → Hernie_discale4; marks ['icon:nerve', 'label'] | Disc presses on nerve bundle | GIRFT, 2023 · Anatomy: Servier Medical Art, CC BY 4.0 |
| 29 | 2:22.9–2:29.8 | S038 | ANATOMY | Anatomy (`layers`): code-drawn organs only; marks ['icon:bladder', 'icon:nerve', 'icon:person', 'pulses'] | Same nerves: bladder, saddle skin / Signals go quiet |  |
| 31 | 2:29.8–2:35.6 | S039–040 | COUNT | Count: 600 dots, 2 highlighted | 1–3 per 100,000 a year | Woodfield et al., Neuroepidemiology, 2022; GIRFT, 2023 |
| 32 | 2:35.6–2:40.4 | S041 | ICONS | Icons: `bladder` (Bladder), `bowel` (Bowel), `legs` (Legs), `rings` (Sex life) | Can be permanent | GIRFT, 2023 |
| 33 | 2:40.4–2:43.0 | S042 | ICONS | Icons: `hospital` | Treated as an emergency | GIRFT, 2023 |
| 33b | 2:43.0–2:49.1 | S043 | ICONS | Icons: `clock` (Within 4 hours), `scanner` (A scan) | UK standard: scan within 4 hours | GIRFT, 2023 |
| 34 | 2:49.1–2:54.5 | S044 | CHAPTER | Chapter card: Fire number two — Infection by the nerves; inset `bacteria` |  |  |
| 35 | 2:54.5–2:59.9 | S045 | ICONS | Icons: `skin` (Skin infection), `iv` (A drip), `glucose` (Diabetes) | Skin infection, IV drip, diabetes | Reihsaus et al., Neurosurg Rev, 2000 |
| 36 | 2:59.9–3:03.2 | S046 | FIGURE | Figure ×1 (lead), pose `backPain`; tints ['back']; icons ['thermometer'] | Back pain, maybe fever |  |
| 37 | 3:03.2–3:09.2 | S047 | ANATOMY | Anatomy (`layers`): Espace_epidural; marks ['blob', 'drift:bacteria', 'label'] | Infection gathers beside nerves | Anatomy: Servier Medical Art, CC BY 4.0 |
| 38 | 3:09.2–3:14.7 | S048–049 | ICONS | Icons: `toast` (What it looks like), `flame` (What it is) | Disguised as burnt toast |  |
| 39 | 3:14.7–3:21.1 | S050 | COUNT | Count: 8 figures, 1 highlighted | All three at first: 1 in 8 | Davis et al., J Emerg Med, 2004 |
| 40 | 3:21.1–3:25.0 | S051 | ICONS | Icons: `alarm` (Back pain), `thermometer` (Fever), `legs` (Nerve signs) | Back pain + fever + nerve signs | Davis et al., J Emerg Med, 2004 |
| 41 | 3:25.0–3:29.3 | S052 | COUNT | Count: 4 figures, 3 highlighted | 3 in 4 diagnosed late | Davis et al., J Emerg Med, 2004 |
| 42 | 3:29.3–3:34.6 | S053 | COUNT | Count: 10 figures, 1 highlighted | About 1 in 10 died | Budiman et al., Emerg Med Australas, 2026 |
| 43 | 3:34.6–3:38.1 | S054 | CHAPTER | Chapter card: Fire number three — Cancer in the spine; inset `tumor` |  |  |
| 44 | 3:38.1–3:43.5 | S055 | ICONS | Icons: `document` (Cancer history), `sun` (Same day) | Past cancer + new pain: same day | NICE NG234, 2023 |
| 45 | 3:43.5–3:48.4 | S056 | ICONS | Icons: `document` (Cancer history), `magnifier` (A key clue) | A key clue: cancer history | Verhagen et al., Pain, 2017 |
| 46 | 3:48.4–3:55.1 | S057 | ICONS | Icons: `arrowUp` (Getting worse), `moon` (Night pain), `cough` (Cough or strain) | Worsening, night pain, straining | NICE NG234, 2023 |
| 47 | 3:55.1–4:02.6 | S058–059 | ANATOMY | Anatomy (`layers`): Espace_epidural; marks ['blob', 'icon:legs', 'icon:siren'] | Weak legs after cancer: emergency | NICE NG234, 2023 · Anatomy: Servier Medical Art, CC BY 4.0 |
| 48 | 4:02.6–4:05.7 | S060 | CHAPTER | Chapter card: Fire number four — A broken bone; inset `vertebra` |  |  |
| 49 | 4:05.7–4:13.3 | S061 | ICONS | Icons: `seventy` (Over 70), `pill` (Steroid medicines), `fall` (A real fall) | Over 70, steroids, a fall | Han et al., Cochrane, 2023 |
| 50 | 4:13.3–4:17.2 | S062 | ANATOMY | Anatomy (`layers`): code-drawn organs only; marks ['crack', 'icon:vertebra'] | Weak bones crack more easily |  |
| 51 | 4:17.2–4:23.2 | S063–064 | COUNT | Count: 1000 dots, 0 highlighted | Now the twist / 1,000 emergency patients | Shaw et al., Eur Spine J, 2020 |
| 52 | 4:23.2–4:29.0 | S065 | ICONS | Icons: `vertebra` (Inside the spine), `kidney` (Outside the spine) | Outside the spine: more common | Shaw et al., Eur Spine J, 2020 |
| 53 | 4:29.0–4:33.8 | S066 | FIGURE | Figure ×1 (lead), pose `backPain`; tints ['back', 'belly']; icons ['alarm', 'flame'] | Alarm in back, fire elsewhere |  |
| 54 | 4:33.8–4:40.1 | S067 | ANATOMY | Anatomy (`layers`): colonne_02, aorte_abdo; marks ['label', 'line'] | The aorta: your main artery | Anatomy: Servier Medical Art, CC BY 4.0 |
| 55 | 4:40.1–4:43.4 | S068 | ANATOMY | Anatomy (`layers`): anev_03, Dissection_intima2; marks ['label', 'ring'] | Burst or torn: life-threatening | Anatomy: Servier Medical Art, CC BY 4.0 |
| 56 | 4:43.4–4:47.4 | S069 | FIGURE | Figure ×3 (older, lead, woman), pose `stand`; tints ['belly']; icons ['question'] | Burst aneurysm: 1 in 3 missed | Azhar et al., J Endovasc Ther, 2014 |
| 57 | 4:47.4–4:50.9 | S069 | ICONS | Icons: `person` (Missed at first), `scanner` (Then the scan) | First diagnosis: often something else | Azhar et al., J Endovasc Ther, 2014 |
| 58 | 4:50.9–4:55.5 | S070 | ICONS | Icons: `hand` | Calmly: the signs to check |  |
| 59 | 4:55.5–4:58.6 | S071–072 | ICONS | Icons: `bladder`, `legs`, `flag`, `bowel`, `thermometer` | You don't need all of them / One is enough |  |
| 60 | 4:58.6–5:02.6 | S073 | BANNER | Banner `GO NOW` — Emergency department: `hospital` (Emergency department) | GO NOW: emergency department | GIRFT, 2023 |
| 61 | 5:02.6–5:07.5 | S073 | ICONS | Icons: `bladder` | Trouble peeing, or not feeling full | GIRFT, 2023 |
| 62 | 5:07.5–5:14.2 | S074 | FIGURE | Figure ×1 (lead), pose `stand`; tints ['saddle'] | Numb saddle or genital area | GIRFT, 2023 |
| 63 | 5:14.2–5:18.9 | S075–076 | ICONS | Icons: `bowel` (Bowel control), `rings` (Sexual function) | Bowel control; sexual function change | GIRFT, 2023 |
| 64 | 5:18.9–5:22.7 | S077 | FIGURE | Figure ×1 (lead), pose `stand`; tints ['legs']; icons ['arrowDown'] | Weakening or numb legs | GIRFT, 2023 |
| 65 | 5:22.7–5:28.7 | S078 | FIGURE | Figure ×1 (lead), pose `backPain`; tints ['back', 'belly']; icons ['siren'] | Sudden severe pain, feeling faint | Fernando et al., Acad Emerg Med, 2022 |
| 66 | 5:28.7–5:34.0 | S079 | ICONS | Icons: `document` (Cancer history), `walk` (Weak legs), `siren` (Go now) | Past cancer + weak legs: go now | NICE NG234, 2023 |
| 67 | 5:34.0–5:39.9 | S080 | BANNER | Banner `SAME DAY` — See a doctor: `thermometer` (Fever), `person` (Feeling unwell) | SAME DAY: fever, feeling unwell | Shaw et al., Eur Spine J, 2020 |
| 68 | 5:39.9–5:46.5 | S081 | ICONS | Icons: `skin` (Infection), `iv` (Drip or line), `syringe` (Injecting) | Especially: infection, IV line, injecting | Galliker et al., Am J Med, 2020 |
| 69 | 5:46.5–5:51.3 | S082 | ICONS | Icons: `document` (Cancer history), `sun` (Same day) | SAME DAY: past cancer, new pain | NICE NG234, 2023 |
| 70 | 5:51.3–5:57.5 | S083 | BANNER | Banner `SOON` — See a doctor: `fall` (After a fall), `seventy` (Over 70), `pill` (Long-term steroids) | SOON: fall, 70+, or steroids | Han et al., Cochrane, 2023 |
| 71 | 5:57.5–6:02.5 | S084 | ANATOMY | Anatomy (`layers`): rein_01; marks ['icon:thermometer', 'label'] | Side pain + fever: kidneys? | Shaw et al., Eur Spine J, 2020 · Anatomy: Servier Medical Art, CC BY 4.0 |
| 72 | 6:02.5–6:04.8 | S085 | ICONS | Icons: `kidney` (Kidneys?), `stamp` (Same-day check) | Kidneys? Same-day check | Shaw et al., Eur Spine J, 2020 |
| 73 | 6:04.8–6:09.9 | S086–087 | ICONS | Icons: `flag` (A warning sign), `question` (proves nothing alone) | No single sign proves anything | Finucane et al., JOSPT, 2020 |
| 74 | 6:09.9–6:15.6 | S088 | COUNT | Count: 10 figures, 8 highlighted | 8 in 10 have a "flag" | Henschke et al., Arthritis Rheum, 2009 |
| 75 | 6:15.6–6:18.9 | S089 | COUNT | Count: 100 figures, 1 highlighted | Under 1 in 100: serious | Henschke et al., Arthritis Rheum, 2009 |
| 76 | 6:18.9–6:21.8 | S090 | ICONS | Icons: `flag`, `flag`, `flag`, `flag`, `flag` | Most signs: small studies | Finucane et al., JOSPT, 2020; Han et al., Cochrane, 2023 |
| 77 | 6:21.8–6:25.9 | S091 | ICONS | Icons: `bladder` (Bladder), `person` (Saddle), `legs` (Legs), `flame` (Sudden pain), `document` (Guidelines) | Go-now signs: named in guidelines | GIRFT, 2023; NICE NG234, 2023 |
| 78 | 6:25.9–6:28.1 | S092 | ICONS | Icons: `scanner`, `question` | Scans aren't magic |  |
| 79 | 6:28.1–6:35.3 | S093 | CHART | Chart (bar): Disc bulges in people with NO pain — {'Age 20': 30, 'Age 80': 84} | Pain-free, yet bulges: 30% → 84% | Brinjikji et al., AJNR, 2015 |
| 80 | 6:35.3–6:38.5 | S094 | ANATOMY | Anatomy (`layers`): sequence Hernie_discale4 → Hernie_discale3 → Hernie_discale2 → Hernie_discale1; marks ['label'] | Herniated discs often shrink | Chiu et al., Clin Rehabil, 2015 · Anatomy: Servier Medical Art, CC BY 4.0 |
| 81 | 6:38.5–6:41.4 | S095 | FIGURE | Figure ×2 (lead, doctor), pose `stand`; icons ['scanner'] | Most don't need a scan | NICE NG59, 2020 |
| 82 | 6:41.4–6:45.3 | S096 | CHAR | Rig: `doctor` in `clinic` — poses ['stand', 'point', 'stand'] | Worried, or not settling? See a doctor |  |
| 83 | 6:45.3–6:49.9 | S097–098 | CHAR | Rig: `lead` in `home` — poses ['locked', 'stand'] | Back to that sock: burnt toast |  |
| 84 | 6:49.9–6:56.9 | S099 | BANNER | Banner `GO NOW`: `bladder` (Bladder or bowel), `person` (Numb saddle), `legs` (Weak legs), `flame` (Sudden severe pain) | GO NOW: these signs |  |
| 85 | 6:56.9–7:00.9 | S100 | BANNER | Banner `SAME DAY`: `thermometer` (Fever), `document` (New pain after cancer) | SAME DAY: fever; new pain after cancer |  |
| 85b | 7:00.9–7:07.3 | S101–102 | CHAR | Rig: `lead` in `home` — poses ['stand', 'wave', 'stand'] | Look after your back |  |
| 86 | 7:07.3–7:12.9 | — | END | End card: wordmark, reviewer credit, disclaimer, worry meter at 0.45, subscribe line | Look after your back |  |

## Gate 6.2 (confirmed by Sebastian on the stills, 27 Oct 2026 — Decision #53)
1. Cord-end level on colonne_02 (row 15): ring at 60 % of the image height, "L1–L2" — confirmed.
2. Abscess position (row 37): posterior epidural space, next to the yellow cord — confirmed.
3. Tumour position (row 47): vertebral body, pressing toward the cord — confirmed.
4. Disc frames (rows 28, 80): nucleus stays rose — confirmed.
5. The 4.3 question from v3 is closed: no GenAI anywhere.

## v2 (fresh-eyes check + own watch-through, 27 Oct 2026)
Two blockers (icons hidden behind the top card at 0:32 and 4:44) and the fixes listed in the QA report were applied in `build_E01.py` and the library (commit 9364439): icons moved out of the card band, bowel icon redrawn, bigger count sprites, anatomy layers scaled and placed left of the low card, pain beats use worried/ouch faces, card band at 11 % so the tag never touches a card, meter timing, banner hard cut, Servier credit only where Servier art is on screen. Reviewer items ruled out with a reason: bladder over the groin (Sebastian's option E), abscess "anterior" (it is posterior to the cord; confirmed at 6.2), "missing cards / no wordmark" (2-second sampling; present on the frame-accurate render).
