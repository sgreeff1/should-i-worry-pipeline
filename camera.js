// camera.js — shot-list camera with cuts, eased moves, tracking and shake
function shake(A,t){ // decaying shake at the lock, a smaller one at the failed attempt
  let a=0, k=t-4.40; if(k>=0) a+=16*Math.exp(-k/0.32);
  k=t-8.95; if(k>=0) a+=6*Math.exp(-k/0.25);
  return [a*noise(t*40,1), a*noise(t*40,7)];
}
function camera(A,t){
  const SHOTS=A.SHOTS, END=A.end; let sh=SHOTS.find(x=>t>=x.t0 && t<x.t1) || SHOTS[SHOTS.length-1];
  const k=EASE.io(clamp((t-sh.t0)/(sh.t1-sh.t0)));
  const z=lerp(sh.z[0],sh.z[1],k); const [wx,wy]=sh.w(t); const [sx,sy]=sh.s; const [dx,dy]=shake(A,t);
  const drift=-12+24*EASE.io(clamp(t/END));
  return { z, wx, wy, sx:sx+dx, sy:sy+dy, drift };
}
function layer(ctx,cam,depth,fn){
  ctx.save(); ctx.translate(cam.sx,cam.sy); ctx.scale(cam.z,cam.z); ctx.translate(-cam.wx+cam.drift*(1-depth)*0.6,-cam.wy); fn(); ctx.restore();
}
