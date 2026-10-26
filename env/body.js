// env/body.js — the anatomy stage: deep navy with an inner teal glow, where the restyled Servier art sits
function drawBodyStage(ctx,t,cam,opts={}){
  layer(ctx,cam,0.45,()=>{
    const g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#24345A'); g.addColorStop(1,P.navyD); ctx.fillStyle=g; ctx.fillRect(-300,-300,W+600,H+600);
    const r=ctx.createRadialGradient(W*0.5,H*0.5,0,W*0.5,H*0.5,H*0.75); r.addColorStop(0,`rgba(43,179,163,${opts.glow??0.14})`); r.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=r; ctx.fillRect(-300,-300,W+600,H+600);
    ctx.strokeStyle='rgba(237,230,214,0.05)'; ctx.lineWidth=1; for(let x=0;x<W;x+=120){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); } for(let y=0;y<H;y+=120){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
    for(const [a,b,c] of STARS.slice(0,30)){ dot(ctx,a*W,b*H,1.5+c*2,`rgba(237,230,214,${0.2+0.2*Math.sin(t*(1+c)+c*7)})`); }
  });
}
