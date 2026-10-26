// episode.js — the composer: a JSON shot list → frames. Overlays (cards, citations, disclaimer), crossfades, grade.
let EP=null; const ANIMS={};
function card(ctx,text,t0,t,until){ const a=clamp((t-t0)/0.35), out=until!=null?clamp((until-t)/0.3):1, al=Math.min(a,out); if(al<=0) return;
  const y0=H*0.80, sz=64; ctx.font=STYLE_FONT.card; const w=ctx.measureText(text).width; const yy=y0+(1-EASE.ob(a))*40;
  ctx.globalAlpha=al; rr(ctx,W/2-w/2-38,yy-sz*0.95,w+76,sz*1.45,26); ctx.fillStyle='rgba(18,26,46,0.78)'; ctx.fill(); ctx.fillStyle=P.white; ctx.textAlign='center'; ctx.textBaseline='alphabetic'; ctx.fillText(text,W/2,yy+sz*0.12); ctx.globalAlpha=1; }
function cite(ctx,text,t0,t,until){ const al=Math.min(clamp((t-t0)/0.4), until!=null?clamp((until-t)/0.3):1); if(al<=0) return;
  ctx.font='500 36px Inter'; const w=ctx.measureText(text).width; ctx.globalAlpha=al*0.8; rr(ctx,44,H-96,w+40,62,16); ctx.fillStyle=P.navyD; ctx.fill(); ctx.globalAlpha=al*0.95; ctx.fillStyle=P.ivory; ctx.textAlign='left'; ctx.fillText(text,64,H-52); ctx.globalAlpha=1; }
function prepShot(sh){ // build anim objects once per shot
  if(sh._S) return sh._S; const S={dur:sh.t1-sh.t0};
  if(sh.kind==='CHAR'){ S.anim = sh.anim==='hook'? HOOK : poseAnim(sh.seq,Object.assign({face:sh.face,outfit:sh.outfit},sh.opts||{})); if(sh.anim!=='hook'){ S.anim.SHOTS=sh.shots||[{t0:0,t1:S.dur,w:()=>[W/2,H*0.6],z:[1.0,1.04],s:[W/2,H/2]}]; S.anim.end=S.dur; } homeSetup(S.anim); }
  if(sh.kind==='FIGURE'){ const n=sh.count||1, gap=sh.gap||520; S.figs=[...Array(n)].map((_,i)=>staticPose(sh.pose||'stand',{standX:W/2-(n-1)*gap/2+i*gap, face:[[0,(sh.faces&&sh.faces[i])||sh.face||'calm']], outfit:(sh.outfits&&sh.outfits[i])||sh.outfit})); }
  sh._S=S; return S;
}
function drawShot(ctx,sh,t,CX,CC){ const S=prepShot(sh); const lt=t-sh.t0;
  S.char=(fn)=>{ CX.setTransform(1,0,0,1,0,0); CX.clearRect(0,0,W,H); fn(CX); lightCharacter(CX); ctx.drawImage(CC,0,0); };
  TEMPLATES[sh.kind](ctx,lt,sh,S); }
function drawEpisode(ctx,t,CX,CC,OC2){
  ctx.setTransform(1,0,0,1,0,0); ctx.globalAlpha=1; ctx.imageSmoothingQuality='high'; ctx.fillStyle=P.navyD; ctx.fillRect(0,0,W,H);
  const i=EP.shots.findIndex(s=>t>=s.t0&&t<s.t1); const idx=i<0?EP.shots.length-1:i; const sh=EP.shots[idx];
  drawShot(ctx,sh,t,CX,CC);
  const fade=clamp((t-sh.t0)/MOTION.crossfade);
  if(fade<1 && idx>0 && !sh.cut){ const pv=EP.shots[idx-1]; const o=OC2.getContext('2d'); o.setTransform(1,0,0,1,0,0); o.fillStyle=P.navyD; o.fillRect(0,0,W,H); drawShot(o,pv,Math.min(t,pv.t1-0.001),CX,CC); ctx.globalAlpha=1-fade; ctx.drawImage(OC2,0,0); ctx.globalAlpha=1; }
  for(const c of EP.cards) card(ctx,c[0],c[1],t,c[2]);
  for(const c of EP.cites) cite(ctx,c[0],c[1],t,c[2]);
  drawMeterTrack(ctx,t,EP.meter);   // worry meter overlay (Decision #46)
  grade(ctx,t); vignette(ctx); disclaimer(ctx,t); if(EP.tag) tag(ctx,EP.tag);
}
