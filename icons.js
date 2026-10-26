// icons.js — the house icon set, each drawn in a 100×100 box centred on (0,0). ICON[name](ctx, t, color)
// For organs, `color` is a STATE colour (see organ helpers below), not the body colour.
function glowOn(ctx,c,b){ ctx.shadowColor=c; ctx.shadowBlur=b; } function glowOff(ctx){ ctx.shadowBlur=0; ctx.shadowColor='transparent'; }

// ---- organs (Decision: organs get faces channel-wide, 26 Oct 2026) ----
// Convention: `c` is the STATE colour — omitted/organ = normal; P.red = red-flag (halo, worried face, full). The body is always P.organ.
const organAlert=(c)=> !!c && c!==P.organ && c!==P.teal;
function organHalo(ctx,t,c){ if(!organAlert(c)) return; ctx.save(); ctx.globalCompositeOperation='lighter';
  const a=0.55+0.25*Math.sin(t*5); const g=ctx.createRadialGradient(0,0,10,0,0,84); g.addColorStop(0,`rgba(235,87,87,${0.75*a})`); g.addColorStop(0.6,`rgba(235,87,87,${0.32*a})`); g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(0,0,78,0,7); ctx.fill(); ctx.restore(); }
function organShade(ctx,pathFn,tint='rgba(90,30,40,0.20)'){ if(!window.STYLE.shade) return; ctx.save(); pathFn(ctx); ctx.clip();
  const g=ctx.createRadialGradient(-10,-14,6,0,0,46); g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,tint); ctx.fillStyle=g; ctx.fillRect(-50,-50,100,100);
  ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.ellipse(-18,-24,9,5,-0.5,0,7); ctx.fill(); ctx.restore(); }   // gloss
function organOutline(ctx,pathFn){ if(!window.STYLE.outline) return; ctx.save(); pathFn(ctx); ctx.strokeStyle=OUT; ctx.lineWidth=OUTW*0.75; ctx.lineJoin='round'; ctx.stroke(); ctx.restore(); }
function organFluid(ctx,pathFn,level,t){ ctx.save(); pathFn(ctx); ctx.clip(); const y=34-level*68; ctx.beginPath(); ctx.moveTo(-50,y+1.5*Math.sin(t*2.2));
  for(let x=-50;x<=50;x+=10){ ctx.lineTo(x,y+1.8*Math.sin(t*2.2+x*0.12)); } ctx.lineTo(50,70); ctx.lineTo(-50,70); ctx.closePath(); ctx.fillStyle='rgba(255,255,255,0.30)'; ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.75)'; ctx.lineWidth=2.2; ctx.beginPath(); for(let x=-50;x<=50;x+=10){ const yy=y+1.8*Math.sin(t*2.2+x*0.12); x===-50?ctx.moveTo(x,yy):ctx.lineTo(x,yy); } ctx.stroke(); ctx.restore(); }   // level 0 empty … 1 full; the meniscus line is what reads at small sizes
function organFace(ctx,t,mood){ // house eyes (whites + pupil + shine); calm smile with cheeks, or worried (frown, brows, sweat)
  for(const x of [-11,11]){ dot(ctx,x,-10,6,P.white); dot(ctx,x+0.4,-9.2,3,OUT); dot(ctx,x-0.8,-10.8,1,P.white); }
  ctx.strokeStyle=OUT; ctx.lineCap='round'; ctx.lineWidth=2.8; ctx.beginPath();
  if(mood==='worried'){ ctx.arc(0,10,6,1.2*Math.PI,1.8*Math.PI); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-17,-20); ctx.lineTo(-7,-22.5); ctx.moveTo(7,-22.5); ctx.lineTo(17,-20); ctx.stroke();
    const k=(t*0.9)%1; ctx.fillStyle='#D8EEFF'; ctx.globalAlpha=0.95*(1-Math.pow(k,4)); ctx.beginPath(); const sx=25,sy=-30+k*18; ctx.moveTo(sx,sy-7); ctx.quadraticCurveTo(sx+5,sy,sx,sy+4); ctx.quadraticCurveTo(sx-5,sy,sx,sy-7); ctx.fill(); ctx.globalAlpha=1; }
  else { ctx.arc(0,1,7,0.2*Math.PI,0.8*Math.PI); ctx.stroke(); ctx.fillStyle='rgba(235,120,100,0.22)'; for(const x of [-21,21]){ ctx.beginPath(); ctx.ellipse(x,2,5,3,0,0,7); ctx.fill(); } } }
function bladderBody(ctx){ ctx.beginPath(); ctx.moveTo(0,-38); ctx.bezierCurveTo(27,-38,44,-22,42,-4); ctx.bezierCurveTo(40,16,30,28,17,33); ctx.quadraticCurveTo(10,36,10,40); ctx.quadraticCurveTo(10,49,6,50); ctx.lineTo(-6,50); ctx.quadraticCurveTo(-10,49,-10,40); ctx.quadraticCurveTo(-10,36,-17,33); ctx.bezierCurveTo(-30,28,-40,16,-42,-4); ctx.bezierCurveTo(-44,-22,-27,-38,0,-38); ctx.closePath(); }   // inverted pear: wide dome, narrowing to a short neck
const ICON = {
  toast:(ctx,t,c=P.amber)=>{ ctx.fillStyle='#9AA8C2'; rr(ctx,-42,-10,84,52,14); ctx.fill(); ctx.fillStyle=P.navyD; rr(ctx,-30,-4,60,8,4); ctx.fill();
    ctx.fillStyle=c; rr(ctx,-24,-46,48,46,[16,16,4,4]); ctx.fill(); ctx.fillStyle='#8C5A2B'; rr(ctx,-24,-46,48,10,[16,16,0,0]); ctx.fill();
    ctx.strokeStyle='rgba(237,230,214,0.6)'; ctx.lineWidth=3; for(let i=0;i<3;i++){ ctx.beginPath(); ctx.moveTo(-8+i*8,-56); ctx.quadraticCurveTo(-4+i*8,-66,-8+i*8,-76); ctx.stroke(); } },
  flame:(ctx,t,c=P.red)=>{ const k=1+0.06*Math.sin(t*9); ctx.save(); ctx.scale(1,k); glowOn(ctx,c,30); ctx.fillStyle=c; ctx.beginPath(); ctx.moveTo(0,-50); ctx.quadraticCurveTo(44,-10,30,26); ctx.quadraticCurveTo(14,52,0,50); ctx.quadraticCurveTo(-14,52,-30,26); ctx.quadraticCurveTo(-44,-10,0,-50); ctx.fill(); glowOff(ctx);
    ctx.fillStyle=P.amber; ctx.beginPath(); ctx.moveTo(0,-14); ctx.quadraticCurveTo(22,10,14,32); ctx.quadraticCurveTo(0,44,-14,32); ctx.quadraticCurveTo(-22,10,0,-14); ctx.fill(); ctx.fillStyle=P.yellow; ctx.beginPath(); ctx.ellipse(0,26,7,12,0,0,7); ctx.fill(); ctx.restore(); },
  alarm:(ctx,t,c=P.red)=>{ ctx.fillStyle=P.ivory; ctx.beginPath(); ctx.arc(0,0,44,0,7); ctx.fill(); ctx.fillStyle='#CFC6B2'; ctx.beginPath(); ctx.arc(0,0,30,0,7); ctx.fill();
    ctx.strokeStyle='#B5AB95'; ctx.lineWidth=3; for(let i=0;i<8;i++){ const a=i*Math.PI/4; ctx.beginPath(); ctx.moveTo(Math.cos(a)*16,Math.sin(a)*16); ctx.lineTo(Math.cos(a)*26,Math.sin(a)*26); ctx.stroke(); }
    const on=Math.sin(t*6)>0; glowOn(ctx,c,on?24:0); ctx.fillStyle=on?c:'#8C5A5A'; ctx.beginPath(); ctx.arc(0,0,7,0,7); ctx.fill(); glowOff(ctx);
    ctx.strokeStyle=c; ctx.lineWidth=4; ctx.globalAlpha=0.7; for(let i=1;i<=2;i++){ const r=50+i*10+((t*40)%10); ctx.beginPath(); ctx.arc(0,0,r,-0.6,0.6); ctx.stroke(); ctx.beginPath(); ctx.arc(0,0,r,Math.PI-0.6,Math.PI+0.6); ctx.stroke(); } ctx.globalAlpha=1; },
  bladder:(ctx,t,c)=>{ organHalo(ctx,t,c); ctx.fillStyle=P.organ; bladderBody(ctx); ctx.fill(); organShade(ctx,bladderBody); organFluid(ctx,bladderBody,organAlert(c)?0.86:0.30,t); organFace(ctx,t,organAlert(c)?'worried':'calm'); organOutline(ctx,bladderBody); },   // no ureters: beside a face, side tubes read as arms (QA v2); the pear-with-neck silhouette + fluid line carries 'bladder'
  bowel:(ctx,t,c=P.teal)=>{ ctx.strokeStyle=c; ctx.lineWidth=16; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(-34,30); ctx.lineTo(-34,-20); ctx.quadraticCurveTo(-34,-40,-14,-40); ctx.lineTo(14,-40); ctx.quadraticCurveTo(34,-40,34,-20); ctx.lineTo(34,30); ctx.stroke(); },
  legs:(ctx,t,c=P.teal)=>{ ctx.strokeStyle=c; ctx.lineWidth=20; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(-16,-44); ctx.lineTo(-22,40); ctx.moveTo(16,-44); ctx.lineTo(22,40); ctx.stroke(); ctx.fillStyle=P.ivory; rr(ctx,-40,36,30,14,6); ctx.fill(); rr(ctx,10,36,30,14,6); ctx.fill(); },
  scanner:(ctx,t,c=P.ivory)=>{ ctx.fillStyle=c; ctx.beginPath(); ctx.arc(0,0,46,0,7); ctx.fill(); ctx.fillStyle=P.navyD; ctx.beginPath(); ctx.arc(0,0,26,0,7); ctx.fill(); ctx.fillStyle='#9AA8C2'; rr(ctx,-60,24,120,16,6); ctx.fill(); },
  clock:(ctx,t,c=P.ivory)=>{ ctx.fillStyle=c; ctx.beginPath(); ctx.arc(0,0,46,0,7); ctx.fill(); ctx.strokeStyle=P.navyD; ctx.lineWidth=5; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,-30); ctx.moveTo(0,0); ctx.lineTo(Math.cos(t*0.8)*22,Math.sin(t*0.8)*22); ctx.stroke(); ctx.lineWidth=3; ctx.beginPath(); ctx.arc(0,0,46,0,7); ctx.stroke(); },
  calendar:(ctx,t,c=P.ivory)=>{ ctx.fillStyle=c; rr(ctx,-42,-36,84,78,10); ctx.fill(); ctx.fillStyle=P.red; rr(ctx,-42,-36,84,22,[10,10,0,0]); ctx.fill(); ctx.fillStyle=P.navyD; for(let r=0;r<2;r++) for(let k=0;k<4;k++){ rr(ctx,-32+k*18,-4+r*18,12,12,3); ctx.fill(); } },
  siren:(ctx,t,c=P.red)=>{ const on=Math.sin(t*10)>0; glowOn(ctx,c,on?28:0); ctx.fillStyle=on?c:'#B04040'; ctx.beginPath(); ctx.arc(0,0,34,Math.PI,0); ctx.lineTo(34,20); ctx.lineTo(-34,20); ctx.closePath(); ctx.fill(); glowOff(ctx); ctx.fillStyle=P.ivory; rr(ctx,-44,20,88,14,5); ctx.fill(); ctx.strokeStyle=c; ctx.lineWidth=4; ctx.globalAlpha=on?0.8:0.3; ctx.beginPath(); ctx.moveTo(-46,-30); ctx.lineTo(-58,-42); ctx.moveTo(46,-30); ctx.lineTo(58,-42); ctx.moveTo(0,-44); ctx.lineTo(0,-58); ctx.stroke(); ctx.globalAlpha=1; },
  hospital:(ctx,t,c=P.ivory)=>{ ctx.fillStyle=c; rr(ctx,-44,-30,88,76,8); ctx.fill(); ctx.fillStyle=P.red; rr(ctx,-6,-56,12,36,3); ctx.fill(); rr(ctx,-18,-44,36,12,3); ctx.fill(); ctx.fillStyle=P.navyD; for(let r=0;r<2;r++) for(let k=0;k<3;k++){ rr(ctx,-30+k*24,-18+r*24,14,14,3); ctx.fill(); } },
  thermometer:(ctx,t,c=P.red)=>{ ctx.fillStyle=P.ivory; rr(ctx,-10,-50,20,70,10); ctx.fill(); ctx.beginPath(); ctx.arc(0,30,18,0,7); ctx.fill(); ctx.fillStyle=c; ctx.beginPath(); ctx.arc(0,30,11,0,7); ctx.fill(); rr(ctx,-4,-20-10*Math.sin(t*2),8,54+10*Math.sin(t*2),4); ctx.fill(); },
  flag:(ctx,t,c=P.red)=>{ ctx.fillStyle=P.ivory; rr(ctx,-30,-50,6,100,3); ctx.fill(); ctx.fillStyle=c; ctx.beginPath(); ctx.moveTo(-24,-48); ctx.quadraticCurveTo(10,-60+4*Math.sin(t*5),40,-42); ctx.lineTo(40,-10); ctx.quadraticCurveTo(10,-24+4*Math.sin(t*5+1),-24,-12); ctx.closePath(); ctx.fill(); },
  magnifier:(ctx,t,c=P.ivory)=>{ ctx.strokeStyle=c; ctx.lineWidth=10; ctx.lineCap='round'; ctx.beginPath(); ctx.arc(-10,-10,30,0,7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(12,12); ctx.lineTo(42,42); ctx.stroke(); ctx.fillStyle='rgba(43,179,163,0.3)'; ctx.beginPath(); ctx.arc(-10,-10,26,0,7); ctx.fill(); },
  question:(ctx,t,c=P.ivory)=>{ ctx.fillStyle=c; ctx.font='800 96px Inter'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('?',0,4); },
  check:(ctx,t,c=P.teal)=>{ ctx.strokeStyle=c; ctx.lineWidth=12; ctx.lineCap='round'; ctx.lineJoin='round'; ctx.beginPath(); ctx.moveTo(-34,2); ctx.lineTo(-10,26); ctx.lineTo(36,-28); ctx.stroke(); },
  sun:(ctx,t,c=P.amber)=>{ ctx.fillStyle=c; ctx.beginPath(); ctx.arc(0,0,26,0,7); ctx.fill(); ctx.strokeStyle=c; ctx.lineWidth=6; ctx.lineCap='round'; for(let i=0;i<8;i++){ const a=i*Math.PI/4; ctx.beginPath(); ctx.moveTo(Math.cos(a)*36,Math.sin(a)*36); ctx.lineTo(Math.cos(a)*48,Math.sin(a)*48); ctx.stroke(); } },
  moon:(ctx,t,c=P.ivory)=>{ ctx.fillStyle=c; ctx.beginPath(); ctx.arc(0,0,40,0,7); ctx.fill(); ctx.fillStyle=P.navyD; ctx.beginPath(); ctx.arc(16,-10,34,0,7); ctx.fill(); },
  pill:(ctx,t,c=P.ivory)=>{ ctx.fillStyle=c; rr(ctx,-28,-20,56,66,10); ctx.fill(); ctx.fillStyle=P.amber; rr(ctx,-32,-46,64,26,8); ctx.fill(); ctx.fillStyle=P.teal; rr(ctx,-18,0,36,24,4); ctx.fill(); },
  hand:(ctx,t,c=P.skin)=>{ ctx.fillStyle=c; rr(ctx,-30,-10,60,56,16); ctx.fill(); for(let i=0;i<4;i++){ rr(ctx,-28+i*15,-54+(i===0||i===3?10:0),12,54,6); ctx.fill(); } rr(ctx,-48,-6,20,34,8); ctx.fill(); },
  document:(ctx,t,c=P.ivory)=>{ ctx.fillStyle=c; rr(ctx,-34,-46,68,92,8); ctx.fill(); ctx.fillStyle='#9AA8C2'; for(let i=0;i<4;i++){ rr(ctx,-22,-28+i*16,44-(i===3?20:0),7,3); ctx.fill(); } },
  earMute:(ctx,t,c=P.ivory)=>{ ctx.strokeStyle=c; ctx.lineWidth=10; ctx.lineCap='round'; ctx.beginPath(); ctx.arc(0,-6,30,Math.PI*1.1,Math.PI*0.3); ctx.quadraticCurveTo(14,30,0,40); ctx.stroke(); ctx.strokeStyle=P.red; ctx.lineWidth=8; ctx.beginPath(); ctx.moveTo(-44,44); ctx.lineTo(44,-44); ctx.stroke(); },
  arrowUp:(ctx,t,c=P.red)=>{ ctx.strokeStyle=c; ctx.lineWidth=12; ctx.lineCap='round'; ctx.lineJoin='round'; ctx.beginPath(); ctx.moveTo(-36,30); ctx.lineTo(0,-30); ctx.lineTo(36,30); ctx.moveTo(0,-30); ctx.lineTo(0,46); ctx.stroke(); },
  arrowDown:(ctx,t,c=P.red)=>{ ctx.save(); ctx.rotate(Math.PI); ICON.arrowUp(ctx,t,c); ctx.restore(); },
  triangle:(ctx,t,c=P.amber)=>{ ctx.fillStyle=c; ctx.beginPath(); ctx.moveTo(0,-46); ctx.lineTo(48,38); ctx.lineTo(-48,38); ctx.closePath(); ctx.fill(); ctx.fillStyle=P.navyD; rr(ctx,-6,-16,12,30,4); ctx.fill(); ctx.beginPath(); ctx.arc(0,26,6,0,7); ctx.fill(); },
  person:(ctx,t,c=P.teal)=>{ ctx.fillStyle=c; ctx.beginPath(); ctx.arc(0,-30,16,0,7); ctx.fill(); rr(ctx,-20,-10,40,56,14); ctx.fill(); },
};
function drawIcon(ctx,name,x,y,size,t,color,alpha=1){ const f=ICON[name]; if(!f) return; ctx.save(); ctx.translate(x,y); ctx.scale(size/100,size/100); ctx.globalAlpha=alpha; f(ctx,t,color); ctx.restore(); }

// ---- the first organ set (Decision #47): spine (vertebra, disc, nerve), brain, heart, knee, bone. Bones ivory, nerves yellow, organs rose; all with faces.
const BONE_SHADE='rgba(80,60,30,0.22)', NERVE_SHADE='rgba(120,80,0,0.22)';
function vertebraBody(ctx){ ctx.beginPath(); ctx.moveTo(-40,-14); ctx.quadraticCurveTo(-42,-46,0,-44); ctx.quadraticCurveTo(42,-46,40,-14); ctx.quadraticCurveTo(38,4,0,2); ctx.quadraticCurveTo(-38,4,-40,-14); ctx.closePath(); }   // the body (bean), seen from above
function vertebraArch(ctx){ ctx.beginPath(); ctx.moveTo(-22,-4); ctx.quadraticCurveTo(-36,2,-34,16); ctx.quadraticCurveTo(-48,18,-46,28); ctx.quadraticCurveTo(-40,34,-28,30); ctx.quadraticCurveTo(-22,42,-8,42); ctx.quadraticCurveTo(-8,52,0,54); ctx.quadraticCurveTo(8,52,8,42); ctx.quadraticCurveTo(22,42,28,30); ctx.quadraticCurveTo(40,34,46,28); ctx.quadraticCurveTo(48,18,34,16); ctx.quadraticCurveTo(36,2,22,-4); ctx.closePath(); }   // rounded nubs, not wings   // arch with transverse processes and the spinous process
function vertebraHole(ctx){ ctx.beginPath(); ctx.ellipse(0,18,11,8,0,0,7); ctx.closePath(); }   // the canal the cord runs through
function discBody(ctx){ ctx.beginPath(); ctx.ellipse(0,-6,46,18,0,0,7); ctx.closePath(); }
function brainBody(ctx){ ctx.beginPath(); ctx.moveTo(-6,34); ctx.quadraticCurveTo(-44,34,-44,2); ctx.quadraticCurveTo(-46,-30,-14,-36); ctx.quadraticCurveTo(0,-42,14,-36); ctx.quadraticCurveTo(46,-30,44,2); ctx.quadraticCurveTo(44,30,16,34); ctx.quadraticCurveTo(10,42,0,36); ctx.quadraticCurveTo(-4,40,-6,34); ctx.closePath(); }
function heartBody(ctx){ ctx.beginPath(); ctx.moveTo(-8,-26); ctx.quadraticCurveTo(-44,-30,-42,4); ctx.quadraticCurveTo(-40,30,0,48); ctx.quadraticCurveTo(40,30,42,0); ctx.quadraticCurveTo(44,-26,12,-24); ctx.quadraticCurveTo(4,-20,-8,-26); ctx.closePath(); }   // an anatomical heart, apex down-right
function boneBody(ctx){ ctx.beginPath(); ctx.moveTo(-14,-30); ctx.lineTo(14,-30); ctx.quadraticCurveTo(32,-50,34,-36); ctx.quadraticCurveTo(44,-28,28,-20); ctx.lineTo(12,30); ctx.quadraticCurveTo(34,36,30,50); ctx.quadraticCurveTo(18,60,8,46); ctx.lineTo(-8,46); ctx.quadraticCurveTo(-18,60,-30,50); ctx.quadraticCurveTo(-34,36,-12,30); ctx.lineTo(-28,-20); ctx.quadraticCurveTo(-44,-28,-34,-36); ctx.quadraticCurveTo(-32,-50,-14,-30); ctx.closePath(); }
function kneeFemur(ctx){ ctx.beginPath(); ctx.moveTo(-12,-56); ctx.lineTo(12,-56); ctx.lineTo(14,-22); ctx.quadraticCurveTo(40,-20,36,2); ctx.quadraticCurveTo(20,10,0,4); ctx.quadraticCurveTo(-20,10,-36,2); ctx.quadraticCurveTo(-40,-20,-14,-22); ctx.closePath(); }
function kneeTibia(ctx){ ctx.beginPath(); ctx.moveTo(-34,16); ctx.quadraticCurveTo(0,8,34,16); ctx.quadraticCurveTo(26,30,12,32); ctx.lineTo(10,58); ctx.lineTo(-10,58); ctx.lineTo(-12,32); ctx.quadraticCurveTo(-26,30,-34,16); ctx.closePath(); }
function kneePatella(ctx){ ctx.beginPath(); ctx.ellipse(0,-6,16,19,0,0,7); ctx.closePath(); }
function nerveBody(ctx){ ctx.beginPath(); ctx.moveTo(-12,-50); ctx.quadraticCurveTo(-12,-60,0,-60); ctx.quadraticCurveTo(12,-60,12,-50); ctx.lineTo(10,14); ctx.lineTo(-10,14); ctx.closePath(); }
function nerveRoots(ctx,c){ ctx.strokeStyle=c; ctx.lineWidth=9; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(0,10); ctx.quadraticCurveTo(-10,30,-30,44); ctx.moveTo(-30,44); ctx.lineTo(-44,50); ctx.moveTo(-30,44); ctx.lineTo(-34,58); ctx.moveTo(0,10); ctx.quadraticCurveTo(10,30,30,44); ctx.moveTo(30,44); ctx.lineTo(44,50); ctx.moveTo(30,44); ctx.lineTo(34,58); ctx.stroke(); }   // the cord branches once, then twice: a nerve, not ribs
function smallFace(ctx,t,mood,sc=0.7,dy=0){ ctx.save(); ctx.translate(0,dy); ctx.scale(sc,sc); organFace(ctx,t,mood); ctx.restore(); }
Object.assign(ICON,{
  vertebra:(ctx,t,c)=>{ organHalo(ctx,t,c); const m=organAlert(c)?'worried':'calm';
    ctx.fillStyle=P.ivoryD; vertebraArch(ctx); ctx.fill(); organOutline(ctx,vertebraArch); ctx.fillStyle=P.navyD; vertebraHole(ctx); ctx.fill();
    ctx.fillStyle=P.ivory; vertebraBody(ctx); ctx.fill(); organShade(ctx,vertebraBody,BONE_SHADE); smallFace(ctx,t,m,0.78,-16); organOutline(ctx,vertebraBody); },
  disc:(ctx,t,c)=>{ organHalo(ctx,t,c); const m=organAlert(c)?'worried':'calm';
    const wall=(ctx)=>{ ctx.beginPath(); ctx.moveTo(-46,-6); ctx.lineTo(-46,16); ctx.ellipse(0,16,46,18,0,Math.PI,0,true); ctx.lineTo(46,-6); ctx.closePath(); };
    ctx.fillStyle='#6F8AA6'; wall(ctx); ctx.fill(); organOutline(ctx,wall);
    ctx.fillStyle=P.disc; discBody(ctx); ctx.fill(); ctx.fillStyle=P.ivory; ctx.beginPath(); ctx.ellipse(0,-6,15,6,0,0,7); ctx.fill();   // tough ring, soft centre (colour code)
    organShade(ctx,discBody,'rgba(40,60,90,0.22)'); organOutline(ctx,discBody); smallFace(ctx,t,m,0.5,14); },
  nerve:(ctx,t,c)=>{ organHalo(ctx,t,c); const m=organAlert(c)?'worried':'calm';
    if(window.STYLE.outline){ ctx.save(); ctx.lineWidth=9+OUTW*0.9; ctx.strokeStyle=OUT; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(0,10); ctx.quadraticCurveTo(-10,30,-30,44); ctx.moveTo(-30,44); ctx.lineTo(-44,50); ctx.moveTo(-30,44); ctx.lineTo(-34,58); ctx.moveTo(0,10); ctx.quadraticCurveTo(10,30,30,44); ctx.moveTo(30,44); ctx.lineTo(44,50); ctx.moveTo(30,44); ctx.lineTo(34,58); ctx.stroke(); ctx.restore(); } nerveRoots(ctx,P.yellow);
    ctx.fillStyle=P.yellow; nerveBody(ctx); ctx.fill(); organShade(ctx,nerveBody,NERVE_SHADE); smallFace(ctx,t,m,0.62,-30); organOutline(ctx,nerveBody); },
  brain:(ctx,t,c)=>{ organHalo(ctx,t,c); const m=organAlert(c)?'worried':'calm';
    ctx.fillStyle=P.organ; brainBody(ctx); ctx.fill(); organShade(ctx,brainBody);
    ctx.save(); brainBody(ctx); ctx.clip(); ctx.strokeStyle=P.organD; ctx.lineWidth=5; ctx.lineCap='round'; ctx.beginPath();   // gyri
    ctx.moveTo(-30,-10); ctx.quadraticCurveTo(-22,-26,-10,-14); ctx.moveTo(-34,14); ctx.quadraticCurveTo(-24,6,-20,22); ctx.moveTo(10,-30); ctx.quadraticCurveTo(22,-22,30,-30); ctx.moveTo(22,8); ctx.quadraticCurveTo(32,16,26,26); ctx.moveTo(0,-36); ctx.lineTo(0,36); ctx.stroke(); ctx.restore();
    smallFace(ctx,t,m,0.75,6); organOutline(ctx,brainBody); },
  heart:(ctx,t,c)=>{ organHalo(ctx,t,c); const m=organAlert(c)?'worried':'calm'; const beat=1+0.03*Math.max(0,Math.sin(t*7.5))**8;
    ctx.save(); ctx.scale(beat,beat);
    ctx.strokeStyle=P.organD; ctx.lineWidth=10; ctx.lineCap='round'; if(window.STYLE.outline){ ctx.save(); ctx.strokeStyle=OUT; ctx.lineWidth=10+OUTW*0.9; ctx.beginPath(); ctx.moveTo(-2,-26); ctx.lineTo(-2,-50); ctx.moveTo(14,-26); ctx.quadraticCurveTo(26,-40,34,-46); ctx.stroke(); ctx.restore(); }
    ctx.beginPath(); ctx.moveTo(-2,-26); ctx.lineTo(-2,-50); ctx.moveTo(14,-26); ctx.quadraticCurveTo(26,-40,34,-46); ctx.stroke();   // aorta + pulmonary trunk
    ctx.fillStyle=P.organ; heartBody(ctx); ctx.fill(); organShade(ctx,heartBody); smallFace(ctx,t,m,0.75,2); organOutline(ctx,heartBody); ctx.restore(); },
  knee:(ctx,t,c)=>{ organHalo(ctx,t,c); const m=organAlert(c)?'worried':'calm';
    ctx.fillStyle=P.ivory; kneeFemur(ctx); ctx.fill(); organShade(ctx,kneeFemur,BONE_SHADE); organOutline(ctx,kneeFemur);
    kneeTibia(ctx); ctx.fillStyle=P.ivory; ctx.fill(); organShade(ctx,kneeTibia,BONE_SHADE); organOutline(ctx,kneeTibia);
    ctx.fillStyle=P.disc; ctx.beginPath(); ctx.ellipse(0,8,30,5,0,0,7); ctx.fill();   // joint space / cartilage in the disc blue-grey
    ctx.fillStyle=P.ivory; kneePatella(ctx); ctx.fill(); organShade(ctx,kneePatella,BONE_SHADE); smallFace(ctx,t,m,0.45,-6); organOutline(ctx,kneePatella); },
  bone:(ctx,t,c)=>{ organHalo(ctx,t,c); const m=organAlert(c)?'worried':'calm';
    ctx.fillStyle=P.ivory; boneBody(ctx); ctx.fill(); organShade(ctx,boneBody,BONE_SHADE); smallFace(ctx,t,m,0.6,6); organOutline(ctx,boneBody); },
});
