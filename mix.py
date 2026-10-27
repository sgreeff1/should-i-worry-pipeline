"""mix.py — the episode's sound (Decision #39): voice + card pops (quiet) + code-synthesised music bed under the hook and the recap
(sidechain-ducked by the voice; bed sits ~13 dB under the raw voice, the level approved on the bed demo v2, 27 Oct) + the sound mark under the opening ident. Two-pass loudnorm to −14 LUFS / −1.5 dBTP. Then mux.
usage: python3 mix.py episodes/E01.json vo/E01_VO_Julian.wav out/E01/video.mp4 out/E01/E01.mp4
Bed windows are read from ep['bed'] = [[t0,t1],...] (seconds, programme time); default: ident+hook to the first chapter, and the recap."""
import sys, json, subprocess, numpy as np, os
from scipy.io import wavfile
ep=json.load(open(sys.argv[1])); VO=sys.argv[2]; VIDEO=sys.argv[3]; OUT=sys.argv[4]
SR=48000; DUR=float(ep['duration']); OFF=float(ep.get('voOffset',0)); W='out/E01/_mix'; os.makedirs(W,exist_ok=True)
def run(*a): subprocess.run(a,check=True)
# 1. card pops: a short soft blip at every card start, −12 dB from the first tests (QA 25 Oct)
pops=np.zeros(int(DUR*SR)+SR,np.float32); n=int(0.09*SR); t=np.arange(n)/SR
blip=(np.sin(2*np.pi*880*t)*0.6+np.sin(2*np.pi*1320*t)*0.4)*np.exp(-t*55)*0.11
for text,a,b in ep['cards']: i=int(a*SR); pops[i:i+n]+=blip
wavfile.write(f'{W}/pops.wav',SR,pops)
# 2. music bed: synthesised by musicbed.py for the full length, then gated to the bed windows with 2 s in / 2.5 s out
run('python3','musicbed.py',str(DUR+2),f'{W}/bed_full.wav')
sr,bed=wavfile.read(f'{W}/bed_full.wav'); bed=bed.astype(np.float32)/(32768 if bed.dtype==np.int16 else 1)
if bed.ndim>1: bed=bed.mean(1)
wins=ep.get('bed') or [[0.0, next(s['t0'] for s in ep['shots'] if s['kind']=='ANATOMY')], [next(s['t0'] for s in ep['shots'] if str(s['id'])=='83'), DUR]]
env=np.zeros_like(bed); tt=np.arange(len(bed))/sr
for a,b in wins: env=np.maximum(env, np.clip((tt-a)/2.0,0,1)*np.clip((b-tt)/2.5,0,1))
wavfile.write(f'{W}/bed.wav',sr,(bed*env).astype(np.float32)); print('bed windows',wins)
# 3. voice at the ident offset, sound mark at 0, mix with sidechain duck, two-pass loudnorm
mark='audio/soundmark_a.wav'
filt=(f"[0:a]adelay={int(OFF*1000)}|{int(OFF*1000)},aformat=channel_layouts=mono,volume=6dB[vo];"
      f"[1:a]aformat=channel_layouts=mono,volume=3dB[bedraw];[vo]asplit[vo1][vo2];"
      f"[bedraw][vo2]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=400[bed];"
      f"[2:a]aformat=channel_layouts=mono[pops];[3:a]aformat=channel_layouts=mono,volume=-4dB[mark];"
      f"[vo1][bed][pops][mark]amix=inputs=4:normalize=0:duration=longest[mix]")
run('ffmpeg','-y','-loglevel','error','-i',VO,'-i',f'{W}/bed.wav','-i',f'{W}/pops.wav','-i',mark,'-filter_complex',filt,'-map','[mix]','-t',str(DUR),'-ar','48000',f'{W}/mix_raw.wav')
m=subprocess.run(['ffmpeg','-i',f'{W}/mix_raw.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=7:print_format=json','-f','null','-'],capture_output=True,text=True).stderr
js=json.loads(m[m.rfind('{'):m.rfind('}')+1])
ln=(f"loudnorm=I=-14:TP=-1.5:LRA=7:measured_I={js['input_i']}:measured_TP={js['input_tp']}:measured_LRA={js['input_lra']}:measured_thresh={js['input_thresh']}:offset={js['target_offset']}:linear=true")
run('ffmpeg','-y','-loglevel','error','-i',f'{W}/mix_raw.wav','-af',ln,'-ar','48000',f'{W}/mix.wav')
run('ffmpeg','-y','-loglevel','error','-i',VIDEO,'-i',f'{W}/mix.wav','-c:v','copy','-c:a','aac','-b:a','192k','-shortest',OUT)
print('wrote',OUT)
