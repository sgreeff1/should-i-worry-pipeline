import sys, subprocess, time, os
from playwright.sync_api import sync_playwright
HERE=os.path.dirname(os.path.abspath(__file__))
EPJSON=os.environ.get("EP")
def open_page(p, page="scene.html"):
    b=p.chromium.launch(args=["--allow-file-access-from-files"]); pg=b.new_page(viewport={"width":1920,"height":1080})
    errs=[]; pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: errs.append(m.text) if m.type=="error" else None)
    if EPJSON: pg.add_init_script("window.EPDATA="+open(EPJSON).read())
    pg.goto("file://"+os.path.join(HERE,page)); pg.evaluate("window.ready"); return b,pg,errs
def stills(times,outdir,page="scene.html",mode=None):
    os.makedirs(outdir,exist_ok=True)
    with sync_playwright() as p:
        b,pg,errs=open_page(p,page)
        for t in times:
            pg.evaluate(f"draw({t}{','+repr(mode) if mode else ''})"); pg.locator("#c").screenshot(path=f"{outdir}/f_{t:06.2f}.png")
        print("ERRS",errs[:5]); b.close()
def video(out,dur,fps=25,blur=4,page="scene.html"):
    with sync_playwright() as p:
        b,pg,errs=open_page(p,page); n=int(round(dur*fps))
        ff=subprocess.Popen(["ffmpeg","-y","-loglevel","error","-f","image2pipe","-framerate",str(fps),"-i","-","-c:v","libx264","-preset","veryfast","-crf","18","-pix_fmt","yuv420p",out],stdin=subprocess.PIPE)
        t0=time.time()
        for i in range(n):
            t=i/fps
            pg.evaluate(f"drawBlur({t:.5f},{blur},{fps})" if blur else f"draw({t:.5f})")
            ff.stdin.write(pg.locator("#c").screenshot(type="jpeg",quality=95))
            if i%100==0: print(i,n,f"{time.time()-t0:.0f}s",flush=True)
        ff.stdin.close(); ff.wait(); b.close(); print("ERRS",errs[:5])
if __name__=="__main__":
    if sys.argv[1]=="stills": stills([float(x) for x in sys.argv[3:]], sys.argv[2], page=os.environ.get("PAGE","scene.html"))
    elif sys.argv[1]=="video": video(sys.argv[2], float(sys.argv[3]), blur=int(sys.argv[4]) if len(sys.argv)>4 else 4, page=os.environ.get("PAGE","scene.html"))
