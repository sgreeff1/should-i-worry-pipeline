"""contact_sheet.py — renders the library audit sheets: A character (poses, outfits, faces), B environments + templates, C icons.
usage: python3 contact_sheet.py outdir"""
import os, sys, json
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
HERE=os.path.dirname(os.path.abspath(__file__)); OUT=sys.argv[1] if len(sys.argv)>1 else HERE+'/check/contact'; os.makedirs(OUT+'/raw',exist_ok=True)
POSES=['stand','lookDown','bend','locked','point','shrug','think','phone','wave','handsOnHips','sit','lie','walk','backPain']
FACES=['calm','focus','worried','ouch','peek','relief','surprise','thinking','talking','happy','tired']
ENVS=['home','bedroom','clinic','void','body']
try: F=ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-Bold.otf',30); F2=ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-Bold.otf',44)
except Exception: F=F2=None
def shot(pg,path): pg.locator("#c").screenshot(path=path)
with sync_playwright() as p:
    b=p.chromium.launch(args=["--allow-file-access-from-files"]); pg=b.new_page(viewport={"width":1920,"height":1080}); errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("file://"+HERE+"/library.html"); pg.evaluate("window.ready")
    for n in POSES: pg.evaluate(f"drawPose({json.dumps(n)},{0.35 if n=='walk' else 2.0})"); shot(pg,f"{OUT}/raw/pose_{n}.png")
    pg.evaluate("drawPose('point',2.0,{outfit:'doctor'})"); shot(pg,f"{OUT}/raw/pose_doctor.png")
    pg.evaluate("drawPose('stand',2.0,{outfit:'alt'})"); shot(pg,f"{OUT}/raw/pose_alt.png")
    for f in FACES: pg.evaluate(f"drawFace({json.dumps(f)},2.0)"); shot(pg,f"{OUT}/raw/face_{f}.png")
    pg.goto("file://"+HERE+"/envs.html"); pg.evaluate("window.ready")
    for e in ENVS: pg.evaluate(f"drawEnv({json.dumps(e)},2.0)"); shot(pg,f"{OUT}/raw/env_{e}.png")
    pg.goto("file://"+HERE+"/icons.html"); pg.evaluate("window.ready"); pg.evaluate("drawIconGrid(1.3)"); shot(pg,f"{OUT}/raw/icons.png"); names=pg.evaluate("iconNames()")
    pg.goto("file://"+HERE+"/reel.html"); pg.evaluate("window.ready"); shots=pg.evaluate("EP.shots.map(s=>({kind:s.kind,t0:s.t0,t1:s.t1,env:s.env||'',outfit:s.outfit||''}))")
    for i,s in enumerate(shots): tt=s['t0']+(s['t1']-s['t0'])*0.6; pg.evaluate(f"draw({tt})"); shot(pg,f"{OUT}/raw/tpl_{i:02d}.png")
    print("ERRS",errs[:5]); b.close()
def grid(items,cols,cell,crop,title,out,label=lambda i,n:f"{i+1}. {n}"):
    cw,chh=cell; rows=(len(items)+cols-1)//cols; S=Image.new('RGB',(cw*cols,chh*rows+90),'#1F2A44'); d=ImageDraw.Draw(S); d.text((24,22),title,fill='#EDE6D6',font=F2)
    for i,(n,fn) in enumerate(items):
        im=Image.open(fn).crop(crop); im.thumbnail((cw-12,chh-48)); x=(i%cols)*cw+6; y=90+(i//cols)*chh+6; S.paste(im,(x,y)); d.text((x+4,y+im.height+6),label(i,n),fill='#EDE6D6',font=F)
    S.save(out); print(out,S.size)
grid([(n,f"{OUT}/raw/pose_{n}.png") for n in POSES+['doctor','alt']],4,(480,420),(300,60,1500,960),"A1 · Poses (library.js POSES) + outfits",OUT+"/A1 poses.png")
grid([(n,f"{OUT}/raw/face_{n}.png") for n in FACES],4,(480,440),(560,100,1360,800),"A2 · Expressions (rig.js drawHead)",OUT+"/A2 faces.png")
grid([(e,f"{OUT}/raw/env_{e}.png") for e in ENVS],3,(640,400),(0,0,1920,1080),"B1 · Environments (env/*.js)",OUT+"/B1 environments.png")
tpl=[(f"{s['kind']}{(' · '+s['env']) if s['env'] else ''}{(' · '+s['outfit']) if s['outfit'] else ''}",f"{OUT}/raw/tpl_{i:02d}.png") for i,s in enumerate(shots)]
grid(tpl,4,(480,310),(0,0,1920,1080),"B2 · Shot templates (templates.js) — one frame each from the library reel",OUT+"/B2 templates.png")
Image.open(f"{OUT}/raw/icons.png").save(OUT+"/C icons.png"); print(OUT+"/C icons.png", len(names), 'icons')
