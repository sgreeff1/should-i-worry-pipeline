// env/street.js — a pavement at dusk: building fronts, a lamp post, a bench, a tree, kerb and road. Warm lamp pool on the pavement.
function drawStreet(ctx,t,p,cam){
  const FL=p.A.floor;
  layer(ctx,cam,0.45,()=>{
    const g=ctx.createLinearGradient(0,0,0,FL); g.addColorStop(0,'#1A2440'); g.addColorStop(0.6,'#2B3B62'); g.addColorStop(1,'#3A4A72'); ctx.fillStyle=g; ctx.fillRect(-200,-200,W+400,FL+200);
    for(const [a,b,c] of STARS.slice(0,40)){ dot(ctx,a*W,b*H*0.35,1.2+c*1.5,`rgba(237,230,214,${0.25+0.3*c})`); }
    dot(ctx,W*0.82,H*0.18,36,P.ivory); dot(ctx,W*0.82+14,H*0.18-8,30,'#1A2440');   // moon
    // building fronts
    const bs=[[0.00,0.30,0.22],[0.22,0.22,0.16],[0.38,0.36,0.26],[0.64,0.28,0.18],[0.82,0.40,0.20]];
    bs.forEach(([x,h,w],i)=>{ const bx=W*x, bh=H*h, bw=W*w; ctx.fillStyle=i%2?'#223250':'#1B2A46'; ctx.fillRect(bx,FL-80-bh,bw,bh+80);
      for(let r=0;r<Math.floor(bh/90);r++) for(let c=0;c<Math.floor(bw/80);c++){ const lit=rnd(i*31+r*7+c*3)>0.55; ctx.fillStyle=lit?'rgba(242,201,76,0.55)':'rgba(237,230,214,0.08)'; rr(ctx,bx+28+c*80,FL-80-bh+26+r*90,36,46,4); ctx.fill(); } });
    ctx.fillStyle='#0E1526'; ctx.fillRect(-200,FL-14,W+400,16);
  });
  layer(ctx,cam,1.0,()=>{
    // pavement, kerb, road
    ctx.fillStyle='#8E8A80'; ctx.fillRect(-200,FL-10,W+400,120); ctx.fillStyle='#B9B3A6'; ctx.fillRect(-200,FL+100,W+400,18); ctx.fillStyle='#2A2F3A'; ctx.fillRect(-200,FL+118,W+400,H-FL);
    ctx.strokeStyle='rgba(237,230,214,0.35)'; ctx.lineWidth=6; ctx.setLineDash([60,40]); ctx.beginPath(); ctx.moveTo(-200,FL+190); ctx.lineTo(W+200,FL+190); ctx.stroke(); ctx.setLineDash([]);
    for(let x=-200;x<W+200;x+=140){ ctx.strokeStyle='rgba(18,26,46,0.25)'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(x,FL-10); ctx.lineTo(x,FL+100); ctx.stroke(); }
    // lamp post, right of centre, with a warm pool
    const lx=W*0.70; ctx.fillStyle='#3A4252'; rr(ctx,lx-9,FL-520,18,520,6); ctx.fill(); ctx.fillStyle='#3A4252'; rr(ctx,lx-50,FL-540,100,26,8); ctx.fill();
    ctx.fillStyle=P.yellow; rr(ctx,lx-38,FL-534,76,14,6); ctx.fill(); glowOn(ctx,'rgba(242,201,76,0.8)',40); ctx.fill(); glowOff(ctx);
    const pool=ctx.createRadialGradient(lx,FL+20,0,lx,FL+20,380); pool.addColorStop(0,'rgba(242,201,76,0.22)'); pool.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=pool; ctx.fillRect(lx-400,FL-60,800,200);
    // bench, left
    const bx=W*0.12; ctx.fillStyle='#6B4F3A'; rr(ctx,bx,FL-120,300,22,6); ctx.fill(); rr(ctx,bx,FL-190,300,18,6); ctx.fill(); ctx.fillStyle='#3A4252'; rr(ctx,bx+20,FL-100,16,100,4); ctx.fill(); rr(ctx,bx+264,FL-100,16,100,4); ctx.fill(); rr(ctx,bx+20,FL-200,14,90,4); ctx.fill(); rr(ctx,bx+266,FL-200,14,90,4); ctx.fill();
    // tree, far left
    ctx.fillStyle='#4A3628'; rr(ctx,W*0.03,FL-300,30,300,8); ctx.fill(); ctx.fillStyle='#2E6B5A'; dot(ctx,W*0.03+15,FL-360,120,'#2E6B5A'); dot(ctx,W*0.03-40,FL-300,80,'#35776A'); dot(ctx,W*0.03+80,FL-310,90,'#2A6252');
    { const gg=ctx.createLinearGradient(0,FL-10,0,FL+60); gg.addColorStop(0,'rgba(18,26,46,0.25)'); gg.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=gg; ctx.fillRect(-200,FL-10,W+400,70); }
  });
}
