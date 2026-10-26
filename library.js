// library.js — named poses, expressions and the poseAnim builder. New acting = sequences of these.
const POSES = {
  //            hx   hy  spine head shrug  armNear  armFar   face
  stand:      { hx:0,  hy:0,  spine:3,  head:4,  shrug:0,  near:'hang',  far:'hang' },
  lookDown:   { hx:0,  hy:0,  spine:3,  head:14, shrug:0,  near:'hang',  far:'hang' },
  bend:       { hx:-36,hy:16, spine:74, head:24, shrug:0,  near:'reach', far:'hang' },
  locked:     { hx:-33,hy:13, spine:67, head:8,  shrug:-5, near:'back',  far:'knee' },
  point:      { hx:0,  hy:0,  spine:-2, head:-4, shrug:0,  near:'point', far:'hang' },
  shrug:      { hx:0,  hy:0,  spine:-3, head:-2, shrug:-14,near:'open',  far:'open' },
  think:      { hx:0,  hy:0,  spine:2,  head:-6, shrug:0,  near:'chin',  far:'hip' },
  phone:      { hx:0,  hy:0,  spine:1,  head:2,  shrug:0,  near:'ear',   far:'hang' },
  wave:       { hx:0,  hy:0,  spine:-2, head:-4, shrug:-4, near:'wave',  far:'hang' },
  handsOnHips:{ hx:0,  hy:0,  spine:-4, head:-3, shrug:0,  near:'hip',   far:'hip' },
  sit:        { hx:0,  hy:98, spine:-6, head:4,  shrug:0,  near:'lap',   far:'lap',  feet:'sit' },
  lie:        { hx:0,  hy:40, spine:0,  head:-6, shrug:0,  near:'belly', far:'belly',feet:'lie', rot:-Math.PI/2 },
  walk:       { hx:0,  hy:0,  spine:4,  head:2,  shrug:0,  near:'swing', far:'swing', walk:true },
  backPain:   { hx:-14,hy:4,  spine:24, head:-6, shrug:-4, near:'back',  far:'back' },
};
const FEET = {
  sit: (t,b)=>[[b.standX+150, b.floor-BODY.footH/2],[b.standX+118, b.floor-BODY.footH/2]],
  lie: (t,b)=>[[b.hx+40, b.hy+BODY.thigh+BODY.shin-30],[b.hx+10, b.hy+BODY.thigh+BODY.shin-30]],
};
function walkCycle(stepsPerSec=1.7, stride=64, lift=30){
  return (t)=>{ const ph=t*2*Math.PI*stepsPerSec; const f=(p,sx,fl)=>[sx-stride*Math.cos(p), fl-BODY.footH/2-lift*Math.max(0,Math.sin(p))];
    return {phase:ph, fN:f(ph,WALK_BASE.standX+8,WALK_BASE.floor), fF:f(ph+Math.PI,WALK_BASE.standX-8,WALK_BASE.floor), bob:-5*Math.abs(Math.sin(ph))}; };
}
let WALK_BASE={standX:W*0.40, floor:H*0.84};

// Build an animation object from a sequence of [time, poseName, transitionSeconds?, ease?].
// Arm states change at the pose time with a swing; faces from a separate [time,name] list.
function poseAnim(seq, opts={}){
  const standX=opts.standX??W*0.40, floor=opts.floor??H*0.84, sockX=opts.sockX??standX+268, end=opts.end??(seq[seq.length-1][0]+2);
  const chans={hx:[],hy:[],spine:[],head:[],shrug:[]};
  let feetMode=null, rot=null, walk=null;
  seq.forEach(([t,name,dur=0.6,e='io'],i)=>{
    const P=POSES[name]; if(!P) throw new Error('unknown pose '+name);
    for(const c of Object.keys(chans)){ if(i>0) chans[c].push([t,P[c],e]); else chans[c].push([t,P[c]]); if(i>0 && dur>0){ /* arrive at t+dur */ chans[c][chans[c].length-1][0]=t+dur; chans[c].splice(chans[c].length-1,0,[t,seq[i-1]?POSES[seq[i-1][1]][c]:P[c]]); } }
    if(P.feet) feetMode=P.feet; if(P.rot!=null) rot=P.rot; if(P.walk) walk=true;
  });
  const armN=seq.map(([t,n,dur=0.6])=>[t,POSES[n].near,dur,'swing']); armN[0][2]=0;
  const armF=seq.map(([t,n,dur=0.6])=>[t,POSES[n].far,dur,'swing']);  armF[0][2]=0;
  WALK_BASE={standX,floor};
  return {
    K:chans, ARM_NEAR:armN, ARM_FAR:armF, FACE:opts.face||[[0,'calm']], BLINKS:opts.blinks||[1.1,3.4,6.2,8.9,11.5], SWEAT:opts.sweat||[],
    idle:opts.idle||(t=>({ spine:0.7*Math.sin(t*2*Math.PI/3.4), hy:1.6*Math.sin(t*2*Math.PI/3.4+0.4), head:1.1*Math.sin(t*2*Math.PI/3.4+1.1) })),
    tremble:opts.tremble||(t=>0), standX, sockX, floor, end,
    feet: feetMode? FEET[feetMode] : null, rot: rot!=null? (t=>rot) : null, walk: walk? walkCycle() : null, outfit:opts.outfit||'default',
  };
}
// A static pose as an animation (for sheets and FIGURE shots)
function staticPose(name, opts={}){ return poseAnim([[0,name]], Object.assign({end:30}, opts)); }
