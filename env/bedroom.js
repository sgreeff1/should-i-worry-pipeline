// env/bedroom.js — a dim bedroom at night: bed, bedside lamp, window with moon
const BED = { x:W*0.30, w:W*0.46, h:120 };
function drawBedroom(ctx,t,p,cam){
  const FL=p.A.floor;
  layer(ctx,cam,0.45,()=>{
    const g=ctx.createLinearGradient(0,0,0,FL); g.addColorStop(0,'#1A2240'); g.addColorStop(1,'#11182C'); ctx.fillStyle=g; ctx.fillRect(-200,-200,W+400,FL+200);
    // window with moon, left
    const wx=W*0.06, wy=H*0.10, ww=W*0.17, wh=H*0.46;
    ctx.fillStyle='#182542'; rr(ctx,wx,wy,ww,wh,10); ctx.fill();
    ctx.save(); rr(ctx,wx,wy,ww,wh,10); ctx.clip(); for(const [a,b,c] of STARS){ dot(ctx,wx+a*ww,wy+b*wh,1+c*1.6,`rgba(237,230,214,${0.5+0.5*Math.sin(t*(1.5+c*2)+c*20)})`); }
    const mx=wx+ww*0.68,my=wy+wh*0.25; const gg=ctx.createRadialGradient(mx,my,0,mx,my,80); gg.addColorStop(0,'rgba(237,230,214,0.35)'); gg.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=gg; ctx.fillRect(mx-80,my-80,160,160);
    ctx.fillStyle='#F2EBDD'; ctx.beginPath(); ctx.arc(mx,my,22,0,7); ctx.fill(); ctx.fillStyle='#182542'; ctx.beginPath(); ctx.arc(mx+10,my-5,19,0,7); ctx.fill(); ctx.restore();
    ctx.strokeStyle=P.ivory; ctx.lineWidth=12; rr(ctx,wx,wy,ww,wh,10); ctx.stroke(); ctx.lineWidth=7; ctx.beginPath(); ctx.moveTo(wx+ww/2,wy); ctx.lineTo(wx+ww/2,wy+wh); ctx.stroke();
    // bedside lamp glow on the wall
    const lx=BED.x+BED.w+150, ly=FL-250; const r=ctx.createRadialGradient(lx,ly,0,lx,ly,420); r.addColorStop(0,`rgba(242,153,74,${0.18*flicker(t)})`); r.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=r; ctx.fillRect(-200,-200,W+400,FL+200);
    ctx.fillStyle='#0E1526'; ctx.fillRect(-200,FL-14,W+400,16);
  });
  layer(ctx,cam,1.0,()=>{
    const g=ctx.createLinearGradient(0,FL-10,0,H); g.addColorStop(0,'#5A4E6E'); g.addColorStop(1,'#7A6A8C'); ctx.fillStyle=g; ctx.fillRect(-200,FL-10,W+400,H-FL+210);   // carpet, muted mauve
    { const gg=ctx.createLinearGradient(0,FL-10,0,FL+70); gg.addColorStop(0,'rgba(18,26,46,0.35)'); gg.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=gg; ctx.fillRect(-200,FL-10,W+400,80); }
    // bed
    ctx.save(); ctx.filter='blur(10px)'; ctx.fillStyle='rgba(18,26,46,0.4)'; ctx.beginPath(); ctx.ellipse(BED.x+BED.w/2,FL+6,BED.w*0.55,22,0,0,7); ctx.fill(); ctx.restore();
    ctx.fillStyle='#8C7355'; rr(ctx,BED.x-30,FL-BED.h-20,40,BED.h+20,8); ctx.fill(); rr(ctx,BED.x+BED.w-10,FL-BED.h-80,40,BED.h+80,8); ctx.fill();   // frame ends
    ctx.fillStyle='#EDE6D6'; rr(ctx,BED.x,FL-BED.h,BED.w,70,16); ctx.fill();                       // mattress
    ctx.fillStyle=P.teal; rr(ctx,BED.x+BED.w*0.30,FL-BED.h-6,BED.w*0.72,66,[14,14,8,8]); ctx.fill(); // blanket
    ctx.fillStyle=P.tealD; ctx.globalAlpha=0.5; rr(ctx,BED.x+BED.w*0.30,FL-BED.h+40,BED.w*0.72,14,6); ctx.fill(); ctx.globalAlpha=1;
    ctx.fillStyle='#F7F2E8'; rr(ctx,BED.x+BED.w*0.03,FL-BED.h-42,BED.w*0.24,56,20); ctx.fill();     // pillow
    ctx.fillStyle='#6E5A40'; rr(ctx,BED.x,FL-BED.h+70,BED.w,BED.h-70,[0,0,10,10]); ctx.fill();        // base
    // bedside table + lamp
    const tx=BED.x+BED.w+90; ctx.fillStyle='#8C7355'; rr(ctx,tx,FL-120,120,120,8); ctx.fill(); ctx.fillStyle='#A68A66'; rr(ctx,tx+12,FL-100,96,28,4); ctx.fill();
    const lx=tx+60, ly=FL-250; ctx.fillStyle=P.ivory; rr(ctx,lx-5,ly+40,10,90,4); ctx.fill();
    const r=ctx.createRadialGradient(lx,ly+30,0,lx,ly+30,120); r.addColorStop(0,`rgba(255,200,120,${0.8*flicker(t)})`); r.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=r; ctx.fillRect(lx-130,ly-100,260,260);
    const sg=ctx.createLinearGradient(0,ly,0,ly+60); sg.addColorStop(0,'#F2EBDD'); sg.addColorStop(1,'#F4C98E'); ctx.fillStyle=sg; ctx.beginPath(); ctx.moveTo(lx-28,ly); ctx.lineTo(lx+28,ly); ctx.lineTo(lx+48,ly+60); ctx.lineTo(lx-48,ly+60); ctx.closePath(); ctx.fill();
    // rug
    ctx.fillStyle='#2A4A6A'; rr(ctx,BED.x-120,FL-2,BED.w*0.5,26,9); ctx.fill();
  });
}
