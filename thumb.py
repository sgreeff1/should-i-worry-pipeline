"""thumb.py — add the thumbnail words to an AI base image (gate 7.2: 2–4 words, legible at phone size).
usage: python3 thumb.py base.png out.png ["WHEN BACK PAIN KILLS"] [--pos left|right|bottom]
Inter 800, ivory with a navy outline and a soft navy plate; output 1280×720 (YouTube's thumbnail size)."""
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
args=sys.argv[1:]; pos='left'
if '--pos' in args: i=args.index('--pos'); pos=args[i+1]; del args[i:i+2]
src,dst=args[0],args[1]; text=args[2] if len(args)>2 else 'WHEN BACK PAIN KILLS'
W,H=1280,720; im=Image.open(src).convert('RGB')
s=max(W/im.width,H/im.height); im=im.resize((round(im.width*s),round(im.height*s)),Image.LANCZOS); im=im.crop(((im.width-W)//2,(im.height-H)//2,(im.width-W)//2+W,(im.height-H)//2+H))
font=None
for f in ['/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf','/usr/share/fonts/opentype/inter/Inter-Bold.otf','/root/.fonts/Inter-ExtraBold.ttf','/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf']:
    try: font=ImageFont.truetype(f,112); break
    except OSError: pass
words=text.split(); lines=[' '.join(words[:2]),' '.join(words[2:])] if len(words)>2 else [text]
d=ImageDraw.Draw(im); lh=120; tw=max(d.textlength(l,font=font) for l in lines); th=lh*len(lines)
x=70 if pos=='left' else (W-tw-70 if pos=='right' else (W-tw)/2); y=H-th-70 if pos!='bottom' else H-th-60
plate=Image.new('RGBA',(W,H),(0,0,0,0)); pd=ImageDraw.Draw(plate); pd.rounded_rectangle([x-36,y-24,x+tw+36,y+th+10],radius=28,fill=(18,26,46,170)); plate=plate.filter(ImageFilter.GaussianBlur(6))
im=Image.alpha_composite(im.convert('RGBA'),plate); d=ImageDraw.Draw(im)
for i,l in enumerate(lines):
    yy=y+i*lh; d.text((x,yy),l,font=font,fill=(237,230,214),stroke_width=8,stroke_fill=(18,26,46))
    if i==len(lines)-1 and 'KILLS' in l:  # the last word in red (fire)
        pre=l[:l.index('KILLS')]; px=x+d.textlength(pre,font=font); d.text((px,yy),'KILLS',font=font,fill=(235,87,87),stroke_width=8,stroke_fill=(18,26,46))
im.convert('RGB').save(dst,quality=92); print('wrote',dst,im.size)
