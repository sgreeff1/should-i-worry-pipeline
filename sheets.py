import os, json
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw
HERE=os.path.dirname(os.path.abspath(__file__)); os.makedirs(HERE+'/check/lib',exist_ok=True)
POSES=['stand','lookDown','bend','locked','point','shrug','think','phone','wave','handsOnHips','sit','lie','walk']
FACES=['calm','focus','worried','ouch','relief','surprise','thinking','talking','happy','tired','peek']
with sync_playwright() as p:
    b=p.chromium.launch(args=["--allow-file-access-from-files"]); pg=b.new_page(viewport={"width":1920,"height":1080})
    errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("file://"+HERE+"/library.html"); pg.evaluate("window.ready")
    for n in POSES:
        t = 0.35 if n=='walk' else 2.0
        pg.evaluate(f"drawPose({json.dumps(n)},{t})"); pg.locator("#c").screenshot(path=f"{HERE}/check/lib/pose_{n}.png")
    for f in FACES:
        pg.evaluate(f"drawFace({json.dumps(f)},2.0)"); pg.locator("#c").screenshot(path=f"{HERE}/check/lib/face_{f}.png")
    pg.evaluate("drawPose('point',2.0,{outfit:'doctor'})"); pg.locator("#c").screenshot(path=f"{HERE}/check/lib/pose_doctor.png")
    pg.evaluate("drawPose('stand',2.0,{outfit:'alt'})"); pg.locator("#c").screenshot(path=f"{HERE}/check/lib/pose_alt.png")
    print("ERRS",errs[:5]); b.close()
def sheet(names,prefix,out,crop,cols,cell):
    W,Hh=cell; rows=(len(names)+cols-1)//cols; s=Image.new('RGB',(W*cols,Hh*rows),'#1F2A44'); d=ImageDraw.Draw(s)
    for i,n in enumerate(names):
        im=Image.open(f"{HERE}/check/lib/{prefix}_{n}.png").crop(crop); im.thumbnail((W-10,Hh-10)); s.paste(im,((i%cols)*W+5,(i//cols)*Hh+5))
    s.save(out); print(out, s.size)
sheet(POSES+['doctor','alt'],'pose',HERE+'/check/pose_sheet.png',(300,60,1500,960),5,(420,330))
sheet(FACES,'face',HERE+'/check/face_sheet.png',(560,100,1360,800),4,(400,360))
