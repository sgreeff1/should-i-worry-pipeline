"""cast_sheet.py — checkpoint A: the five cast members (Decision #45) in four pose/face pairs each. usage: python3 cast_sheet.py outdir"""
import os, sys, json
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
HERE=os.path.dirname(os.path.abspath(__file__)); OUT=sys.argv[1] if len(sys.argv)>1 else HERE+'/check/cast'; os.makedirs(OUT+'/raw',exist_ok=True)
CAST=['lead','woman','older','child','doctor']
CELLS=[('stand','calm'),('point','talking'),('backPain','worried'),('sit','happy')]
try: F=ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-Bold.otf',30); F2=ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-Bold.otf',44)
except Exception: F=F2=None
with sync_playwright() as p:
    b=p.chromium.launch(args=["--allow-file-access-from-files"]); pg=b.new_page(viewport={"width":1920,"height":1080}); errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("file://"+HERE+"/library.html"); pg.evaluate("window.ready")
    for c in CAST:
        for (po,fa) in CELLS:
            pg.evaluate(f"drawPose({json.dumps(po)},2.0,{{outfit:{json.dumps(c)},face:[[0,{json.dumps(fa)}]]}})"); pg.locator("#c").screenshot(path=f"{OUT}/raw/{c}_{po}.png")
    print("ERRS",errs[:5]); b.close()
cw,chh=470,430; S=Image.new('RGB',(cw*4+120,chh*5+100),'#1F2A44'); d=ImageDraw.Draw(S); d.text((24,22),"Checkpoint A · the cast (Decision #45) — lead, woman, older person, child, doctor",fill='#EDE6D6',font=F2)
for r,c in enumerate(CAST):
    d.text((16,100+r*chh+chh//2-16),c,fill='#F2994A',font=F)
    for k,(po,fa) in enumerate(CELLS):
        im=Image.open(f"{OUT}/raw/{c}_{po}.png").crop((420,60,1380,960)); im.thumbnail((cw-12,chh-40)); x=120+k*cw+6; y=100+r*chh+4; S.paste(im,(x,y)); d.text((x+4,y+im.height+4),f"{po} · {fa}",fill='#CFC6B2',font=F)
S.save(OUT+"/Checkpoint A – cast sheet.png"); print(OUT+"/Checkpoint A – cast sheet.png", S.size)
