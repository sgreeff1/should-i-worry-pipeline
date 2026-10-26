// env/clinic.js — a calm consulting room: cool light, desk, chair, exam couch, poster, blind
function drawClinic(ctx,t,p,cam){
  const FL=p.A.floor;
  layer(ctx,cam,0.45,()=>{
    const g=ctx.createLinearGradient(0,0,0,FL); g.addColorStop(0,'#2B3F5E'); g.addColorStop(1,'#1E2E48'); ctx.fillStyle=g; ctx.fillRect(-200,-200,W+400,FL+200);
    // ceiling light wash (cool)
    const r=ctx.createRadialGradient(W*0.5,H*0.05,0,W*0.5,H*0.05,H*0.9); r.addColorStop(0,'rgba(220,235,255,0.14)'); r.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=r; ctx.fillRect(-200,-200,W+400,FL+200);
    // window blind, right
    const wx=W*0.74, wy=H*0.08, ww=W*0.22, wh=H*0.50; ctx.fillStyle='#CFD9E6'; rr(ctx,wx,wy,ww,wh,8); ctx.fill();
    ctx.strokeStyle='#9FB0C6'; ctx.lineWidth=4; for(let y=wy+18;y<wy+wh;y+=26){ ctx.beginPath(); ctx.moveTo(wx+8,y); ctx.lineTo(wx+ww-8,y); ctx.stroke(); }
    ctx.strokeStyle=P.ivory; ctx.lineWidth=10; rr(ctx,wx,wy,ww,wh,8); ctx.stroke();
    // poster: an abstract spine diagram
    const px=W*0.10, py=H*0.14; ctx.fillStyle=P.ivory; rr(ctx,px,py,210,290,8); ctx.fill(); ctx.fillStyle='#24405C'; rr(ctx,px+14,py+14,182,262,4); ctx.fill();
    for(let i=0;i<7;i++){ ctx.fillStyle=P.ivory; rr(ctx,px+86,py+36+i*32,38,22,6); ctx.fill(); ctx.fillStyle=P.disc; rr(ctx,px+90,py+58+i*32,30,8,3); ctx.fill(); }
    ctx.fillStyle='#0E1526'; ctx.fillRect(-200,FL-14,W+400,16);
  });
  layer(ctx,cam,1.0,()=>{
    const g=ctx.createLinearGradient(0,FL-10,0,H); g.addColorStop(0,'#9FB0BE'); g.addColorStop(1,'#C5D1DA'); ctx.fillStyle=g; ctx.fillRect(-200,FL-10,W+400,H-FL+210);  // lino
    { const gg=ctx.createLinearGradient(0,FL-10,0,FL+70); gg.addColorStop(0,'rgba(18,26,46,0.30)'); gg.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=gg; ctx.fillRect(-200,FL-10,W+400,80); }
    // exam couch, right
    const cx=W*0.62; ctx.save(); ctx.filter='blur(10px)'; ctx.fillStyle='rgba(18,26,46,0.35)'; ctx.beginPath(); ctx.ellipse(cx+230,FL+6,250,20,0,0,7); ctx.fill(); ctx.restore();
    ctx.fillStyle='#8FA9C4'; rr(ctx,cx,FL-150,460,60,18); ctx.fill(); ctx.fillStyle='#F7F2E8'; rr(ctx,cx+10,FL-158,440,20,8); ctx.fill();
    ctx.fillStyle='#6E7F96'; rr(ctx,cx+40,FL-90,22,90,4); ctx.fill(); rr(ctx,cx+400,FL-90,22,90,4); ctx.fill();
    // desk, left of centre, with a monitor and a plant
    const dx=W*0.06; ctx.fillStyle='#D9C9A8'; rr(ctx,dx,FL-130,400,22,6); ctx.fill(); ctx.fillStyle='#B9A585'; rr(ctx,dx+20,FL-108,20,108,4); ctx.fill(); rr(ctx,dx+360,FL-108,20,108,4); ctx.fill();
    ctx.fillStyle='#1B2238'; rr(ctx,dx+200,FL-250,150,110,8); ctx.fill(); ctx.fillStyle='#2BB3A3'; ctx.globalAlpha=0.5; rr(ctx,dx+212,FL-238,126,86,4); ctx.fill(); ctx.globalAlpha=1; ctx.fillStyle='#6E7F96'; rr(ctx,dx+265,FL-140,20,12,2); ctx.fill();
    ctx.save(); ctx.translate(dx+90,FL-130); ctx.scale(0.45,0.45); ctx.translate(-W*0.885,-FL); drawPlant(ctx); ctx.restore();
  });
}
