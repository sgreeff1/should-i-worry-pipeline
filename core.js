// core.js — maths, keyframe engine, IK, drawing primitives, grain tile
// ---------- maths ----------
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const D2R=Math.PI/180;
const EASE = {
  lin:t=>t,
  io:t=>{t=clamp(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2},
  out:t=>1-Math.pow(1-clamp(t),3),
  in:t=>Math.pow(clamp(t),3),
  snap:t=>1-Math.pow(1-clamp(t),5),
  ob:t=>{t=clamp(t);const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2)},   // overshoot
  obb:t=>{t=clamp(t);const c1=2.6,c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2)},      // bigger overshoot
  swing:t=>{t=clamp(t); const io=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2; return t<0.78? io(t/0.78)*1.06 : 1.06-0.06*io((t-0.78)/0.22);},
};
function rnd(i){ const x=Math.sin(i*127.1+311.7)*43758.5453; return x-Math.floor(x); }
function noise(t,seed=0){ return 0.5*Math.sin(t*1.7+seed)+0.3*Math.sin(t*3.1+seed*2.3)+0.2*Math.sin(t*7.3+seed*0.7); }

// ---------- keyframe engine ----------
// keys: [time, value, ease] — ease belongs to the segment that ARRIVES at that key.
function ch(keys, t){
  if(t<=keys[0][0]) return keys[0][1];
  for(let i=1;i<keys.length;i++){
    const [t1,v1,e]=keys[i], [t0,v0]=keys[i-1];
    if(t<=t1){ const k=(t1===t0)?1:(t-t0)/(t1-t0); return v0+(v1-v0)*EASE[e||'io'](k); }
  }
  return keys[keys.length-1][1];
}
function step(keys,t){ let v=keys[0][1]; for(const [k,val] of keys){ if(t>=k) v=val; } return v; }

// 2-bone IK. root (ax,ay) → target (bx,by). Returns the joint. sign chooses the bend side.
function ik(ax,ay,bx,by,l1,l2,sign){
  let dx=bx-ax, dy=by-ay, d=Math.hypot(dx,dy);
  d=Math.min(d,(l1+l2)*0.995); d=Math.max(d,Math.abs(l1-l2)+0.5);
  const a=Math.acos(clamp((l1*l1+d*d-l2*l2)/(2*l1*d),-1,1));
  const ang=Math.atan2(dy,dx)+sign*a;
  const jx=ax+l1*Math.cos(ang), jy=ay+l1*Math.sin(ang);
  // re-aim the second bone at the (possibly clamped) target
  const tx=ax+Math.cos(Math.atan2(dy,dx))*d, ty=ay+Math.sin(Math.atan2(dy,dx))*d;
  return [jx,jy,tx,ty];
}

// ---------- drawing primitives ----------
function cap(ctx,x1,y1,x2,y2,w,color){ ctx.strokeStyle=color; ctx.lineWidth=w; ctx.lineCap='round'; ctx.lineJoin='round';
  ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); }
function dot(ctx,x,y,r,color){ ctx.fillStyle=color; ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill(); }
function rr(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); }
function capPath(ctx,x1,y1,x2,y2,w){ ctx.lineWidth=w; ctx.lineCap='round'; ctx.lineJoin='round'; ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); }
const GR=document.createElement('canvas'); GR.width=256; GR.height=256; (function(){ const g=GR.getContext('2d'); const im=g.createImageData(256,256); for(let i=0;i<im.data.length;i+=4){ const v=128+Math.floor((rnd(i)-0.5)*90); im.data[i]=im.data[i+1]=im.data[i+2]=v; im.data[i+3]=255; } g.putImageData(im,0,0); })();   // grain tile
