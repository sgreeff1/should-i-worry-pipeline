// env/void.js — the abstract stage for data, icons and figure shots: navy gradient, particles, a soft floor pool
function drawVoid(ctx,t,p,cam,opts={}){
  const FL=p?p.A.floor:H*0.84; const tint=opts.tint||P.navyL;
  layer(ctx,cam,0.45,()=>{
    const g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,tint); g.addColorStop(1,P.navyD); ctx.fillStyle=g; ctx.fillRect(-300,-300,W+600,H+600);
    for(const [a,b,c] of STARS){ const x=((a*W+t*(4+c*8))%(W+200))-100, y=b*H*0.9; dot(ctx,x,y,1.2+c*2,`rgba(237,230,214,${0.15+0.25*Math.sin(t*(0.8+c)+c*9)+0.25})`); }
  });
  layer(ctx,cam,1.0,()=>{
    if(opts.floor!==false){ const r=ctx.createRadialGradient(W*0.5,FL,0,W*0.5,FL,W*0.45); r.addColorStop(0,'rgba(43,179,163,0.16)'); r.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=r; ctx.beginPath(); ctx.ellipse(W*0.5,FL+4,W*0.45,60,0,0,7); ctx.fill();
      ctx.strokeStyle='rgba(237,230,214,0.12)'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(-200,FL+2); ctx.lineTo(W+200,FL+2); ctx.stroke(); }
    if(p && opts.shadow!==false) drawShadow(ctx,p);
  });
}
