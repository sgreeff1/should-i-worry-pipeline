// finish.js — character lighting, grade, grain, vignette, overlays
function disclaimer(ctx,t){
  const al=Math.min(clamp(t/0.5), clamp((10-t)/0.5)); if(al<=0) return;
  ctx.globalAlpha=al*0.8; ctx.font='500 30px Inter'; ctx.textAlign='right'; ctx.fillStyle=P.ivory;
  ctx.fillText('General education, not medical advice', W-50, H-46); ctx.globalAlpha=1;
}
function tag(ctx,text){
  ctx.font=STYLE_FONT.tag; ctx.textAlign='left'; ctx.globalAlpha=0.55; ctx.fillStyle=P.ivory;
  ctx.fillText(text, 40, 48); ctx.globalAlpha=1;
}

function grade(ctx,t){
  // warm highlight wash from the lamp side, lifted blacks, animated grain
  ctx.save();
  ctx.globalCompositeOperation='soft-light'; const g=ctx.createRadialGradient(W*0.70,H*0.35,0,W*0.70,H*0.35,W*0.7); g.addColorStop(0,'rgba(255,200,120,0.55)'); g.addColorStop(1,'rgba(20,30,70,0.35)'); ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  ctx.globalCompositeOperation='lighten'; ctx.fillStyle='rgba(18,26,46,0.9)'; ctx.globalAlpha=0.07; ctx.fillRect(0,0,W,H);
  ctx.globalCompositeOperation='overlay'; ctx.globalAlpha=0.06; const ox=Math.floor(rnd(Math.floor(t*25))*256), oy=Math.floor(rnd(Math.floor(t*25)+99)*256);
  for(let y=-256;y<H+256;y+=256) for(let x=-256;x<W+256;x+=256) ctx.drawImage(GR,x+ox,y+oy);
  ctx.restore();
}
function lightCharacter(ctx){ // warm from the lamp side, cool from the window side (character layer only)
  ctx.save(); ctx.globalCompositeOperation='source-atop';
  const g=ctx.createLinearGradient(0,0,W,0); g.addColorStop(0,'rgba(20,30,70,0.26)'); g.addColorStop(0.55,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(255,190,110,0.22)'); ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  ctx.restore();
}
function vignette(ctx){ const g=ctx.createRadialGradient(W/2,H*0.5,H*0.3,W/2,H*0.5,H*1.0); g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(8,12,24,0.5)'); ctx.fillStyle=g; ctx.fillRect(0,0,W,H); }
