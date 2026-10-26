// anims/hook.js — E01 hook performance, 0–12.52 s
const HOOK = (function(){
  const standX=W*0.40, sockX=standX+268, floor=H*0.84;
const K = {
  hx:   [[0,0],[1.50,0],[1.78,6,'io'],[3.90,-40,'io'],[4.40,-40],[4.51,-31,'snap'],[4.95,-35,'io'],
         [8.60,-35],[8.95,-30,'io'],[9.35,-36,'io'],[10.60,-36],[12.10,0,'io']],
  hy:   [[0,0],[1.50,0],[1.78,-3,'io'],[3.90,16,'io'],[4.40,16],[4.51,9,'snap'],[4.95,12,'io'],
         [8.60,12],[8.95,9,'io'],[9.35,13,'io'],[10.60,13],[12.10,0,'io']],
  spine:[[0,3],[1.50,3],[1.80,-4,'io'],[3.95,74,'io'],[4.40,74],[4.51,62,'snap'],[4.95,67,'io'],
         [8.60,67],[8.95,60,'io'],[9.35,68,'io'],[10.60,68],[12.15,2,'io'],[12.52,2]],
  // head tilt relative to the spine; + looks down toward the floor
  head: [[0,12],[1.50,12],[1.80,17,'io'],[3.95,24,'io'],[4.40,24],[4.54,0,'snap'],[4.98,8,'io'],
         [7.90,8],[8.35,20,'io'],[8.95,22],[9.30,6,'snap'],[9.80,18,'io'],[10.60,18],[11.40,-4,'io'],[12.15,2,'io']],
  pain: [[0,0],[4.40,0],[4.50,1,'snap'],[10.80,1],[11.60,0,'io']],
  // shoulder shrug (px, negative = up); a relieved breath at the end
  shrug:[[0,0],[4.40,0],[4.50,-11,'snap'],[5.1,-5,'io'],[10.6,-5],[11.4,0,'io'],[12.0,0],[12.18,-8,'io'],[12.5,0,'io']],
};
// arm states: [startTime, state, transitionDuration, ease]
const ARM_NEAR = [[0,'hang',0,'io'],[1.85,'reach',2.0,'io'],[4.47,'back',0.38,'swing'],[11.75,'hang',0.75,'io']];
const ARM_FAR  = [[0,'hang',0,'io'],[4.52,'knee',0.46,'swing'],[11.0,'hang',0.8,'io']];
const FACE = [[0,'calm'],[1.8,'focus'],[4.42,'ouch'],[7.95,'peek'],[9.00,'ouch'],[9.55,'peek'],[10.95,'relief']];
const BLINKS = [0.62,1.30,11.95];       // start times of 0.11 s blinks (only in calm/focus/relief)
const SWEAT = [[5.0,6.6],[8.9,10.0]];   // sweat drop slides

function idle(t){ // breathing + micro sway
  return { spine:0.7*Math.sin(t*2*Math.PI/3.4), hy:1.6*Math.sin(t*2*Math.PI/3.4+0.4), head:1.1*Math.sin(t*2*Math.PI/3.4+1.1) };
}
function tremble(t){ // the "locked" shake: sharp decaying burst, then a faint effort tremor
  let a=0;
  if(t>=4.40) a += 1.6*Math.exp(-(t-4.40)/0.85)*Math.sin((t-4.40)*2*Math.PI*13);
  if(t>=4.9 && t<10.9) a += 0.35*(0.6+0.4*Math.sin(t*1.3))*Math.sin(t*2*Math.PI*9);
  if(t>=8.95 && t<9.40) a += 1.0*Math.sin((t-8.95)*2*Math.PI*15)*Math.exp(-(t-8.95)/0.25);
  if(t>=10.6) a += 0.45*Math.exp(-(t-10.6)/1.4)*Math.sin(t*2*Math.PI*8);
  return a;
}

// Resolve the full pose for time t (world coordinates).
  return {K,ARM_NEAR,ARM_FAR,FACE,BLINKS,SWEAT,idle,tremble,standX,sockX,floor,end:12.52};
})();
HOOK.SHOTS = [
  { t0:0.00,  t1:1.30,  w:t=>[W*0.50,H*0.60],                                                     z:[1.00,1.03], s:[W*0.50,H*0.50] },  // wide: the room
  { t0:1.30,  t1:4.40,  w:t=>{ const q=pose(HOOK,Math.max(0,t-0.12)); return [lerp(q.sx,q.cx,0.5)+70, lerp(q.sy,q.cy,0.5)+90]; }, z:[1.30,1.55], s:[W*0.50,H*0.50] },  // medium: follows him down
  { t0:4.40,  t1:5.60,  w:t=>{ const q=pose(HOOK,4.40); return [q.lbx+40,q.lby+20]; },                  z:[2.05,2.15], s:[W*0.50,H*0.52] },  // close-up: the back locks
  { t0:5.60,  t1:7.36,  w:t=>{ const q=pose(HOOK,5.60); return [q.cx-10,q.cy+20]; },                    z:[2.45,2.55], s:[W*0.52,H*0.50] },  // close-up: the face
  { t0:7.36,  t1:10.38, w:t=>[HOOK.standX+80,H*0.60],                                                 z:[1.22,1.30], s:[W*0.50,H*0.50] },  // medium-wide: stuck
  { t0:10.38, t1:12.60, w:t=>[W*0.50,H*0.60],                                                     z:[1.04,0.985],s:[W*0.50,H*0.50] },  // wide: stands up
];
