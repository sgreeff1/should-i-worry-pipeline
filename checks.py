"""checks.py — Quality Criteria gates that a machine can verify, run against an episode JSON (+ optional rendered file).
usage: python3 checks.py episodes/E01_segment.json [rendered.mp4] [timings.json]"""
import json, re, subprocess, sys
ep=json.load(open(sys.argv[1])); video=sys.argv[2] if len(sys.argv)>2 and sys.argv[2].endswith('.mp4') else None
timings=json.load(open(sys.argv[3])) if len(sys.argv)>3 else None
fails=[]; notes=[]
# library version stamp (Decision #50): every episode records the pipeline commit that rendered it
if not ep.get('library'): fails.append("library: episode JSON has no 'library' field (pipeline commit / version)")
else: notes.append(f"library {ep['library']}")
# cast names must exist (Decision #45)
CAST={'lead','woman','older','child','doctor','alt','default'}
for s in ep['shots']:
    for o in ([s.get('outfit')] if s.get('outfit') else [])+list(s.get('outfits') or []):
        if o not in CAST: fails.append(f"cast: shot {s['id']} uses unknown member {o!r}")
# worry meter values stay inside the dial
for m in ep.get('meter') or []:
    for k in ('from','to'):
        if k in m and not (0<=m[k]<=1): fails.append(f"meter: {k}={m[k]} outside 0..1 at t0={m['t0']}")
# 4.5 cards ≤ 7 words
for text,a,b in ep['cards']:
    n=len(re.findall(r"[A-Za-z0-9#'’\"]+", text));
    if n>7: fails.append(f"4.5 card over 7 words ({n}): {text!r}")
# 4.6 no shot longer than 8 s; shots contiguous
shots=sorted(ep['shots'],key=lambda s:s['t0'])
for s in shots:
    bounds=[s['t0']]+sorted(s.get('cuts',[]))+[s['t1']]     # internal camera cuts count as visual changes
    for a,b in zip(bounds,bounds[1:]):
        if b-a>8.0+1e-6: fails.append(f"4.6 shot {s['id']} has a {b-a:.2f} s stretch without a visual change (> 8 s)")
for a,b in zip(shots,shots[1:]):
    if abs(a['t1']-b['t0'])>1e-6: fails.append(f"gap/overlap between shots {a['id']} and {b['id']}: {a['t1']} → {b['t0']}")
# 4.4 a card with a number needs a citation visible at that time
for text,a,b in ep['cards']:
    if re.search(r"\d", text):
        if not any(ca<=a+0.01 and cb>=b-0.01 for _,ca,cb in ep['cites']): fails.append(f"4.4 numeric card without a citation: {text!r}")
# 4.2 anatomy shots need the Servier credit on screen
for s in shots:
    if s['kind']=='ANATOMY' and (s.get('asset') or s.get('layers') or s.get('frames')) and not any('Servier' in c[0] and c[1]<=s['t0']+1.0 and c[2]>=s['t1']-0.01 for c in ep['cites']):
        fails.append(f"4.2 ANATOMY shot {s['id']} without the Servier credit")
# sync: every shot boundary should sit on a sentence start (±0.06 s) when timings are given
if timings:
    off=ep.get('voOffset',0); starts=[x['start']+off for x in timings]   # the voice starts after the opening ident
    for s in shots[1:]:
        if min(abs(s['t0']-x) for x in starts)>0.06: notes.append(f"sync: shot {s['id']} starts at {s['t0']} — not on a sentence start")
# disclaimer in the first 10 s is drawn by the composer (finish.js) — structural, always on
# 6.4 loudness and format from the rendered file
if video:
    out=subprocess.run(["ffmpeg","-nostats","-i",video,"-af","ebur128","-f","null","-"],capture_output=True,text=True).stderr
    m=re.findall(r"I:\s+(-?[\d.]+) LUFS",out.split("Summary:")[-1]); lufs=float(m[-1]) if m else None
    if lufs is None or abs(lufs+14)>1.0: fails.append(f"6.4 loudness {lufs} LUFS (target −14 ±1)")
    else: notes.append(f"6.4 loudness {lufs} LUFS")
    pr=subprocess.run(["ffprobe","-v","error","-show_entries","stream=width,height,r_frame_rate,duration","-of","csv=p=0",video],capture_output=True,text=True).stdout
    notes.append("format "+pr.strip().replace("\n"," | "))
    if "1920,1080" not in pr: fails.append("format: not 1920×1080")
print(f"CHECKS for {ep.get('title','')}: {len(shots)} shots, {len(ep['cards'])} cards, {len(ep['cites'])} citations")
for n in notes: print("  note:",n)
for f in fails: print("  FAIL:",f)
print("RESULT:", "PASS" if not fails else f"FAIL ({len(fails)})")
sys.exit(1 if fails else 0)
