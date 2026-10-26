"""soundmark.py — the channel's sound mark, synthesised in code (licence-clean). Writes audio/soundmark.wav (48 kHz stereo, ~2.2 s).
Design: three soft rising notes (C5 E5 G5) on a warm sine+triangle voice with a short pluck, a low felt 'thump' as the needle settles,
and a faint shimmer on the final note. Peaks ≈ −6 dBFS. usage: python3 soundmark.py [variant]  (variant 'a' = rising, 'b' = rise-then-settle)"""
import numpy as np, os, sys, wave
SR=48000; variant=sys.argv[1] if len(sys.argv)>1 else 'a'
def env(n,a,d,s,r,sus_level=0.35):
    t=np.arange(n)/SR; e=np.ones(n)*sus_level
    A=int(a*SR); D=int(d*SR); R=int(r*SR)
    e[:A]=np.linspace(0,1,A); e[A:A+D]=np.linspace(1,sus_level,D); e[-R:]*=np.linspace(1,0,R); return e
def voice(freq,dur,vel=1.0):
    n=int(dur*SR); t=np.arange(n)/SR
    sine=np.sin(2*np.pi*freq*t); tri=2*np.abs(2*((t*freq)%1)-1)-1; oct=np.sin(2*np.pi*freq*2*t)*0.18
    tone=(0.7*sine+0.25*tri+oct)*env(n,0.012,0.18,0.35,0.6)*vel
    pluck=np.sin(2*np.pi*freq*3*t)*np.exp(-t*28)*0.12     # a little attack transient
    return tone+pluck
def thump(dur=0.5):
    n=int(dur*SR); t=np.arange(n)/SR; f=np.linspace(110,62,n); return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*9)*0.55
def place(buf,sig,at):
    i=int(at*SR); j=min(len(buf),i+len(sig)); buf[i:j]+=sig[:j-i]
total=2.3; L=np.zeros(int(total*SR)); R=np.zeros(int(total*SR))
notes=[(523.25,0.00),(659.25,0.17),(783.99,0.34)] if variant=='a' else [(523.25,0.00),(783.99,0.17),(659.25,0.42)]
for k,(f,at) in enumerate(notes):
    v=voice(f,1.3 if k<2 else 1.7,0.8+0.1*k); pan=0.4+0.2*k   # drift gently left→right
    place(L,v*(1-pan),at); place(R,v*pan,at)
th=thump(); place(L,th*0.5,0.95); place(R,th*0.5,0.95)        # the needle settles
sh_t=np.arange(int(1.2*SR))/SR; shimmer=np.sin(2*np.pi*1567.98*sh_t)*np.exp(-sh_t*2.2)*0.05*(0.5+0.5*np.sin(2*np.pi*6*sh_t))
place(L,shimmer,0.5); place(R,shimmer*0.8,0.5)
mix=np.stack([L,R],1); mix/=np.max(np.abs(mix)); mix*=0.5     # peak −6 dBFS
os.makedirs('audio',exist_ok=True); out=f'audio/soundmark_{variant}.wav'
with wave.open(out,'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype('<i2').tobytes())
print(out, f'{total}s')
