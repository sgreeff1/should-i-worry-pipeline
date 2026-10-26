// env/home.js — the living room at night
let FLOOR=H*0.84, STAND_X=W*0.40, SOCK_X=W*0.40+268;   // set by the scene via homeSetup()
function homeSetup(A){ FLOOR=A.floor; STAND_X=A.standX; SOCK_X=A.sockX; }
const STARS=[...Array(70)].map((_,i)=>[rnd(i*3+1),rnd(i*3+2),rnd(i*3+3)]);
const DUST=[...Array(34)].map((_,i)=>({x:rnd(i*7+1),y:rnd(i*7+2),s:1.4+rnd(i*7+3)*2.2,ph:rnd(i*7+4)*6.28,v:0.4+rnd(i*7+5)}));
const LAMP={x:W*0.71, shadeY:H*0.22, shadeW:190, shadeH:150};
function flicker(t){ return 1+0.035*noise(t*2.3,3)+0.015*Math.sin(t*23); }

function drawWall(ctx,t){
  const g=ctx.createLinearGradient(0,0,0,FLOOR); g.addColorStop(0,P.wallTop); g.addColorStop(1,P.wallBot);
  ctx.fillStyle=g; ctx.fillRect(-200,-200,W+400,FLOOR+200);
  // warm wash behind the lamp, cool wash by the window
  let r=ctx.createRadialGradient(LAMP.x,LAMP.shadeY+60,0,LAMP.x,LAMP.shadeY+60,520); r.addColorStop(0,`rgba(242,153,74,${0.16*flicker(t)})`); r.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=r; ctx.fillRect(-200,-200,W+400,FLOOR+200);
  // window
  const wx=W*0.80, wy=H*0.10, ww=W*0.19, wh=H*0.52;
  ctx.fillStyle='#182542'; rr(ctx,wx,wy,ww,wh,10); ctx.fill();
  ctx.save(); rr(ctx,wx,wy,ww,wh,10); ctx.clip();
  for(const [a,b,c] of STARS){ const tw=0.55+0.45*Math.sin(t*(1.5+c*2)+c*20); dot(ctx,wx+a*ww,wy+b*wh,1.2+c*1.8,`rgba(237,230,214,${tw})`); }
  // diagonal highlight streaks (as in the reference room)
  ctx.strokeStyle='rgba(237,230,214,0.22)'; ctx.lineWidth=14; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(wx+ww*0.55,wy+wh*1.05); ctx.lineTo(wx+ww*1.1,wy+wh*0.25); ctx.stroke();
  ctx.lineWidth=5; ctx.beginPath(); ctx.moveTo(wx+ww*0.78,wy+wh*1.05); ctx.lineTo(wx+ww*1.2,wy+wh*0.45); ctx.stroke();
  ctx.restore();
  ctx.strokeStyle=P.ivory; ctx.lineWidth=12; rr(ctx,wx,wy,ww,wh,10); ctx.stroke();
  ctx.lineWidth=7; ctx.beginPath(); ctx.moveTo(wx+ww*0.5,wy); ctx.lineTo(wx+ww*0.5,wy+wh); ctx.moveTo(wx,wy+wh*0.42); ctx.lineTo(wx+ww,wy+wh*0.42); ctx.stroke();
  // baseboard
  ctx.fillStyle='#0E1526'; ctx.fillRect(-200,FLOOR-14,W+400,16);
}
function drawFloor(ctx,t,p){
  const g=ctx.createLinearGradient(0,FLOOR-10,0,H); g.addColorStop(0,P.floorFar); g.addColorStop(1,P.floorNear);
  ctx.fillStyle=g; ctx.fillRect(-200,FLOOR-10,W+400,H-FLOOR+210);
  // planks, slight perspective (closer together toward the back)
  ctx.strokeStyle=P.plank; ctx.lineWidth=2; ctx.globalAlpha=0.45;
  const rows=[0,0.16,0.36,0.60,0.88];
  ctx.globalAlpha=0.32;
  rows.forEach((r,i)=>{ const y=FLOOR+r*(H-FLOOR); ctx.beginPath(); ctx.moveTo(-200,y); ctx.lineTo(W+200,y); ctx.stroke();
    for(let k=0;k<4;k++){ const x=((k*640)+(i%2)*320+(i*77)%140)-160; const y2=i<rows.length-1?FLOOR+rows[i+1]*(H-FLOOR):H+40; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,y2); ctx.stroke(); } });
  ctx.globalAlpha=1;
  { const g=ctx.createLinearGradient(0,FLOOR-10,0,FLOOR+70); g.addColorStop(0,'rgba(18,26,46,0.35)'); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.fillRect(-200,FLOOR-10,W+400,80); }
  // lamp pool on the floor
  let r=ctx.createRadialGradient(LAMP.x-20,FLOOR+40,0,LAMP.x-20,FLOOR+40,420); r.addColorStop(0,`rgba(242,153,74,${0.42*flicker(t)})`); r.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=r; ctx.fillRect(-200,FLOOR-10,W+400,H);
}
function drawShadow(ctx,p){
  const lean=(p.sx-p.hx)*0.35; const scx=(p.fN[0]+p.fF[0])/2+lean*0.6, rx=170+Math.abs(lean)*0.8;
  ctx.save(); ctx.filter='blur(14px)'; ctx.fillStyle='rgba(18,26,46,0.28)'; ctx.beginPath(); ctx.ellipse(scx,FLOOR+8,rx*0.9,20,0,0,7); ctx.fill(); ctx.restore();
}
function drawRug(ctx){
  // a flat rug seen side-on: a thin strip the character stands on
  ctx.fillStyle='rgba(18,26,46,0.22)'; rr(ctx,STAND_X-400,FLOOR+22,820,12,6); ctx.fill();
  ctx.fillStyle='#2A4A6A'; rr(ctx,STAND_X-400,FLOOR-2,820,28,9); ctx.fill();
  ctx.fillStyle='rgba(237,230,214,0.5)'; rr(ctx,STAND_X-400,FLOOR+3,820,3,1.5); ctx.fill(); rr(ctx,STAND_X-400,FLOOR+19,820,3,1.5); ctx.fill();
  ctx.fillStyle='rgba(43,179,163,0.5)'; rr(ctx,STAND_X-360,FLOOR+8,740,9,3); ctx.fill();
  ctx.fillStyle='rgba(237,230,214,0.35)'; for(let i=0;i<17;i++){ const x=STAND_X-360+22+i*44; ctx.beginPath(); ctx.moveTo(x,FLOOR+8); ctx.lineTo(x+6,FLOOR+12.5); ctx.lineTo(x,FLOOR+17); ctx.lineTo(x-6,FLOOR+12.5); ctx.closePath(); ctx.fill(); }
}
function drawPicture(ctx){
  const x=W*0.08, y=H*0.14, w=300, h=200;
  ctx.fillStyle='rgba(18,26,46,0.35)'; rr(ctx,x+8,y+10,w,h,8); ctx.fill();
  ctx.fillStyle=P.ivory; rr(ctx,x,y,w,h,8); ctx.fill();
  ctx.fillStyle='#24405C'; rr(ctx,x+16,y+16,w-32,h-32,4); ctx.fill();
  // a tiny flat landscape inside: hills + moon
  ctx.save(); rr(ctx,x+16,y+16,w-32,h-32,4); ctx.clip();
  ctx.fillStyle=P.tealD; ctx.beginPath(); ctx.ellipse(x+90,y+150,120,55,0,0,7); ctx.fill();
  ctx.fillStyle=P.teal; ctx.beginPath(); ctx.ellipse(x+190,y+160,110,60,0,0,7); ctx.fill();
  dot(ctx,x+180,y+52,16,P.amber); ctx.restore();
}
function drawPlant(ctx){
  const x=W*0.885, y=FLOOR;
  ctx.save(); ctx.filter='blur(8px)'; ctx.fillStyle='rgba(18,26,46,0.35)'; ctx.beginPath(); ctx.ellipse(x,y+4,70,14,0,0,7); ctx.fill(); ctx.restore();
  ctx.fillStyle='#D9B48F'; rr(ctx,x-48,y-96,96,96,[8,8,22,22]); ctx.fill();          // pot
  ctx.fillStyle='#C49A74'; rr(ctx,x-54,y-104,108,22,8); ctx.fill();                    // rim
  const leaves=[[-30,-150,-0.9],[0,-175,-0.2],[34,-150,0.8],[-16,-205,-0.5],[18,-210,0.45],[0,-240,0.05]];
  for(const [lx,ly,a] of leaves){ ctx.save(); ctx.translate(x+lx,y+ly); ctx.rotate(a); ctx.fillStyle=(a<0)?'#1F8F82':'#2BB3A3'; ctx.beginPath(); ctx.ellipse(0,0,22,52,0,0,7); ctx.fill();
    ctx.strokeStyle='rgba(18,26,46,0.35)'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(0,40); ctx.lineTo(0,-40); ctx.stroke(); ctx.restore(); }
}
function drawCurtain(ctx){
  const x=W*0.775, top=H*0.07;
  ctx.fillStyle='#E7DCC6'; ctx.beginPath(); ctx.moveTo(x,top); ctx.lineTo(x+78,top); ctx.quadraticCurveTo(x+52,H*0.5,x+92,FLOOR-10); ctx.lineTo(x-6,FLOOR-10); ctx.quadraticCurveTo(x+28,H*0.5,x,top); ctx.closePath(); ctx.fill();
  ctx.strokeStyle='rgba(18,26,46,0.18)'; ctx.lineWidth=3; for(let i=1;i<4;i++){ ctx.beginPath(); ctx.moveTo(x+i*20,top+10); ctx.quadraticCurveTo(x+i*20-10,H*0.5,x+i*22,FLOOR-18); ctx.stroke(); }
  ctx.fillStyle='#CFC6B2'; rr(ctx,x-10,top-8,100,16,6); ctx.fill();   // rail
}
function drawMoon(ctx){
  const x=W*0.955, y=H*0.17;
  ctx.save(); const g=ctx.createRadialGradient(x,y,0,x,y,90); g.addColorStop(0,'rgba(237,230,214,0.35)'); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,90,0,7); ctx.fill();
  ctx.fillStyle='#F2EBDD'; ctx.beginPath(); ctx.arc(x,y,26,0,7); ctx.fill(); ctx.fillStyle='#182542'; ctx.beginPath(); ctx.arc(x+12,y-6,22,0,7); ctx.fill(); ctx.restore();
}
function drawBooks(ctx){
  const x=W*0.31, y=FLOOR;
  ctx.fillStyle='#C94545'; rr(ctx,x-44,y-22,88,22,4); ctx.fill();
  ctx.fillStyle='#F2C94C'; rr(ctx,x-40,y-40,80,18,4); ctx.fill();
  ctx.fillStyle='#2A4A6A'; rr(ctx,x-36,y-56,72,16,4); ctx.fill();
  ctx.fillStyle=P.ivory; rr(ctx,x-16,y-92,34,38,8); ctx.fill(); ctx.strokeStyle=P.ivory; ctx.lineWidth=5; ctx.beginPath(); ctx.arc(x+24,y-74,10,-1.3,1.3); ctx.stroke();   // mug
  ctx.fillStyle=P.teal; rr(ctx,x-16,y-92,34,8,[8,8,0,0]); ctx.fill();
}
function drawSock(ctx){
  ctx.save(); ctx.translate(SOCK_X,FLOOR-9); ctx.scale(1.7,1.7); ctx.translate(-SOCK_X,-(FLOOR-9)); ctx.strokeStyle=OUT; ctx.lineWidth=OUTW/1.7; ctx.lineJoin='round';
  const x=SOCK_X, y=FLOOR-9;
  ctx.fillStyle=P.red; rr(ctx,x+16,y-34,30,46,10); ctx.fill(); ctx.stroke();          // cuff rising
  ctx.fillStyle=P.red; rr(ctx,x-48,y-16,78,30,14); ctx.fill(); ctx.stroke();          // foot part
  ctx.fillStyle=P.redD; ctx.beginPath(); ctx.arc(x-40,y+6,12,0,7); ctx.fill(); // heel
  ctx.fillStyle=P.ivory; ctx.globalAlpha=0.85; rr(ctx,x+16,y-34,30,9,4); ctx.fill(); ctx.globalAlpha=1;
  ctx.restore();
}
function drawSofa(ctx){
  ctx.save(); ctx.translate(W*0.02,FLOOR); ctx.scale(1.25,1.25); ctx.translate(-W*0.02,-FLOOR);
  const x=W*0.02, y=FLOOR-205;
  ctx.save(); ctx.filter='blur(10px)'; ctx.fillStyle='rgba(18,26,46,0.35)'; ctx.beginPath(); ctx.ellipse(x+230,FLOOR+6,260,20,0,0,7); ctx.fill(); ctx.restore();
  ctx.fillStyle=P.ivory; rr(ctx,x,y+40,460,150,34); ctx.fill();                 // body
  ctx.fillStyle=P.ivory; rr(ctx,x+20,y,420,70,26); ctx.fill();                  // backrest
  ctx.fillStyle=P.teal; rr(ctx,x+40,y+12,190,48,18); ctx.fill(); rr(ctx,x+240,y+12,180,48,18); ctx.fill();   // back cushions
  ctx.fillStyle=P.teal; rr(ctx,x+36,y+78,200,70,22); ctx.fill(); rr(ctx,x+246,y+78,186,70,22); ctx.fill(); // seat cushions
  ctx.fillStyle=P.tealD; ctx.globalAlpha=0.5; rr(ctx,x+36,y+128,200,20,10); ctx.fill(); rr(ctx,x+246,y+128,186,20,10); ctx.fill(); ctx.globalAlpha=1;
  ctx.fillStyle=P.ivoryD; rr(ctx,x+26,FLOOR-38,30,34,8); ctx.fill(); rr(ctx,x+404,FLOOR-38,30,34,8); ctx.fill(); // legs
  ctx.restore();
}
function drawLamp(ctx,t){
  const f=flicker(t);
  // light cone to the floor
  ctx.save();
  const top=LAMP.shadeY+LAMP.shadeH, bw=LAMP.shadeW/2;
  const g=ctx.createLinearGradient(0,top,0,FLOOR+60); g.addColorStop(0,`rgba(242,153,74,${0.30*f})`); g.addColorStop(1,'rgba(242,153,74,0)');
  ctx.fillStyle=g; ctx.beginPath(); ctx.moveTo(LAMP.x-bw,top); ctx.lineTo(LAMP.x+bw,top); ctx.lineTo(LAMP.x+bw*3.6,FLOOR+60); ctx.lineTo(LAMP.x-bw*3.6,FLOOR+60); ctx.closePath(); ctx.fill();
  // dust in the cone
  ctx.clip();
  for(const d of DUST){
    const yy=((d.y + t*0.018*d.v)%1); const y=top+yy*(FLOOR+60-top);
    const spread=bw+(bw*2.6)*yy; const x=LAMP.x+(d.x*2-1)*spread+Math.sin(t*0.7+d.ph)*12;
    const a=(0.25+0.45*Math.pow(Math.sin(t*1.1+d.ph),2))*(1-Math.pow(Math.abs(d.x*2-1),3));
    dot(ctx,x,y,d.s,`rgba(237,230,214,${a})`);
  }
  ctx.restore();
  // pole, base, shade
  ctx.save(); ctx.filter='blur(8px)'; ctx.fillStyle='rgba(18,26,46,0.35)'; ctx.beginPath(); ctx.ellipse(LAMP.x,FLOOR+5,80,14,0,0,7); ctx.fill(); ctx.restore();
  cap(ctx,LAMP.x,LAMP.shadeY+LAMP.shadeH-10,LAMP.x,FLOOR-6,8,P.ivory);
  ctx.fillStyle=P.ivory; ctx.beginPath(); ctx.ellipse(LAMP.x,FLOOR-6,56,12,0,0,7); ctx.fill();
  // bulb glow
  let r=ctx.createRadialGradient(LAMP.x,LAMP.shadeY+LAMP.shadeH*0.7,0,LAMP.x,LAMP.shadeY+LAMP.shadeH*0.7,170); r.addColorStop(0,`rgba(255,200,120,${0.85*f})`); r.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=r; ctx.fillRect(LAMP.x-200,LAMP.shadeY-80,400,400);
  // shade (trapezoid, warm gradient)
  const sg=ctx.createLinearGradient(0,LAMP.shadeY,0,LAMP.shadeY+LAMP.shadeH); sg.addColorStop(0,'#F2EBDD'); sg.addColorStop(1,'#F4C98E');
  ctx.fillStyle=sg; ctx.beginPath(); ctx.moveTo(LAMP.x-LAMP.shadeW*0.36,LAMP.shadeY); ctx.lineTo(LAMP.x+LAMP.shadeW*0.36,LAMP.shadeY);
  ctx.lineTo(LAMP.x+LAMP.shadeW*0.5+6,LAMP.shadeY+LAMP.shadeH); ctx.lineTo(LAMP.x-LAMP.shadeW*0.5-6,LAMP.shadeY+LAMP.shadeH); ctx.closePath(); ctx.fill();
  // scalloped bottom edge
  ctx.fillStyle='#F2EBDD'; for(let i=0;i<7;i++){ const xx=LAMP.x-LAMP.shadeW*0.5+8+i*(LAMP.shadeW-16)/6; dot(ctx,xx,LAMP.shadeY+LAMP.shadeH,10,'#F2EBDD'); }
}

function drawHome(ctx,t,p,cam){
  layer(ctx,cam,0.45,()=>{ drawWall(ctx,t); drawMoon(ctx); drawPicture(ctx); drawCurtain(ctx); });
  layer(ctx,cam,1.0,()=>{ drawFloor(ctx,t,p); drawRug(ctx); drawShadow(ctx,p); drawSofa(ctx); drawBooks(ctx); drawLamp(ctx,t); drawPlant(ctx); drawSock(ctx); });
}
