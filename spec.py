"""spec.py — writes knowledge file 7, "Animation System Spec", FROM THE CODE, so the spec cannot drift from the library.
usage: python3 spec.py write [out.md]   → regenerates the spec
       python3 spec.py check out.md     → exits 1 if the committed spec differs from what the code says (run in CI / at hand-over)"""
import re, sys, json, subprocess, os, datetime
HERE=os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
def rd(f): return open(f,encoding='utf-8').read()
def keys_of(block):  # top-level `name:` keys of a JS object literal body
    return re.findall(r"^\s{2}([A-Za-z_]\w*)\s*:", block, re.M)
rig=rd('rig.js'); lib=rd('library.js'); icons=rd('icons.js'); tpl=rd('templates.js'); style=rd('style.js'); meter=rd('meter.js')
cast_block=rig[rig.index('const CAST = {'):rig.index('};',rig.index('const CAST = {'))]
cast=re.findall(r"^\s{2}(\w+):\s*\{\s*top:(P\.\w+|'[^']+').*?hair:(null|'\w+').*?glasses:(true|false).*?scale:([\d.]+)", cast_block, re.M)
pal=dict(re.findall(r"(\w+):'(#[0-9A-Fa-f]{6})'", style)); cast=[(n, (pal.get(top[2:],top) if top.startswith('P.') else top.strip(chr(39))), hair, gl, sc) for n,top,hair,gl,sc in cast]
poses=keys_of(lib[lib.index('const POSES = {'):lib.index('};',lib.index('const POSES = {'))])
faces=sorted(set(re.findall(r"face==='(\w+)'", rig)))
icon_names=keys_of(icons[icons.index('const ICON = {'):icons.index('\n};',icons.index('const ICON = {'))])
organ_block=icons[icons.index('Object.assign(ICON,{'):]
organs=re.findall(r"^\s{2}(\w+):\(ctx,t,c\)=>", organ_block, re.M)+['bladder']
envs=re.findall(r"(\w+):(?:\(ctx,t,p,cam(?:,o)?\)=>)?draw\w+", tpl[tpl.index('const ENVS = {'):tpl.index('};',tpl.index('const ENVS = {'))])
templates=re.findall(r"^\s{2}([A-Z]+):\(ctx,t,spec,S\)=>", tpl, re.M)
palette=re.findall(r"(\w+):'(#[0-9A-Fa-f]{6})'", style[style.index('const P = {'):style.index('};',style.index('const P = {'))])
try: commit=subprocess.run(['git','-C','/home/claude/should-i-worry-pipeline','rev-parse','--short','HEAD'],capture_output=True,text=True).stdout.strip() or 'uncommitted'
except Exception: commit='unknown'
today=datetime.date.today().strftime('%-d %b %Y')
md=[]
md.append(f"# Animation System Spec\n\nKnowledge-base file 7 of 7. **Generated from the code by `spec.py`** on {today} (library commit `{commit}`, repo `sgreeff1/should-i-worry-pipeline`). Regenerate after any library change; `python3 spec.py check` fails if this file and the code disagree. Rules of use are in the Pipeline – Style Bible; this file is the inventory. New chats build from this inventory and never re-invent an item on it.\n")
md.append("## How an episode uses the library\n\nAn episode is a JSON file (`episodes/<ep>.json`): `library` (the commit that rendered it), `shots` (one object per shot: `kind`, `t0`, `t1`, content), `cards`, `cites`, optional `meter` track. Render: `EP=episodes/<ep>.json PAGE=scene_ep.html python3 render.py video out.mp4 <seconds> 4`. Gates: `python3 checks.py episodes/<ep>.json out.mp4 timings.json`.\n")
md.append("## Cast (Decision #45) — one rig, `outfit` picks the member\n\n| Member | Top | Hair | Glasses | Scale |\n| --- | --- | --- | --- | --- |")
for n,top,hair,gl,sc in cast: md.append(f"| `{n}` | {top} | {hair.strip(chr(39)) if hair!='null' else '—'} | {'yes' if gl=='true' else 'no'} | {sc} |")
md.append("\n`alt` is an alias of `woman` (crowd colour from v1). Props do not scale with the child yet.\n")
md.append("## Poses (`library.js` POSES) — `seq: [[time, pose, transition s]]`\n\n"+", ".join(f"`{p}`" for p in poses)+"\n")
md.append("## Expressions (`rig.js` drawHead) — `face: [[time, name]]`\n\n"+", ".join(f"`{f}`" for f in faces)+"\n")
md.append("## Organs (Decisions #41–42, #47) — rose, faces, state colour drives halo/mood\n\n"+", ".join(f"`{o}`" for o in sorted(set(organs)))+"\n\nCall with no colour for the normal state, `P.red` (`'#EB5757'`) for the red-flag state. Bones are ivory, nerves yellow, organs rose; no ducts or tubes on organ icons.\n")
md.append("## Icons (`icons.js` ICON) — `drawIcon(ctx,name,x,y,size,t,color)`; plus the organs above\n\n"+", ".join(f"`{i}`" for i in icon_names)+"\n")
md.append("## Environments (`env/*.js`, Decision #48) — `env:` on CHAR shots\n\n"+", ".join(f"`{e}`" for e in envs)+"\n")
md.append("## Shot templates (`templates.js`) — `kind:` on every shot; cap: ten kinds\n\n"+", ".join(f"`{t}`" for t in templates)+"\n\nCHAPTER also carries the opening idents: `ident:'dial'` (option 1) or `ident:'char'` (option 2). END without a `title` shows the wordmark and the worry meter.\n")
md.append("## Signature devices (Decision #46)\n\n- **Worry meter** (`meter.js`): `drawMeter(ctx,t,{x,y,size,value,style})`, styles `gauge` and `bar`; three zones with colour + icon (teal/check, amber/toast, red/flame). Episode track: `meter:[{t0,t1,from,to,hold,size,x,y,style}]`; sizes under 320 px carry no label (corner overlay).\n- **Opening ident**: 2.0–2.6 s CHAPTER shot; sound mark `audio/soundmark_a.wav` (rising) or `_b.wav` (rise-then-settle), synthesised by `soundmark.py`.\n- **Wordmark**: `wordmark(ctx,x,y,size)` — \"Should I Worry\" in ivory, \"?\" in amber.\n")
md.append("## Palette (`style.js` P)\n\n| Name | Hex |\n| --- | --- |\n"+"\n".join(f"| `{n}` | {h} |" for n,h in palette)+"\n")
md.append("## Layout rules enforced in code\n\n- Cards: top band (15 % height) on CHAR and FIGURE shots, 80 % elsewhere (`cardLow:true` overrides); ≤ 7 words.\n- Citations: bottom-left pill, 600/36 px. Disclaimer: bottom-right, first 10 s. Tag: top-left.\n- `checks.py` fails an episode without a `library` stamp, with an unknown cast member, or with a meter value outside 0–1, besides the Quality-Criteria gates (4.2, 4.4, 4.5, 4.6, 6.4, format).\n")
out='\n'.join(md)
mode=sys.argv[1] if len(sys.argv)>1 else 'write'; path=sys.argv[2] if len(sys.argv)>2 else '07 Animation System Spec.md'
if mode=='write': open(path,'w',encoding='utf-8').write(out); print('wrote',path,len(out),'bytes')
else:
    cur=open(path,encoding='utf-8').read()
    strip=lambda s: re.sub(r"on \d+ \w+ \d{4} \(library commit `\w+`","",s)
    if strip(cur)==strip(out): print('SPEC OK — matches the code'); sys.exit(0)
    import difflib; print('SPEC DRIFT:'); print('\n'.join(list(difflib.unified_diff(strip(cur).splitlines(),strip(out).splitlines(),lineterm=''))[:40])); sys.exit(1)
