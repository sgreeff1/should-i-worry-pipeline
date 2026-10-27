"""restyle.py — Servier Medical Art (CC BY 4.0) → the house colour code. Rebuilt 27 Oct 2026.
Each pixel is sorted into a semantic class by hue/saturation/lightness, the class map is cleaned of texture specks
(median), then painted flat in the palette. 4x upscale first so edges stay clean at 1080p. Credit stays on screen (gate 4.2).
usage: python3 restyle.py in.png out.png [--scale 4] [--body silhouette|bone|cord|organ|torso]
  silhouette: whole-body figure (skin → navy silhouette, no organs) · bone: skeletal/disc plates · cord: spinal cord section (white matter yellow, grey matter dark yellow)
  organ: a solid organ (kidney: parenchyma rose, collecting system ivory) · torso: figure with vessels/organs showing (skin → silhouette, vessels and organs kept)"""
import sys, colorsys, numpy as np
from PIL import Image, ImageFilter
IVORY=(0xE8,0xE0,0xD0); IVORY_D=(0xC8,0xC0,0xA8); DISC=(0x88,0xA8,0xC0); NERVE=(0xF0,0xC8,0x48); NERVE_D=(0xB8,0x8E,0x2A); OUT=(0x30,0x40,0x68)
SIL=(0x40,0x58,0x88); RED=(0xD9,0x53,0x4F); ORGAN=(0xE8,0x94,0x9F); ORGAN_D=(0xC4,0x6A,0x77); WHITE=(0xF4,0xF0,0xE6)
def classify(r,g,b,body):
    h,l,_=colorsys.rgb_to_hls(r/255,g/255,b/255); h*=360
    c=(max(r,g,b)-min(r,g,b))/255                    # chroma, not HLS saturation: pale colours have tiny chroma
    if body=='organ' and l<0.30 and c>0.25: return 'organ_d'   # the kidney's dark capsule
    if l<0.30: return 'out'
    if body=='cord' and c<0.16 and l<0.52: return 'grey'      # grey matter of the cord section
    if body=='torso' and c<0.10 and l>0.55: return 'sil'      # pale skin of a torso figure
    if c<0.10: return 'out'                          # greys, whites, pale membranes → the stage navy (as the old restyle did)
    if 330<=h or h<14:
        if c>0.40 and l<0.75: return 'red'            # vessels, blood
        return body if (l>0.70 and c<0.36) else 'organ'
    if 14<=h<34:
        if l>0.70 and c<0.36: return body            # skin and hair → silhouette (or bone, by flag)
        if body=='organ' and c>0.40: return 'pelvis'  # kidney collecting system (orange-tan)
        if c>0.60: return 'nerve'                    # orange = nerve roots
        return 'organ' if l<0.62 else 'bone'
    if 34<=h<70:
        if body=='organ' and h<50 and c>0.40: return 'pelvis'
        return 'nerve' if c>0.60 else 'bone'         # saturated yellow = nerve / cord; shaded creams = bone
    if 70<=h<170: return 'bone'
    if 170<=h<260: return 'disc'                     # blues = disc, cartilage, veins
    return 'organ'
PAINT={'out':OUT,'grey':NERVE_D,'pelvis':IVORY,'organ_d':ORGAN_D,'white':WHITE,'bone':IVORY,'nerve':NERVE,'disc':DISC,'red':RED,'organ':ORGAN,'sil':SIL,'bone_d':IVORY_D}
IDX={k:i for i,k in enumerate(PAINT)}
def restyle(src,dst,scale=4,body='sil',median=11):
    im=Image.open(src).convert('RGBA'); im=im.resize((im.width*scale,im.height*scale),Image.LANCZOS)
    a=np.array(im); H,W,_=a.shape; alpha=a[:,:,3]
    cls=np.zeros((H,W),np.uint8); cache={}
    rr,gg,bb=a[:,:,0]//6*6,a[:,:,1]//6*6,a[:,:,2]//6*6
    for y in range(H):
        for x in range(W):
            if alpha[y,x]<100: cls[y,x]=255; continue
            k=(rr[y,x],gg[y,x],bb[y,x])
            c=cache.get(k)
            if c is None:
                kls=classify(*k,body)
                if kls in ('cord','organ_mode','torso'): kls={'cord':'bone','torso':'sil'}.get(kls,'organ')
                if body=='sil' and kls in ('organ','red','white'): kls='sil'   # a silhouette figure has no organs: shaded skin edges stay in the silhouette
                if body=='cord' and kls=='bone': kls='nerve'                   # cord white matter is nervous tissue, not bone
                if body=='organ' and kls in ('bone','body','white'): kls='organ'  # a solid organ's pale shading is still organ
                if body=='torso' and kls in ('bone','white','torso'): kls='sil'
                c=IDX[kls]; cache[k]=c
            cls[y,x]=c
    # a flat background box in the source (anev_02/03) → transparent: flood the 'out' class from the image border
    from scipy import ndimage
    bgm=(cls==IDX['out']); lab,n=ndimage.label(bgm)
    if n:
        border=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
        for b in border: alpha=np.where(lab==b,0,alpha); cls[lab==b]=255
    # clean texture specks (spongy bone dots) with a median on the class map
    m=Image.fromarray(cls).filter(ImageFilter.MedianFilter(median)); cls=np.array(m)
    # internal dark lines are not house style: fill every interior 'out' pixel from the nearest coloured class
    OUTI=IDX['out']; interior=(cls==OUTI)
    if interior.any():
        filled=cls.copy()
        for k in ['nerve','grey','disc','red','organ','organ_d','pelvis','bone','sil','white']:   # priority: thin nerve roots first, so they are not swallowed
            mask=(cls==IDX[k]).astype(np.uint8)*255
            if not mask.any(): continue
            grown=np.array(Image.fromarray(mask).filter(ImageFilter.MaxFilter(21)))>0
            take=interior&grown&(filled==OUTI); filled[take]=IDX[k]
        cls=filled
    out=np.zeros((H,W,4),np.uint8)
    for k,i in IDX.items(): out[cls==i]=(*PAINT[k],255)
    out[:,:,3]=np.where(alpha<100,0,255); out[alpha<100,:3]=0
    # thin outline where the shape meets transparency: an edge the house style has
    edge=Image.fromarray(out[:,:,3]).filter(ImageFilter.MinFilter(5)); e=np.array(edge)
    rim=(out[:,:,3]==255)&(e<255); out[rim]=(*OUT,255)
    Image.fromarray(out).save(dst); return dst
if __name__=='__main__':
    args=sys.argv[1:]; scale=4; body='sil'
    if '--scale' in args: i=args.index('--scale'); scale=int(args[i+1]); del args[i:i+2]
    if '--body' in args: i=args.index('--body'); body={'silhouette':'sil','bone':'bone','cord':'cord','organ':'organ','torso':'torso'}[args[i+1]]; del args[i:i+2]
    print(restyle(args[0],args[1],scale,body))
