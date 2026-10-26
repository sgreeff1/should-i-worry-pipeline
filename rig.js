// rig.js — the character: skeleton, pose solver, two-pass seamless drawing
const BODY = { thigh:96, shin:92, torso:222, neck:12, headR:108, uarm:122, farm:116, hand:31, armU:192,
               torsoW:150, shoulderR:46, legW:64, armW:58, footW:132, footH:44 };
function pose(A,t){
  const K=A.K, FLOOR=A.floor, STAND_X=A.standX; const id=A.idle(t), tr=A.tremble(t);
  const hx = STAND_X - 6 + ch(K.hx,t) + tr*0.8;
  const hy = FLOOR - 206 + ch(K.hy,t) + id.hy + Math.abs(tr)*0.6;
  const walk = A.walk ? A.walk(t) : null;
  const spine = (ch(K.spine,t) + id.spine + tr) * D2R;
  const headRel = (ch(K.head, t-0.09) + id.head) * D2R;          // head lags the spine
  const shrug = ch(K.shrug,t);
  // torso axis: from hips, rotated forward by `spine` from vertical
  const ux=Math.sin(spine), uy=-Math.cos(spine);               // unit vector up the spine
  const sx = hx + ux*BODY.torso, sy = hy + uy*BODY.torso + shrug;   // shoulders
  const nx = hx + ux*(BODY.torso+BODY.neck), ny = hy + uy*(BODY.torso+BODY.neck) + shrug;
  const hdir = spine + headRel;                                 // head facing rotation
  const cx = nx + Math.sin(hdir)*BODY.headR*0.78, cy = ny - Math.cos(hdir)*BODY.headR*0.78;  // head centre
  // lower-back point (behind the spine, a quarter of the way up)
  const px=-uy, py=ux;                                          // perpendicular (points forward)
  const ax = hx + ux*BODY.armU - px*6, ay = hy + uy*BODY.armU - py*6 + shrug;   // shoulder joint
  const lbx = hx + ux*BODY.torso*0.30 - px*BODY.torsoW*0.40, lby = hy + uy*BODY.torso*0.30 - py*BODY.torsoW*0.40;
  // legs: feet planted
  let fN=[STAND_X+22, FLOOR-BODY.footH/2], fF=[STAND_X-24, FLOOR-BODY.footH/2];
  if(A.feet){ [fN,fF]=A.feet(t,{hx,hy,standX:STAND_X,floor:FLOOR}); }
  if(walk){ fN=walk.fN; fF=walk.fF; }
  const kN=ik(hx,hy,fN[0],fN[1]-10,BODY.thigh,BODY.shin,-1), kF=ik(hx+6,hy,fF[0],fF[1]-10,BODY.thigh,BODY.shin,-1);
  const kneeNear=[kN[0],kN[1]];
  return {A,t,hx,hy,spine,ux,uy,px,py,sx,sy,ax,ay,nx,ny,cx,cy,hdir,lbx,lby,fN,fF,kN,kF,kneeNear, walk, pain:K.pain?ch(K.pain,t):0, rot:A.rot?A.rot(t):0, outfit:A.outfit||'default'};
}
// Arm targets, evaluated against the current pose so they move with the body.
function armTarget(state, p, side){
  const L=BODY.uarm+BODY.farm;
  const s = side==='near' ? [p.ax+p.px*8, p.ay+p.py*8] : [p.ax-p.px*8, p.ay-p.py*8];
  switch(state){
    case 'hang':  return [s[0]-p.px*8, s[1]+L*0.95];
    case 'reach': return [p.A.sockX-6, p.A.floor-30];
    case 'back':  { const rub=(p.t>5.0&&p.t<10.6)? Math.sin(p.t*2*Math.PI*1.3)*9 : 0; return [p.lbx-8+p.ux*rub, p.lby+2+p.uy*rub]; }
    case 'knee':  return [p.kneeNear[0]+22, p.kneeNear[1]-14];
    case 'point': return [s[0]+p.px*L*0.92+p.ux*L*0.25, s[1]+p.py*L*0.92+p.uy*L*0.25];          // forward, slightly up
    case 'wave':  return [s[0]+p.px*L*0.35+p.ux*L*0.85, s[1]+p.py*L*0.35+p.uy*L*0.85];          // up
    case 'chin':  return [p.cx+Math.sin(p.hdir)*BODY.headR*0.2-Math.cos(p.hdir)*BODY.headR*1.05*-1*0+p.px*BODY.headR*0.15, p.cy+Math.cos(p.hdir)*BODY.headR*1.02];   // under the chin
    case 'hip':   return [p.hx+p.px*BODY.torsoW*0.42, p.hy+p.uy*10];                                // hand on hip
    case 'ear':   return [p.cx+p.px*BODY.headR*0.15, p.cy+Math.cos(p.hdir)*BODY.headR*0.1+10];     // phone to the ear
    case 'lap':   return [p.kneeNear[0]-20, p.kneeNear[1]-26];                                     // resting on the thigh
    case 'belly': return [p.hx+p.ux*BODY.torso*0.45+p.px*BODY.torsoW*0.5, p.hy+p.uy*BODY.torso*0.45+p.py*BODY.torsoW*0.5];
    case 'open':  return [s[0]+p.px*L*0.70+p.ux*L*0.05+ (side==='near'?0:0), s[1]+p.py*L*0.70+p.uy*L*0.05];   // palms-out shrug
    case 'swing': { const ph=p.walk?p.walk.phase:0; const k=Math.cos(ph+(side==='near'?Math.PI:0))*0.45; return [s[0]+p.px*L*k+10, s[1]+L*0.9-Math.abs(k)*L*0.25]; }
  }
}
function armPose(keys, p, side, lag){
  const t=p.t-lag; const L=BODY.uarm+BODY.farm;
  const s = side==='near' ? [p.ax+p.px*8, p.ay+p.py*8] : [p.ax-p.px*8, p.ay-p.py*8];
  let i=0; for(let j=0;j<keys.length;j++){ if(t>=keys[j][0]) i=j; }
  const [t0,state,dur,e]=keys[i];
  let tgt=armTarget(state,p,side);
  if(i>0 && dur>0 && t<t0+dur){
    const prev=armTarget(keys[i-1][1],p,side);
    const k=EASE[e]((t-t0)/dur);
    // polar interpolation about the shoulder → the arm swings along an arc
    const a0=Math.atan2(prev[1]-s[1],prev[0]-s[0]), a1=Math.atan2(tgt[1]-s[1],tgt[0]-s[0]);
    let da=a1-a0; while(da>Math.PI) da-=2*Math.PI; while(da<-Math.PI) da+=2*Math.PI;
    const r0=Math.hypot(prev[0]-s[0],prev[1]-s[1]), r1=Math.hypot(tgt[0]-s[0],tgt[1]-s[1]);
    const a=a0+da*k, r=clamp(r0+(r1-r0)*k, 30, L*0.995);
    tgt=[s[0]+Math.cos(a)*r, s[1]+Math.sin(a)*r];
  }
  const [ex,ey,wx,wy]=ik(s[0],s[1],tgt[0],tgt[1],BODY.uarm,BODY.farm,+1);
  return {s,e:[ex,ey],w:[wx,wy],state};
}

// ---------- character drawing ----------
function drawCharacter(ctx,t,p){
  const A=p.A;
  const OUTFIT = p.outfit==='doctor' ? {top:'#F2EBDD', topD:'#D9CFB8', pants:'#2B3B62', pantsD:'#22304F'} : p.outfit==='alt' ? {top:'#8C7BD3', topD:'#7363B5', pants:'#3A4F7A', pantsD:'#2D3F63'} : {top:P.teal, topD:P.tealD, pants:P.pants, pantsD:P.pantsD};
  ctx.save(); if(p.rot){ ctx.translate(p.hx,p.hy); ctx.rotate(p.rot); ctx.translate(-p.hx,-p.hy); } const near=armPose(A.ARM_NEAR,p,'near',0.0), far=armPose(A.ARM_FAR,p,'far',0.06);
  const face=step(A.FACE,t);
  const bodyClip=()=>{ ctx.beginPath(); ctx.save(); localCtx(ctx,p); sweaterPath(ctx); pelvisPath(ctx); ctx.restore(); };
  outlinePass(ctx,p,near,far);
  // PASS 2 — fills, back to front
  capPath(ctx,far.s[0],far.s[1],far.e[0],far.e[1],BODY.armW); ctx.strokeStyle=OUTFIT.topD; ctx.stroke();
  capPath(ctx,far.e[0],far.e[1],far.w[0],far.w[1],BODY.armW-6); ctx.stroke();
  dot(ctx,far.w[0],far.w[1],BODY.hand,P.skinD);
  capPath(ctx,p.hx+6,p.hy,p.kF[0],p.kF[1],BODY.legW); ctx.strokeStyle=OUTFIT.pantsD; ctx.stroke();
  capPath(ctx,p.kF[0],p.kF[1],p.kF[2],p.kF[3],BODY.legW-4); ctx.stroke();
  shoe(ctx,p.fF[0],p.fF[1],P.ivoryD);
  // body
  ctx.save(); localCtx(ctx,p);
  ctx.fillStyle=OUTFIT.pants; pelvisPath(ctx); ctx.fill();
  ctx.fillStyle=OUTFIT.top; sweaterPath(ctx); ctx.fill();
  ctx.save(); sweaterPath(ctx); ctx.clip();
  if(window.STYLE.shade){ ctx.fillStyle='rgba(18,26,46,0.13)'; ctx.beginPath(); ctx.moveTo(-100,20); ctx.lineTo(-34,20); ctx.quadraticCurveTo(-52,120,-36,240); ctx.lineTo(-100,240); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle=OUTFIT.topD; ctx.globalAlpha=0.5; ctx.fillRect(-100,32,200,12); ctx.globalAlpha=1;     // hem
  ctx.restore();
  ctx.fillStyle=OUTFIT.topD; rr(ctx,-24,224,52,20,9); ctx.fill();                                      // collar
  ctx.restore();
  // near leg over the pelvis: fill + soft shadow where it crosses the far leg
  capPath(ctx,p.hx,p.hy,p.kN[0],p.kN[1],BODY.legW); ctx.strokeStyle=OUTFIT.pants; ctx.stroke();
  capPath(ctx,p.kN[0],p.kN[1],p.kN[2],p.kN[3],BODY.legW-4); ctx.stroke();
  shoe(ctx,p.fN[0],p.fN[1],P.shoe);
  // pain
  if(p.pain>0){
    const a=p.pain*(0.55+0.1*Math.sin(t*9));
    ctx.save(); ctx.globalCompositeOperation='lighter';
    const g=ctx.createRadialGradient(p.lbx,p.lby,0,p.lbx,p.lby,170);
    const relief=t>10.8? clamp((t-10.8)/0.8):0; const c0=relief>0?`rgba(${242-199*relief|0},${153+26*relief|0},${74+89*relief|0},${0.75*a})`:`rgba(242,153,74,${0.75*a})`; g.addColorStop(0,c0); g.addColorStop(0.55,`rgba(242,153,74,${0.30*a})`); g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(p.lbx,p.lby,170,0,7); ctx.fill(); ctx.restore();
    const pop=EASE.ob(clamp((t-4.42)/0.25)) * (t<10.8?1:clamp((11.6-t)/0.8));
    ctx.save(); ctx.strokeStyle=P.amber; ctx.lineCap='round'; ctx.lineWidth=10; ctx.globalAlpha=0.95*pop;
    for(let i=-1;i<=1;i++){
      const ang=Math.atan2(-p.py,-p.px)+i*0.55, r0=86+8*Math.sin(t*22+i), r1=r0+38*pop;
      ctx.beginPath(); ctx.moveTo(p.lbx+Math.cos(ang)*r0,p.lby+Math.sin(ang)*r0); ctx.lineTo(p.lbx+Math.cos(ang)*r1,p.lby+Math.sin(ang)*r1); ctx.stroke();
    }
    ctx.restore();
  }
  // head, with a soft shadow onto the sweater beneath the chin
  contactShadow(ctx,bodyClip,p.cx,p.cy,p.cx,p.cy,BODY.headR*1.6,0.22);
  drawHead(ctx,t,p,face);
  // near arm: soft shadow onto the body, then the fill — no seam
  contactShadow(ctx,bodyClip,near.s[0],near.s[1],near.e[0],near.e[1],BODY.armW,0.28);
  contactShadow(ctx,bodyClip,near.e[0],near.e[1],near.w[0],near.w[1],BODY.armW-6,0.22);
  capPath(ctx,near.s[0],near.s[1],near.e[0],near.e[1],BODY.armW); ctx.strokeStyle=OUTFIT.top; ctx.stroke();
  capPath(ctx,near.e[0],near.e[1],near.w[0],near.w[1],BODY.armW-6); ctx.stroke();
  capPath(ctx,lerp(near.e[0],near.w[0],0.84),lerp(near.e[1],near.w[1],0.84),lerp(near.e[0],near.w[0],0.92),lerp(near.e[1],near.w[1],0.92),BODY.armW-6); ctx.strokeStyle=OUTFIT.topD; ctx.stroke();   // cuff
  dot(ctx,near.w[0],near.w[1],BODY.hand,P.skin);
  if(window.STYLE.outline){ ctx.strokeStyle=OUT; ctx.lineWidth=OUTW*0.8; ctx.beginPath(); ctx.arc(near.w[0],near.w[1],BODY.hand,0,7); ctx.stroke(); }
  if(near.state==='reach'){
    const a=Math.atan2(near.w[1]-near.e[1],near.w[0]-near.e[0]);
    for(let i=-1;i<=1;i++){ const aa=a+i*0.42; if(window.STYLE.outline){capPath(ctx,near.w[0],near.w[1],near.w[0]+Math.cos(aa)*30,near.w[1]+Math.sin(aa)*30,13+OUTW*1.6); ctx.strokeStyle=OUT; ctx.stroke();} }
    const wig=(t>3.3&&t<3.95)? Math.sin(t*2*Math.PI*6)*0.10 : 0;
    for(let i=-1;i<=1;i++){ const aa=a+i*0.42+wig*(i===0?1:-1); capPath(ctx,near.w[0],near.w[1],near.w[0]+Math.cos(aa)*30,near.w[1]+Math.sin(aa)*30,13); ctx.strokeStyle=P.skin; ctx.stroke(); }
    dot(ctx,near.w[0],near.w[1],BODY.hand-1,P.skin);
  }
  if(near.state==='point'){ const a=Math.atan2(near.w[1]-near.e[1],near.w[0]-near.e[0]); if(window.STYLE.outline){capPath(ctx,near.w[0],near.w[1],near.w[0]+Math.cos(a)*34,near.w[1]+Math.sin(a)*34,14+OUTW*1.6); ctx.strokeStyle=OUT; ctx.stroke();} capPath(ctx,near.w[0],near.w[1],near.w[0]+Math.cos(a)*34,near.w[1]+Math.sin(a)*34,14); ctx.strokeStyle=P.skin; ctx.stroke(); dot(ctx,near.w[0],near.w[1],BODY.hand-1,P.skin); }
  if(p.outfit==='doctor') drawDoctorBits(ctx,p,near);
  ctx.restore();
}
function drawDoctorBits(ctx,p,near){ // coat lapels, stethoscope, glasses
  ctx.save(); localCtx(ctx,p);
  ctx.fillStyle='#E3D8C0'; ctx.beginPath(); ctx.moveTo(-14,236); ctx.lineTo(18,236); ctx.lineTo(4,150); ctx.lineTo(-10,160); ctx.closePath(); ctx.fill();
  ctx.strokeStyle='#2A3B5C'; ctx.lineWidth=6; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(-6,222); ctx.quadraticCurveTo(40,170,30,120); ctx.stroke(); dot(ctx,30,116,12,'#9AA8C2'); dot(ctx,30,116,6,'#2A3B5C');
  ctx.restore();
  ctx.save(); ctx.translate(p.cx,p.cy); ctx.rotate(p.hdir); const R=BODY.headR; ctx.strokeStyle=OUT; ctx.lineWidth=4;
  ctx.beginPath(); ctx.arc(R*0.26,-R*0.10,19,0,7); ctx.stroke(); ctx.beginPath(); ctx.arc(R*0.66,-R*0.07,19,0,7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(R*0.26+19,-R*0.10); ctx.lineTo(R*0.66-19,-R*0.07); ctx.stroke();
  ctx.restore();
}
function shoe(ctx,x,y,color){ ctx.fillStyle=color; shoePath(ctx,x,y); ctx.fill();
  ctx.fillStyle=OUT; ctx.globalAlpha=0.9; rr(ctx,x-BODY.footW*0.40,y+BODY.footH/2-9,BODY.footW,9,4); ctx.fill(); ctx.globalAlpha=1; }

// ---- body part paths in spine-local coordinates (x forward, y up the spine; origin at the hips)
function localCtx(ctx,p){ ctx.transform(p.px,p.py,p.ux,p.uy,p.hx,p.hy); }
function pelvisPath(ctx){ rr(ctx,-70,-30,132,86,32); }
function sweaterPath(ctx){
  ctx.beginPath();
  ctx.moveTo(-58,34);
  ctx.quadraticCurveTo(-92,124,-74,198);
  ctx.quadraticCurveTo(-62,238,-16,238);
  ctx.lineTo(28,238);
  ctx.quadraticCurveTo(94,224,94,166);
  ctx.quadraticCurveTo(92,100,66,58);
  ctx.quadraticCurveTo(58,36,50,34);
  ctx.closePath();
}
function shoePath(ctx,x,y){ rr(ctx,x-BODY.footW*0.40,y-BODY.footH/2,BODY.footW,BODY.footH,20); }

// PASS 1 — one dark silhouette under everything: seams between same-coloured parts vanish,
// the outline only appears around the union of the whole figure.
function outlinePass(ctx,p,near,far){
  if(!window.STYLE.outline) return;
  ctx.save(); ctx.fillStyle=OUT; ctx.strokeStyle=OUT;
  const parts=[[far.s,far.e,BODY.armW],[far.e,far.w,BODY.armW-6],[[p.hx+6,p.hy],[p.kF[0],p.kF[1]],BODY.legW],[[p.kF[0],p.kF[1]],[p.kF[2],p.kF[3]],BODY.legW-4],
               [[p.hx,p.hy],[p.kN[0],p.kN[1]],BODY.legW],[[p.kN[0],p.kN[1]],[p.kN[2],p.kN[3]],BODY.legW-4],
               [near.s,near.e,BODY.armW],[near.e,near.w,BODY.armW-6]];
  for(const [a,b,w] of parts){ capPath(ctx,a[0],a[1],b[0],b[1],w+OUTW*2); ctx.stroke(); }
  for(const [x,y] of [p.fF,p.fN]){ shoePath(ctx,x,y); ctx.fill(); ctx.lineWidth=OUTW*2; ctx.stroke(); }
  for(const h of [far.w,near.w]){ ctx.beginPath(); ctx.arc(h[0],h[1],BODY.hand+OUTW,0,7); ctx.fill(); }
  ctx.save(); localCtx(ctx,p); ctx.lineWidth=OUTW*2; pelvisPath(ctx); ctx.fill(); ctx.stroke(); sweaterPath(ctx); ctx.fill(); ctx.stroke(); ctx.restore();
  ctx.beginPath(); ctx.arc(p.cx,p.cy,BODY.headR+OUTW,0,7); ctx.fill();
  ctx.beginPath(); ctx.arc(p.cx+Math.cos(p.hdir+Math.PI)*BODY.headR*0.74 - Math.sin(p.hdir)*BODY.headR*0.08*0, p.cy+Math.sin(p.hdir+Math.PI)*BODY.headR*0.74, 15+OUTW,0,7); ctx.fill();  // ear
  ctx.restore();
}
// soft contact shadow of one capsule onto whatever is beneath it (clipped to a path)
function contactShadow(ctx,clipFn,x1,y1,x2,y2,w,alpha){
  if(!window.STYLE.shade) return;
  ctx.save(); clipFn(); ctx.clip();
  ctx.globalAlpha=alpha; ctx.strokeStyle='#0E1526'; ctx.filter='blur(6px)';
  capPath(ctx,x1-5,y1+7,x2-5,y2+7,w+6); ctx.stroke();
  ctx.restore();
}
function drawHead(ctx,t,p,face){
  const {cx,cy,hdir}=p; const R=BODY.headR;
  ctx.save(); ctx.translate(cx,cy); ctx.rotate(hdir);
  // squash on the jolt, then a small overshoot back
  { const k=t-4.40; let sq=0; if(k>=0&&k<0.10) sq=0.13*EASE.out(k/0.10); else if(k>=0.10&&k<0.32) sq=0.13-0.19*EASE.io((k-0.10)/0.22); else if(k>=0.32&&k<0.55) sq=-0.06+0.06*EASE.io((k-0.32)/0.23); ctx.scale(1+sq,1-sq); }
  dot(ctx,0,0,R,P.skin);
  if(window.STYLE.shade){ const g=ctx.createRadialGradient(R*0.1,-R*0.2,R*0.3,0,0,R); g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(120,70,40,0.16)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(0,0,R,0,7); ctx.fill(); }
  dot(ctx,-R*0.74,R*0.08,15,P.skin); dot(ctx,-R*0.74,R*0.08,7,P.skinD);                 // ear
  const BLINKS=p.A.BLINKS, SWEAT=p.A.SWEAT, SOCK_X=p.A.sockX, FLOOR=p.A.floor;
  const blinking = BLINKS.some(b=>t>=b && t<b+0.11) && (face==='calm'||face==='focus'||face==='relief');
  // where is he looking? toward the sock (down/forward) in local head space
  let look=[0,0];
  if(face==='calm'||face==='focus'||face==='peek'||face==='relief'){
    const tx = face==='relief' ? cx+900 : SOCK_X, ty = face==='relief' ? cy-40 : FLOOR-20;   // ahead when relieved, else the sock
    let dx=tx-cx, dy=ty-cy; const c=Math.cos(-hdir), sn=Math.sin(-hdir); const lx=dx*c-dy*sn, ly=dx*sn+dy*c; const L=Math.hypot(lx,ly)||1;
    look=[lx/L*6, ly/L*6];
  }
  const eye=(x,y,mode)=>{
    if(window.STYLE.eyes==='white'){
      if(mode==='open'){ dot(ctx,x,y,13,P.white); dot(ctx,x+look[0],y+look[1],7,OUT); dot(ctx,x+look[0]-2,y+look[1]-2.5,2.2,P.white); }
      else if(mode==='shut'){ cap(ctx,x-11,y+1,x+11,y+1,5,OUT); }
      else if(mode==='big'){ dot(ctx,x,y,17,P.white); dot(ctx,x,y+1,8,OUT); dot(ctx,x-2.5,y-2,2.5,P.white); }
      else if(mode==='up'){ dot(ctx,x,y,13,P.white); dot(ctx,x-2,y-6,7,OUT); dot(ctx,x-4,y-8,2.2,P.white); }
      else if(mode==='happy'){ ctx.strokeStyle=OUT; ctx.lineWidth=5; ctx.beginPath(); ctx.arc(x,y+4,11,1.1*Math.PI,1.9*Math.PI); ctx.stroke(); }
      else if(mode==='half'){ dot(ctx,x,y,13,P.white); dot(ctx,x+look[0],y+look[1]+2,7,OUT); ctx.fillStyle=P.skin; ctx.fillRect(x-14,y-14,28,13); cap(ctx,x-11,y-1,x+11,y-1,4,OUT); }
      else { cap(ctx,x-12,y+6,x,y-5,5.5,OUT); cap(ctx,x,y-5,x+12,y+6,5.5,OUT); }
    } else {
      if(mode==='open'){ dot(ctx,x,y,9,OUT); }
      else if(mode==='shut'){ cap(ctx,x-10,y,x+10,y,5,OUT); }
      else { cap(ctx,x-12,y+6,x,y-5,5.5,OUT); cap(ctx,x,y-5,x+12,y+6,5.5,OUT); }
    }
  };
  const ex1=R*0.26, ex2=R*0.66, ey=-R*0.12;
  let mouth='smile';
  if(face==='calm'){ eye(ex1,ey,blinking?'shut':'open'); eye(ex2,ey+3,blinking?'shut':'open'); mouth='smile'; }
  if(face==='focus'){ eye(ex1,ey+4,blinking?'shut':'open'); eye(ex2,ey+7,blinking?'shut':'open'); mouth='small';
    cap(ctx,ex1-11,ey-23,ex1+9,ey-23,5,OUT); cap(ctx,ex2-9,ey-23,ex2+11,ey-23,5,OUT); }          // level, concentrating brows
  if(face==='ouch'){ eye(ex1,ey,'squeeze'); eye(ex2,ey+3,'squeeze'); mouth='grimace';
    cap(ctx,ex1-14,ey-28,ex1+10,ey-22,6,OUT); cap(ctx,ex2-10,ey-22,ex2+14,ey-27,6,OUT); }
  if(face==='peek'){ eye(ex1,ey,'squeeze'); eye(ex2,ey+3,'open'); mouth='small'; cap(ctx,ex1-14,ey-28,ex1+10,ey-22,6,OUT); }
  if(face==='worried'){ eye(ex1,ey,blinking?'shut':'open'); eye(ex2,ey+3,blinking?'shut':'open'); mouth='frown';
    cap(ctx,ex1-12,ey-20,ex1+10,ey-27,5,OUT); cap(ctx,ex2-10,ey-27,ex2+12,ey-21,5,OUT); }           // brows up at the centre
  if(face==='surprise'){ eye(ex1,ey-2,'big'); eye(ex2,ey+1,'big'); mouth='o';
    ctx.strokeStyle=OUT; ctx.lineWidth=5; ctx.beginPath(); ctx.arc(ex1,ey-20,14,1.15*Math.PI,1.85*Math.PI); ctx.stroke(); ctx.beginPath(); ctx.arc(ex2,ey-17,14,1.15*Math.PI,1.85*Math.PI); ctx.stroke(); }
  if(face==='thinking'){ eye(ex1,ey-3,'up'); eye(ex2,ey,'up'); mouth='side';
    cap(ctx,ex1-12,ey-24,ex1+10,ey-24,5,OUT); ctx.strokeStyle=OUT; ctx.lineWidth=5; ctx.beginPath(); ctx.arc(ex2,ey-16,14,1.15*Math.PI,1.85*Math.PI); ctx.stroke(); }
  if(face==='talking'){ eye(ex1,ey,blinking?'shut':'open'); eye(ex2,ey+3,blinking?'shut':'open'); mouth='talk'; }
  if(face==='happy'){ eye(ex1,ey,'happy'); eye(ex2,ey+3,'happy'); mouth='bigsmile'; }
  if(face==='tired'){ eye(ex1,ey,'half'); eye(ex2,ey+3,'half'); mouth='small'; }
  if(face==='relief'){ eye(ex1,ey,blinking?'shut':'open'); eye(ex2,ey+3,blinking?'shut':'open'); mouth='smile';
    ctx.strokeStyle=OUT; ctx.lineWidth=5; ctx.lineCap='round';                                            // raised, relieved brows
    ctx.beginPath(); ctx.arc(ex1,ey-14,14,1.15*Math.PI,1.85*Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.arc(ex2,ey-11,14,1.15*Math.PI,1.85*Math.PI); ctx.stroke(); }
  const mx=R*0.50, my=R*0.40;
  ctx.strokeStyle=OUT; ctx.lineCap='round'; ctx.lineWidth=5.5; ctx.beginPath();
  if(mouth==='smile'){ ctx.arc(mx,my-8,16,0.2*Math.PI,0.85*Math.PI); ctx.stroke(); }
  else if(mouth==='small'){ ctx.arc(mx,my-4,9,0.25*Math.PI,0.8*Math.PI); ctx.stroke(); }
  else if(mouth==='frown'){ ctx.arc(mx,my+10,12,1.2*Math.PI,1.8*Math.PI); ctx.stroke(); }
  else if(mouth==='o'){ ctx.fillStyle=OUT; ctx.beginPath(); ctx.ellipse(mx,my,11,14,0,0,7); ctx.fill(); }
  else if(mouth==='side'){ ctx.moveTo(mx-6,my+2); ctx.lineTo(mx+10,my-2); ctx.stroke(); }
  else if(mouth==='bigsmile'){ ctx.fillStyle=OUT; ctx.beginPath(); ctx.arc(mx,my-6,20,0.05*Math.PI,0.95*Math.PI); ctx.closePath(); ctx.fill(); ctx.fillStyle='#E8706A'; ctx.beginPath(); ctx.arc(mx,my+4,10,0.1*Math.PI,0.9*Math.PI); ctx.closePath(); ctx.fill(); }
  else if(mouth==='talk'){ const o=0.5+0.5*Math.sin(t*2*Math.PI*4.2)*Math.sin(t*2*Math.PI*1.7+1); ctx.fillStyle=OUT; ctx.beginPath(); ctx.ellipse(mx,my,12,4+12*o,0,0,7); ctx.fill(); }
  else { ctx.fillStyle=OUT; rr(ctx,mx-22,my-10,44,30,12); ctx.fill();
    ctx.fillStyle=P.ivory; rr(ctx,mx-18,my-7,36,10,3); ctx.fill();
    ctx.strokeStyle=OUT; ctx.lineWidth=2; ctx.beginPath(); for(let i=1;i<4;i++){ ctx.moveTo(mx-18+i*9,my-7); ctx.lineTo(mx-18+i*9,my+3); } ctx.stroke(); }
  // cheek
  if(window.STYLE.shade && (face==='calm'||face==='relief')){ ctx.fillStyle='rgba(235,120,100,0.18)'; ctx.beginPath(); ctx.ellipse(R*0.62,R*0.22,14,9,0,0,7); ctx.fill(); }
  if(face==='relief' && t>=10.95 && t<=11.9){ const k=(t-10.95)/0.95; ctx.fillStyle='rgba(237,230,214,'+(0.55*(1-k))+')';
    for(let i=0;i<3;i++){ const r=7+i*5+k*14, x=mx+30+k*(70+i*25), y=my-6-k*(30+i*12)+Math.sin(k*9+i)*4; ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill(); } }
  for(const [a,b] of SWEAT){ if(t>=a && t<=b && (face==='ouch'||face==='peek')){
    const k=(t-a)/(b-a); const sxp=-R*0.30-k*10, syp=-R*0.80+k*R*1.15;
    ctx.fillStyle='#D8EEFF'; ctx.strokeStyle=OUT; ctx.lineWidth=3; ctx.globalAlpha=0.95*(1-Math.pow(k,4));
    ctx.beginPath(); ctx.moveTo(sxp,syp-18); ctx.quadraticCurveTo(sxp+13,syp-3,sxp,syp+10); ctx.quadraticCurveTo(sxp-13,syp-3,sxp,syp-18); ctx.fill(); if(window.STYLE.outline) ctx.stroke(); ctx.globalAlpha=1; } }
  ctx.restore();
}

