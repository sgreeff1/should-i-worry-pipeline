"""strips.py — frame strips of given shots from a rendered mp4, for QA. usage: python3 strips.py video.mp4 episodes/E01_segment.json outdir shotId [shotId…]"""
import sys, json, subprocess, os
from PIL import Image, ImageDraw, ImageFont
video, epj, outdir = sys.argv[1], sys.argv[2], sys.argv[3]; ids=[int(x) for x in sys.argv[4:]]
ep=json.load(open(epj)); os.makedirs(outdir, exist_ok=True)
try: font=ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-Bold.otf',26)
except Exception: font=None
for sid in ids:
    sh=[s for s in ep['shots'] if s['id']==sid][0]; t0,t1=sh['t0'],sh['t1']
    times=[round(t0+0.12+i*0.5,2) for i in range(int((t1-t0-0.12)/0.5)+1)]
    frames=[]
    for t in times:
        fn=f"{outdir}/s{sid}_{t:06.2f}.png"
        subprocess.run(["ffmpeg","-y","-loglevel","error","-ss",str(t),"-i",video,"-frames:v","1",fn],check=True); frames.append((t,fn))
    cols=4; W,Hh=640,360; rows=(len(frames)+cols-1)//cols
    sheet=Image.new('RGB',(W*cols,(Hh+34)*rows),'#121A2E'); d=ImageDraw.Draw(sheet)
    for i,(t,fn) in enumerate(frames):
        im=Image.open(fn).resize((W,Hh)); x,y=(i%cols)*W,(i//cols)*(Hh+34); sheet.paste(im,(x,y+34)); d.text((x+8,y+4),f"shot {sid} · t={t:.2f}s",fill='#EDE6D6',font=font)
    out=f"{outdir}/strip_shot{sid}.png"; sheet.save(out); print(out, sheet.size, len(frames),'frames')
