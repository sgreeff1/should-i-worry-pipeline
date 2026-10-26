// meter.js — the channel's signature devices (Decision #46): the worry meter and the opening ident / end card wordmark.
// Worry meter: a dial that answers "Should I worry?". Three zones, each with a colour AND an icon (colour is never the only cue):
//   teal + check = fine · amber + toast = sore but harmless · red + flame = serious.
// drawMeter(ctx, t, {x, y, size, value, style}) — value 0…1 (0 = fine, 1 = fire); style 'gauge' (option 1) or 'bar' (option 2).
const METER_ZONES=[{c:P.teal,icon:'check',label:'Fine'},{c:P.amber,icon:'toast',label:'Burnt toast'},{c:P.red,icon:'flame',label:'Fire'}];
function meterNeedle(ctx,ang,len,w){ ctx.save(); ctx.rotate(ang); ctx.strokeStyle=P.ivory; ctx.lineCap='round'; ctx.lineWidth=w; if(window.STYLE.outline){ ctx.strokeStyle=OUT; ctx.lineWidth=w+OUTW*0.8; ctx.beginPath(); ctx.moveTo(-len*0.12,0); ctx.lineTo(len,0); ctx.stroke(); ctx.strokeStyle=P.ivory; ctx.lineWidth=w; }
  ctx.beginPath(); ctx.moveTo(-len*0.12,0); ctx.lineTo(len,0); ctx.stroke(); ctx.restore(); }
function drawMeter(ctx,t,o={}){
  const x=o.x??W/2, y=o.y??H*0.5, s=o.size??360, v=clamp(o.value??0), style=o.style||'gauge', a=o.alpha??1;
  ctx.save(); ctx.translate(x,y); ctx.globalAlpha=a;
  if(style==='gauge'){ // option 1: a half dial, needle from the hub, icons on the rim
    const r=s*0.5, w=s*0.16, a0=Math.PI, a1=2*Math.PI;
    ctx.fillStyle='rgba(18,26,46,0.78)'; ctx.beginPath(); ctx.arc(0,0,r+w*0.75,a0-0.12,a1+0.12); ctx.lineTo(r+w*0.75,s*0.26); ctx.lineTo(-(r+w*0.75),s*0.26); ctx.closePath(); ctx.fill();   // backing plate
    METER_ZONES.forEach((z,i)=>{ const za=a0+(a1-a0)*i/3, zb=a0+(a1-a0)*(i+1)/3; ctx.strokeStyle=z.c; ctx.lineWidth=w; ctx.lineCap='butt'; ctx.beginPath(); ctx.arc(0,0,r,za+0.02,zb-0.02); ctx.stroke();
      const am=(za+zb)/2; drawIcon(ctx,z.icon,Math.cos(am)*(r+w*0.95),Math.sin(am)*(r+w*0.95),s*0.13,t, undefined); });
    if(window.STYLE.outline){ ctx.strokeStyle=OUT; ctx.lineWidth=OUTW*0.6; ctx.beginPath(); ctx.arc(0,0,r+w/2,a0,a1); ctx.stroke(); ctx.beginPath(); ctx.arc(0,0,r-w/2,a0,a1); ctx.stroke(); }
    const ang=a0+(a1-a0)*v; meterNeedle(ctx,ang,r-w*0.2,s*0.03);
    dot(ctx,0,0,s*0.06,P.ivory); if(window.STYLE.outline){ ctx.strokeStyle=OUT; ctx.lineWidth=OUTW*0.6; ctx.beginPath(); ctx.arc(0,0,s*0.06,0,7); ctx.stroke(); }
    if(o.label!==false){ ctx.font=`700 ${Math.round(s*0.075)}px Inter`; ctx.textAlign='center'; ctx.fillStyle=P.ivory; ctx.fillText(o.label||'Should I worry?',0,s*0.20); }
  } else { // option 2: a horizontal bar with a sliding marker, icons at the ends and middle
    const bw=s, bh=s*0.11, x0=-bw/2;
    ctx.fillStyle='rgba(18,26,46,0.78)'; rr(ctx,x0-s*0.16,-bh*2.6,bw+s*0.32,bh*6.2,s*0.06); ctx.fill();
    METER_ZONES.forEach((z,i)=>{ ctx.fillStyle=z.c; rr(ctx,x0+bw*i/3+ (i?2:0),-bh/2,bw/3-(i===2?0:2)-(i?2:0),bh,[i===0?bh/2:0,i===2?bh/2:0,i===2?bh/2:0,i===0?bh/2:0]); ctx.fill();
      drawIcon(ctx,z.icon,x0+bw*(i+0.5)/3,-bh*1.55,s*0.11,t, undefined); });
    if(window.STYLE.outline){ ctx.strokeStyle=OUT; ctx.lineWidth=OUTW*0.6; rr(ctx,x0,-bh/2,bw,bh,bh/2); ctx.stroke(); }
    const mx=x0+bw*v; ctx.save(); ctx.translate(mx,0); ctx.fillStyle=P.ivory; ctx.beginPath(); ctx.moveTo(0,bh*0.95); ctx.lineTo(bh*0.7,bh*1.6); ctx.lineTo(-bh*0.7,bh*1.6); ctx.closePath(); ctx.fill(); if(window.STYLE.outline){ ctx.strokeStyle=OUT; ctx.lineWidth=OUTW*0.6; ctx.stroke(); }
    dot(ctx,0,0,bh*0.42,P.ivory); if(window.STYLE.outline){ ctx.beginPath(); ctx.arc(0,0,bh*0.42,0,7); ctx.stroke(); } ctx.restore();
    if(o.label!==false){ ctx.font=`700 ${Math.round(s*0.075)}px Inter`; ctx.textAlign='center'; ctx.fillStyle=P.ivory; ctx.fillText(o.label||'Should I worry?',0,bh*2.95); }
  }
  ctx.restore();
}
// A meter track in the episode JSON: ep.meter = [{t0, t1, from, to, ease?, size?, x?, y?, style?}] — the value animates from→to over the window; between windows the last value holds.
function meterValue(track,t){ let v=null; for(const m of track){ if(t>=m.t0){ const k=clamp((t-m.t0)/Math.max(0.01,(m.t1-m.t0))); v=lerp(m.from??(v??0), m.to, EASE[m.ease||'swing'](k)); } } return v; }
function drawMeterTrack(ctx,t,track){ if(!track||!track.length) return; const cur=[...track].reverse().find(m=>t>=m.t0); if(!cur) return; const hold=cur.hold??4; const al=Math.min(clamp((t-cur.t0)/0.4), clamp((cur.t1+hold-t)/0.4)); if(al<=0) return;
  const sz=cur.size??260; drawMeter(ctx,t,{x:cur.x??W*0.84,y:cur.y??H*0.20,size:sz,value:meterValue(track,t),style:cur.style||METER_STYLE,label:cur.label??(sz<320?false:undefined),alpha:al}); }   // corner overlays carry no label
let METER_STYLE='gauge';

// ---- the wordmark and the opening ident (two options) ----
function wordmark(ctx,x,y,size,al=1){ ctx.save(); ctx.globalAlpha=al; ctx.font=`800 ${size}px Inter`; ctx.textAlign='left'; ctx.textBaseline='alphabetic';
  const a='Should I Worry', q='?'; const wa=ctx.measureText(a).width, wq=ctx.measureText(q).width; const x0=x-(wa+wq)/2;
  ctx.fillStyle=P.ivory; ctx.fillText(a,x0,y); ctx.fillStyle=P.amber; ctx.fillText(q,x0+wa,y); ctx.restore(); return (wa+wq); }
// Ident option 1 — "the dial": the gauge draws on, the needle swings fine → fire → settles on burnt toast, the wordmark lands, the "?" pops. 2.0 s.
function drawIdentDial(ctx,t,o={}){
  const s=o.size??520, y=H*0.50; const draw=EASE.out(clamp(t/0.5));
  ctx.save(); ctx.translate(W/2,y); ctx.scale(lerp(0.9,1,draw),lerp(0.9,1,draw)); ctx.translate(-W/2,-y); ctx.globalAlpha=draw;
  const v= t<0.35?0 : t<1.0? EASE.io((t-0.35)/0.65) : t<1.6? 1-0.55*EASE.swing((t-1.0)/0.6) : 0.45;   // sweep to fire, settle on burnt toast
  drawMeter(ctx,t,{x:W/2,y:y+s*0.12,size:s,value:v,style:'gauge',label:false});
  ctx.restore();
  const k=EASE.ob(clamp((t-1.05)/0.45)); if(k>0){ ctx.save(); ctx.translate(W/2,y+s*0.42); ctx.scale(k,k); wordmark(ctx,0,0,Math.round(s*0.19)); ctx.restore(); }
  if(t>1.7){ const p=0.5+0.5*Math.sin((t-1.7)*9); ctx.save(); ctx.globalAlpha=0.25*p; ctx.font=`800 ${Math.round(s*0.19)}px Inter`; ctx.textAlign='center'; ctx.fillStyle=P.amber; ctx.restore(); }
}
// Ident option 2 — "the character": the lead walks in, stops, looks at the camera, a "?" pops above the head, then the wordmark. 2.0 s.
let _identAnim=null;
function drawIdentChar(ctx,t,CXfn,o={}){
  if(!_identAnim){ _identAnim=poseAnim([[0,'walk'],[0.9,'stand',0.35],[1.2,'think',0.4]],{standX:W*0.42,floor:H*0.80,face:[[0,'calm'],[1.0,'thinking'],[1.5,'surprise']],end:3}); }
  const A=_identAnim; const p=pose(A,t); const cam={z:1.0,wx:W/2,wy:H/2,sx:W/2,sy:H/2,drift:0};
  drawVoid(ctx,t,p,cam,{floor:true});
  if(CXfn) CXfn(cx=>drawCharacter(cx,t,p)); else drawCharacter(ctx,t,p);
  const q=EASE.ob(clamp((t-1.45)/0.35)); if(q>0){ ctx.save(); ctx.translate(p.cx+BODY.headR*0.9,p.cy-BODY.headR*1.35); ctx.scale(q,q); ctx.font='800 150px Inter'; ctx.textAlign='center'; ctx.fillStyle=P.amber; if(window.STYLE.outline){ ctx.strokeStyle=OUT; ctx.lineWidth=OUTW*1.5; ctx.strokeText('?',0,50); } ctx.fillText('?',0,50); ctx.restore(); }
  const k=EASE.ob(clamp((t-1.3)/0.45)); if(k>0){ ctx.save(); ctx.translate(W*0.70,H*0.50); ctx.scale(k,k); wordmark(ctx,0,0,96); ctx.restore(); }
}
