"""musicbed.py — the channel's music bed, synthesised in code (Decision: licence-clean, identical every episode).
Design: one four-chord progression in C (C - Am - F - G), 8 s a chord, looped to any length. A warm detuned pad
carries it, a soft sub marks the root, a quiet bell marks each chord change, and a slow breath shapes the whole.
Same key and motif as the sound mark (C5 E5 G5), so ident and bed belong to each other.
usage: python3 musicbed.py <seconds> [out.wav]     (default audio/musicbed.wav, 48 kHz stereo, peak -18 dBFS)"""
import numpy as np, os, sys, wave
SR=48000
DUR=float(sys.argv[1]) if len(sys.argv)>1 else 60.0
OUT=sys.argv[2] if len(sys.argv)>2 else 'audio/musicbed.wav'
CHORD_S=8.0
# C major family: root, third, fifth (+ the ninth on G for a little lift). Low register so it sits under a voice.
CHORDS=[[130.81,164.81,196.00],      # C3  E3  G3
        [146.83,174.61,220.00],      # D3  F3  A3   (Am/9 voicing - moves by step, stays calm)
        [174.61,220.00,261.63],      # F3  A3  C4
        [196.00,246.94,293.66]]      # G3  B3  D4
def smooth(x, hz):                   # one-pole low-pass: takes the edge off every voice
    a=np.exp(-2*np.pi*hz/SR); y=np.zeros_like(x); c=0.0
    for i in range(len(x)): c=a*c+(1-a)*x[i]; y[i]=c
    return y
def pad(freqs, n, seed):             # three detuned sines per note + a quiet octave, slowly phasing
    t=np.arange(n)/SR; out=np.zeros(n)
    for k,f in enumerate(freqs):
        for d,amp in ((0.0,1.0),(-0.12,0.6),(0.12,0.6)):
            drift=0.03*np.sin(2*np.pi*(0.03+0.011*k)*t+seed+d*7)
            out+=amp*np.sin(2*np.pi*(f+d+drift)*t)
        out+=0.18*np.sin(2*np.pi*f*2*t+seed)
    return out/ (len(freqs)*2.4)
def bell(f, n):                      # a soft struck note at each chord change
    t=np.arange(n)/SR
    return (np.sin(2*np.pi*f*t)+0.3*np.sin(2*np.pi*f*2.01*t)+0.12*np.sin(2*np.pi*f*3.02*t))*np.exp(-t*2.2)
nTotal=int(DUR*SR); L=np.zeros(nTotal); R=np.zeros(nTotal)
nChord=int(CHORD_S*SR); xf=int(1.6*SR)                     # chords cross-fade into each other
i=0; c=0
while i<nTotal:
    n=min(nChord+xf, nTotal-i); f=CHORDS[c%4]
    v=pad(f,n,c*1.7)
    env=np.ones(n); a=min(xf,n); env[:a]=np.linspace(0,1,a)**0.6
    if i+n<nTotal: env[-a:]*=np.linspace(1,0,a)**0.6
    v=v*env
    sub=np.sin(2*np.pi*(f[0]/2)*np.arange(n)/SR)*env*0.28   # sub an octave below the root
    b=np.zeros(n); bn=min(int(3.0*SR),n); b[:bn]=bell(f[0]*4,bn)*0.07
    # the pulse: a soft rounded tick on the root every 2 s, felt more than heard
    pt=np.arange(int(0.35*SR))/SR; tick=np.sin(2*np.pi*f[0]*2*pt)*np.exp(-pt*14)*(1-np.exp(-pt*400))
    for k in range(0, n, int(2.0*SR)):
        m=min(len(tick), n-k); b[k:k+m]+=tick[:m]*0.10*env[k]
    # a touch of stereo: the pad leans, the sub and bell stay centred
    lean=0.5+0.12*np.sin(2*np.pi*0.02*np.arange(n)/SR+c)
    L[i:i+n]+=v*(1-lean)+sub*0.5+b*0.5; R[i:i+n]+=v*lean+sub*0.5+b*0.5
    i+=nChord; c+=1
L=smooth(L,900); R=smooth(R,900)                            # warm, no top end to fight the voice
t=np.arange(nTotal)/SR
breath=0.86+0.14*np.sin(2*np.pi*t/23.0)                     # a slow swell, far longer than any sentence
fade=np.ones(nTotal); fi=int(2.0*SR); fo=int(2.5*SR)        # 2 s in, 2.5 s out (Style Bible)
fade[:fi]=np.linspace(0,1,fi); fade[-fo:]=np.linspace(1,0,fo)
mix=np.stack([L*breath*fade, R*breath*fade],1)
mix/=max(1e-9,np.max(np.abs(mix))); mix*=0.089              # peak about -21 dBFS (3 dB lower than v1: 'slightly too present'); the mix ducks it further
os.makedirs(os.path.dirname(OUT) or '.',exist_ok=True)
with wave.open(OUT,'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype('<i2').tobytes())
print(OUT, f'{DUR:.1f}s')
