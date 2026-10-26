// env/workplace.js — an office desk: window with blinds, shelf, monitor, keyboard, mug, plant, office chair; flat ceiling light.
function drawWorkplace(ctx,t,p,cam){
  const FL=p.A.floor;
  layer(ctx,cam,0.45,()=>{
    const g=ctx.createLinearGradient(0,0,0,FL); g.addColorStop(0,'#26324D'); g.addColorStop(1,'#1C2740'); ctx.fillStyle=g; ctx.fillRect(-200,-200,W+400,FL+200);
    const r=ctx.createRadialGradient(W*0.45,H*0.0,0,W*0.45,H*0.0,H*0.9); r.addColorStop(0,'rgba(240,240,230,0.12)'); r.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=r; ctx.fillRect(-200,-200,W+400,FL+200);
    // window with blinds, left
    const wx=W*0.06, wy=H*0.16, ww=W*0.22, wh=H*0.42; ctx.fillStyle='#9FB7D1'; rr(ctx,wx,wy,ww,wh,8); ctx.fill();
    ctx.strokeStyle='#D9E2EC'; ctx.lineWidth=5; for(let y=wy+16;y<wy+wh;y+=22){ ctx.beginPath(); ctx.moveTo(wx+6,y); ctx.lineTo(wx+ww-6,y); ctx.stroke(); } ctx.strokeStyle=P.ivory; ctx.lineWidth=10; rr(ctx,wx,wy,ww,wh,8); ctx.stroke();
    // shelf with files, right
    const sx=W*0.66, sy=H*0.18; ctx.fillStyle='#B9A585'; rr(ctx,sx,sy+120,W*0.28,16,4); ctx.fill();
    ['#2BB3A3','#F2994A','#8C7BD3','#EB5757','#EDE6D6'].forEach((c,i)=>{ ctx.fillStyle=c; rr(ctx,sx+20+i*58,sy+10,44,110,4); ctx.fill(); });
    // noticeboard
    ctx.fillStyle='#C9B99A'; rr(ctx,W*0.40,H*0.14,W*0.20,H*0.24,6); ctx.fill(); ctx.fillStyle=P.ivory; rr(ctx,W*0.42,H*0.17,80,100,3); ctx.fill(); rr(ctx,W*0.50,H*0.20,90,70,3); ctx.fill(); ctx.fillStyle=P.amber; rr(ctx,W*0.455,H*0.28,70,60,3); ctx.fill();
    ctx.fillStyle='#0E1526'; ctx.fillRect(-200,FL-14,W+400,16);
  });
  layer(ctx,cam,1.0,()=>{
    const g=ctx.createLinearGradient(0,FL-10,0,H); g.addColorStop(0,'#5A6478'); g.addColorStop(1,'#6E7A90'); ctx.fillStyle=g; ctx.fillRect(-200,FL-10,W+400,H-FL+210);   // carpet
    { const gg=ctx.createLinearGradient(0,FL-10,0,FL+70); gg.addColorStop(0,'rgba(18,26,46,0.30)'); gg.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=gg; ctx.fillRect(-200,FL-10,W+400,80); }
    // desk, centre-right, with monitor, keyboard, mug, plant
    const dx=W*0.46; ctx.save(); ctx.filter='blur(10px)'; ctx.fillStyle='rgba(18,26,46,0.35)'; ctx.beginPath(); ctx.ellipse(dx+300,FL+6,340,22,0,0,7); ctx.fill(); ctx.restore();
    ctx.fillStyle='#D9C9A8'; rr(ctx,dx,FL-150,600,24,6); ctx.fill(); ctx.fillStyle='#B9A585'; rr(ctx,dx+30,FL-126,22,126,4); ctx.fill(); rr(ctx,dx+548,FL-126,22,126,4); ctx.fill();
    ctx.fillStyle='#1B2238'; rr(ctx,dx+250,FL-310,220,150,10); ctx.fill(); ctx.fillStyle='rgba(43,179,163,0.45)'; rr(ctx,dx+262,FL-298,196,126,4); ctx.fill(); ctx.fillStyle='#6E7F96'; rr(ctx,dx+350,FL-160,20,14,2); ctx.fill();
    ctx.fillStyle='#CFD9E6'; rr(ctx,dx+230,FL-166,200,14,4); ctx.fill();   // keyboard
    ctx.fillStyle=P.ivory; rr(ctx,dx+120,FL-196,44,46,8); ctx.fill(); ctx.strokeStyle=P.ivory; ctx.lineWidth=8; ctx.beginPath(); ctx.arc(dx+170,FL-173,14,-1.2,1.2); ctx.stroke();   // mug
    ctx.save(); ctx.translate(dx+520,FL-150); ctx.scale(0.4,0.4); ctx.translate(-W*0.885,-FL); drawPlant(ctx); ctx.restore();
    // office chair, in front of the desk (the sit pose lands on it)
    const cx=W*0.40; ctx.fillStyle='#6E7F96'; rr(ctx,cx-30,FL-118,230,26,10); ctx.fill(); rr(ctx,cx-40,FL-300,34,300,10); ctx.fill(); ctx.fillStyle='#3A4252'; rr(ctx,cx+70,FL-96,18,80,4); ctx.fill(); ctx.beginPath(); ctx.moveTo(cx+79,FL-16); ctx.lineTo(cx+10,FL+4); ctx.lineTo(cx+150,FL+4); ctx.closePath(); ctx.fill(); dot(ctx,cx+10,FL+4,10,'#3A4252'); dot(ctx,cx+150,FL+4,10,'#3A4252');
  });
}
