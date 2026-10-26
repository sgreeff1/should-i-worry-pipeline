// env/hospital.js — emergency department bay: curtain track with a drawn-back curtain, trolley with rail, monitor on a stand, wall sign, lino floor. Cool-white light, busier than the clinic.
function drawHospital(ctx,t,p,cam){
  const FL=p.A.floor;
  layer(ctx,cam,0.45,()=>{
    const g=ctx.createLinearGradient(0,0,0,FL); g.addColorStop(0,'#2A3C5A'); g.addColorStop(1,'#1C2A44'); ctx.fillStyle=g; ctx.fillRect(-200,-200,W+400,FL+200);
    const r=ctx.createRadialGradient(W*0.5,H*0.0,0,W*0.5,H*0.0,H*0.9); r.addColorStop(0,'rgba(225,240,255,0.16)'); r.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=r; ctx.fillRect(-200,-200,W+400,FL+200);
    // ceiling light strip
    ctx.fillStyle='#E9F1FA'; rr(ctx,W*0.30,H*0.04,W*0.40,16,8); ctx.fill(); glowOn(ctx,'rgba(225,240,255,0.6)',30); ctx.fill(); glowOff(ctx);
    // curtain track and curtain (drawn back, left)
    ctx.strokeStyle='#9FB0C6'; ctx.lineWidth=8; ctx.beginPath(); ctx.moveTo(W*0.04,H*0.12); ctx.lineTo(W*0.70,H*0.12); ctx.stroke();
    ctx.fillStyle='#5F8FB5'; ctx.beginPath(); ctx.moveTo(W*0.05,H*0.12); for(let i=0;i<7;i++){ const x=W*0.05+i*34; ctx.quadraticCurveTo(x+17,H*0.12+((i%2)?18:-6),x+34,H*0.12); } ctx.lineTo(W*0.05+7*34,FL-60); ctx.quadraticCurveTo(W*0.05+120,FL-40,W*0.05,FL-60); ctx.closePath(); ctx.fill();
    ctx.strokeStyle='rgba(18,26,46,0.25)'; ctx.lineWidth=3; for(let i=1;i<7;i++){ const x=W*0.05+i*34; ctx.beginPath(); ctx.moveTo(x,H*0.12+8); ctx.lineTo(x+10,FL-62); ctx.stroke(); }
    // wall sign
    ctx.fillStyle=P.ivory; rr(ctx,W*0.76,H*0.16,W*0.18,78,10); ctx.fill(); ctx.strokeStyle=P.teal; ctx.lineWidth=6; rr(ctx,W*0.76,H*0.16,W*0.18,78,10); ctx.stroke();
    ctx.fillStyle='#1B2238'; ctx.font='800 34px Inter'; ctx.textAlign='center'; ctx.fillText('EMERGENCY',W*0.85,H*0.16+52);
    // hand-gel dispenser and a clock
    ctx.fillStyle='#CFD9E6'; rr(ctx,W*0.71,H*0.36,34,70,6); ctx.fill(); ctx.fillStyle=P.teal; rr(ctx,W*0.71+8,H*0.36+16,18,40,3); ctx.fill();
    ctx.save(); ctx.translate(W*0.85,H*0.40); drawIcon(ctx,'clock',0,0,110,t); ctx.restore();
    ctx.fillStyle='#0E1526'; ctx.fillRect(-200,FL-14,W+400,16);
  });
  layer(ctx,cam,1.0,()=>{
    const g=ctx.createLinearGradient(0,FL-10,0,H); g.addColorStop(0,'#A9B6C2'); g.addColorStop(1,'#CBD5DE'); ctx.fillStyle=g; ctx.fillRect(-200,FL-10,W+400,H-FL+210);
    { const gg=ctx.createLinearGradient(0,FL-10,0,FL+70); gg.addColorStop(0,'rgba(18,26,46,0.30)'); gg.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=gg; ctx.fillRect(-200,FL-10,W+400,80); }
    // trolley, right: mattress, rail, wheels
    const tx=W*0.56; ctx.save(); ctx.filter='blur(10px)'; ctx.fillStyle='rgba(18,26,46,0.35)'; ctx.beginPath(); ctx.ellipse(tx+240,FL+6,270,22,0,0,7); ctx.fill(); ctx.restore();
    ctx.fillStyle='#6E7F96'; rr(ctx,tx,FL-170,480,30,10); ctx.fill(); ctx.fillStyle='#F7F2E8'; rr(ctx,tx+10,FL-196,460,32,10); ctx.fill(); ctx.fillStyle='#CFD9E6'; rr(ctx,tx+20,FL-214,110,24,8); ctx.fill();   // pillow
    ctx.strokeStyle='#9FB0C6'; ctx.lineWidth=10; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(tx+30,FL-200); ctx.lineTo(tx+30,FL-280); ctx.lineTo(tx+180,FL-280); ctx.lineTo(tx+180,FL-200); ctx.stroke();   // rail
    ctx.fillStyle='#6E7F96'; rr(ctx,tx+60,FL-140,18,110,4); ctx.fill(); rr(ctx,tx+400,FL-140,18,110,4); ctx.fill(); dot(ctx,tx+69,FL-18,18,'#2A3B5C'); dot(ctx,tx+409,FL-18,18,'#2A3B5C');
    // monitor on a stand, far right
    const mx=W*0.90; ctx.fillStyle='#6E7F96'; rr(ctx,mx-8,FL-330,16,330,4); ctx.fill(); ctx.fillStyle='#1B2238'; rr(ctx,mx-90,FL-430,180,120,10); ctx.fill();
    ctx.strokeStyle=P.teal; ctx.lineWidth=4; ctx.beginPath(); for(let i=0;i<=160;i+=4){ const x=mx-80+i; const ph=(i/160*4+t*1.2)%1; const y=FL-370-(ph<0.1? ph*300 : ph<0.2? 30-(ph-0.1)*500 : 0); i?ctx.lineTo(x,y):ctx.moveTo(x,y); } ctx.stroke();
  });
}
