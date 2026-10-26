// templates.js — the ten shot kinds. Each: TEMPLATES[kind](ctx, t, spec, S) where t is seconds since the shot started,
// spec is the shot's JSON, and S has {dur, cam, char(drawFn) → draws onto the lit character layer}.
const ENVS = { home:(ctx,t,p,cam)=>drawHome(ctx,t,p,cam), bedroom:drawBedroom, clinic:drawClinic, hospital:drawHospital, street:drawStreet, workplace:drawWorkplace, void:(ctx,t,p,cam,o)=>drawVoid(ctx,t,p,cam,o||{}) };
function pushCam(t,dur,z0=1.0,z1=1+MOTION.pushIn,fx=W/2,fy=H/2){ const k=EASE.io(clamp(t/dur)); return {z:lerp(z0,z1,k),wx:fx,wy:fy,sx:fx,sy:fy,drift:-10+20*k}; }
function popIn(t,t0,d=0.35){ return EASE.ob(clamp((t-t0)/d)); }
function sprite(ctx,x,y,s,color,o={}){ // small figure for COUNT
  ctx.save(); ctx.translate(x,y); ctx.scale(s,s);
  if(o.glow){ glowOn(ctx,o.glow,30); }
  ctx.fillStyle=color; ctx.beginPath(); ctx.arc(0,-34,15,0,7); ctx.fill(); rr(ctx,-19,-22,38,53,13); ctx.fill(); rr(ctx,-17,28,14,30,6); ctx.fill(); rr(ctx,3,28,14,30,6); ctx.fill();
  glowOff(ctx);
  if(o.spine){ ctx.strokeStyle=o.spine; ctx.lineWidth=8; ctx.lineCap='round'; glowOn(ctx,o.spine,22); ctx.beginPath(); ctx.moveTo(0,-20); ctx.lineTo(0,28); ctx.stroke(); glowOff(ctx); for(let i=0;i<5;i++){ dot(ctx,0,-16+i*11,5,P.ivory); } }
  ctx.restore();
}
function featherEdges(ctx,x,y,w,h,m){ // soften a cropped image's four edges into the stage colour
  const c0='rgba(18,26,46,0)', c1='rgba(18,26,46,0.97)';
  for(const [gx0,gy0,gx1,gy1,rx,ry,rw,rh] of [[x,0,x+m,0,x,y,m,h],[x+w,0,x+w-m,0,x+w-m,y,m,h],[0,y,0,y+m,x,y,w,m],[0,y+h,0,y+h-m,x,y+h-m,w,m]]){
    const g=ctx.createLinearGradient(gx0,gy0,gx1,gy1); g.addColorStop(0,c1); g.addColorStop(1,c0); ctx.fillStyle=g; ctx.fillRect(rx,ry,rw,rh); } }
const TEMPLATES = {
  // 1. CHAR — the rig acting in an environment, with its own shot-list camera
  CHAR:(ctx,t,spec,S)=>{
    const A=S.anim; const p=pose(A,t); const cam=camera(A,t); S.cam=cam;
    ENVS[spec.env||'home'](ctx,t,p,cam);
    S.char(cx=>{ cx.save(); cx.translate(cam.sx,cam.sy); cx.scale(cam.z,cam.z); cx.translate(-cam.wx,-cam.wy); drawCharacter(cx,t,p); cx.restore(); });
  },
  // 2. FIGURE — the character as a diagram subject in the void: region tints and attached icons
  FIGURE:(ctx,t,spec,S)=>{
    const n=spec.count||1, gap=spec.gap||520; const zb=spec.zoom||(n===1?1.15:n===2?1.05:1.0); const cam=pushCam(t,S.dur,zb,zb+MOTION.pushIn,W/2,H*(spec.focusY||0.60)); S.cam=cam;   // framed so the top card band (11 % height) stays clear of heads and raised hands
    const anims=S.figs; const ps=anims.map(A=>pose(A,t));
    drawVoid(ctx,t,ps[0],cam,{shadow:false});
    layer(ctx,cam,1.0,()=>{ for(const p of ps) drawShadow(ctx,p); });
    S.char(cx=>{ cx.save(); cx.translate(cam.sx,cam.sy); cx.scale(cam.z,cam.z); cx.translate(-cam.wx,-cam.wy);
      ps.forEach((p,i)=>{ drawCharacter(cx,t,p); });
      // region tints, clipped to the drawn figure
      for(const ov of (spec.overlays||[])){ const a=clamp((t-ov.t0)/(ov.fade||0.6)); if(a<=0) continue; const p=ps[ov.fig||0];
        let x,y,r; if(ov.region==='legs'){ x=(p.kN[0]+p.kF[0])/2; y=p.kN[1]+10; r=190; } else if(ov.region==='saddle'){ x=p.hx; y=p.hy+30; r=110; } else if(ov.region==='back'){ x=p.lbx-26; y=p.lby+10; r=110; } else if(ov.region==='belly'){ x=p.hx+p.px*70; y=p.hy-60; r=120; } else { x=p.hx; y=p.hy; r=160; }
        cx.save(); cx.globalCompositeOperation='source-atop'; const g=cx.createRadialGradient(x,y,0,x,y,r); const c=ov.color||P.red; g.addColorStop(0,c); g.addColorStop(1,'rgba(0,0,0,0)'); cx.globalAlpha=(ov.alpha||0.75)*a*(ov.pulse?0.75+0.25*Math.sin(t*5):1); cx.fillStyle=g; cx.fillRect(x-r,y-r,2*r,2*r); cx.restore(); }
      // x-ray sweep: a bright band crossing the figure reveals the red inside
      if(spec.sweep){ const k=clamp((t-spec.sweep.t0)/spec.sweep.dur); const p=ps[spec.sweep.fig||0]; const x=p.hx-260+k*520; cx.save(); cx.globalCompositeOperation='source-atop'; cx.globalAlpha=0.5; const g=cx.createLinearGradient(x-30,0,x+30,0); g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(0.5,'rgba(237,230,214,1)'); g.addColorStop(1,'rgba(0,0,0,0)'); cx.fillStyle=g; cx.fillRect(x-30,p.cy-150,60,900); cx.restore(); }
      cx.restore(); });
    // icons attached to a figure
    layer(ctx,cam,1.0,()=>{ for(const ic of (spec.icons||[])){ const k=popIn(t,ic.t0); if(k<=0) continue; const p=ps[ic.fig||0]; let x=p.cx, y=p.cy; if(ic.at==='back'){ x=p.lbx-90; y=p.lby-40; } if(ic.at==='side'){ x=p.cx+260; y=p.cy; } if(ic.at==='pelvis'){ x=p.hx+p.px*10; y=p.hy+10; } x+=(ic.dx||0); y+=(ic.dy||0);   // dx/dy nudge any anchor
      ctx.save(); ctx.translate(x,y); ctx.scale(k,k); drawIcon(ctx,ic.icon,0,0,ic.size||110,t,ic.color); ctx.restore(); } });
  },
  // 3. COUNT — n figures or dots, k highlighted; optional zoom into the first highlighted one
  COUNT:(ctx,t,spec,S)=>{
    const n=spec.n, cols=spec.cols||Math.ceil(Math.sqrt(n*1.9)), rows=Math.ceil(n/cols), dots=spec.mode==='dots';
    const cw=dots? Math.min(28,(W*0.8)/cols) : Math.min(78,(W*0.86)/cols), ch=dots?cw:cw*1.25; const ox=W/2-(cols-1)*cw/2, oy=H*0.46-(rows-1)*ch/2;
    const hi=new Set(spec.highlight||[]); const first=[...hi][0]??0; const fx=ox+(first%cols)*cw, fy=oy+Math.floor(first/cols)*ch;
    let cam=pushCam(t,S.dur); if(spec.zoomTo){ const k=EASE.io(clamp((t-spec.zoomTo.t0)/spec.zoomTo.dur)); cam={z:lerp(1,spec.zoomTo.z||3.2,k),wx:lerp(W/2,fx,k),wy:lerp(H/2,fy,k),sx:W/2,sy:H/2,drift:0}; } S.cam=cam;
    drawVoid(ctx,t,null,cam,{floor:false});
    layer(ctx,cam,1.0,()=>{ for(let i=0;i<n;i++){ const x=ox+(i%cols)*cw, y=oy+Math.floor(i/cols)*ch; const ap=popIn(t,(spec.stagger??0.012)*i+0.1,0.3); if(ap<=0) continue;
      const isH=hi.has(i), hk=isH? popIn(t,(spec.highlightAt??1.0),0.5):0; const grey=spec.fadeGrey&&isH? clamp((t-spec.fadeGrey)/0.8):0;
      const col= isH&&hk>0 ? (grey>0?'#6B7280':(spec.highlightColor||P.red)) : (spec.color||P.teal);
      ctx.save(); ctx.translate(x,y); ctx.scale(ap*(isH?1+0.12*hk:1),ap*(isH?1+0.12*hk:1));
      if(dots){ if(isH&&hk>0){ glowOn(ctx,col,20); } dot(ctx,0,0,cw*0.34,col); glowOff(ctx); }
      else sprite(ctx,0,0,cw/78,col,{glow:(isH&&hk>0&&!grey)?col:null, spine:(isH&&spec.spineGlow&&hk>0)?'#FF8A80':null});
      ctx.restore(); } });
  },
  // 4. CHART — a simple line or bar chart drawn on
  CHART:(ctx,t,spec,S)=>{ const cam=pushCam(t,S.dur); S.cam=cam; drawVoid(ctx,t,null,cam,{floor:false});
    layer(ctx,cam,1.0,()=>{ const x0=W*0.22,y0=H*0.72,w=W*0.56,h=H*0.46; const k=EASE.io(clamp((t-0.3)/1.4)); const vmax=spec.max||Math.max(...spec.values)*1.15;
      ctx.strokeStyle='rgba(237,230,214,0.5)'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(x0,y0-h); ctx.lineTo(x0,y0); ctx.lineTo(x0+w,y0); ctx.stroke();
      ctx.font='500 28px Inter'; ctx.fillStyle=P.ivory; ctx.textAlign='center';
      spec.labels.forEach((l,i)=>{ const x=x0+w*(i+0.5)/spec.labels.length; ctx.fillText(l,x,y0+40); });
      if(spec.type==='bar'){ spec.values.forEach((v,i)=>{ const x=x0+w*(i+0.5)/spec.values.length, bh=h*v/vmax*clamp(k*spec.values.length-i); ctx.fillStyle=spec.color||P.teal; rr(ctx,x-w/spec.values.length*0.3,y0-bh,w/spec.values.length*0.6,bh,8); ctx.fill(); if(bh>0){ ctx.fillStyle=P.ivory; ctx.font='700 30px Inter'; ctx.fillText(spec.format?spec.format.replace('{}',v):v,x,y0-bh-14); } }); }
      else { ctx.strokeStyle=spec.color||P.teal; ctx.lineWidth=10; ctx.lineCap='round'; ctx.lineJoin='round'; ctx.beginPath(); const N=Math.max(2,Math.ceil(spec.values.length*k)); spec.values.slice(0,N).forEach((v,i)=>{ const x=x0+w*(i+0.5)/spec.values.length, y=y0-h*v/vmax; i?ctx.lineTo(x,y):ctx.moveTo(x,y); }); ctx.stroke();
        spec.values.forEach((v,i)=>{ if(i>=N) return; const x=x0+w*(i+0.5)/spec.values.length, y=y0-h*v/vmax; dot(ctx,x,y,12,P.ivory); if(i===0||i===spec.values.length-1){ ctx.fillStyle=P.ivory; ctx.font='700 32px Inter'; ctx.fillText(v,x,y-26); } }); }
      if(spec.title){ ctx.font='600 34px Inter'; ctx.fillStyle=P.ivory; ctx.textAlign='left'; ctx.fillText(spec.title,x0,y0-h-30); } });
    if(spec.cite) cite(ctx,spec.cite,0.3,t,S.dur); },   // a chart carries its own citation (gate 4.4)
  // 5. ICONS — 1–4 icons with labels; layouts: row | split | single; animations: pop | flip | pulse; optional checklist / cross-out
  ICONS:(ctx,t,spec,S)=>{ const cam=pushCam(t,S.dur); S.cam=cam; drawVoid(ctx,t,null,cam,{floor:false});
    layer(ctx,cam,1.0,()=>{ const items=spec.items, n=items.length; const size=spec.size||(n===1?300:n===2?240:180); const gap=spec.gap||(size*1.9);
      items.forEach((it,i)=>{ const x=(spec.layout==='single'&&spec.checklist? W*0.36 : W/2+(i-(n-1)/2)*gap), y=H*0.42; const k=popIn(t,(it.t0??0.15+i*0.25)); if(k<=0) return;
        if(spec.layout==='split' && i===0){ ctx.strokeStyle='rgba(237,230,214,0.25)'; ctx.lineWidth=4; ctx.setLineDash([18,16]); ctx.beginPath(); ctx.moveTo(W/2,H*0.18); ctx.lineTo(W/2,H*0.68); ctx.stroke(); ctx.setLineDash([]); }
        ctx.save(); ctx.translate(x,y); let sc=k; if(it.flip!=null){ const f=clamp((t-it.flip)/0.5); sc*=Math.abs(Math.cos(f*Math.PI)); }
        const name = (it.flip!=null && t>it.flip+0.25)? it.flipTo : it.icon; ctx.scale(sc*(it.pulse?1+0.05*Math.sin(t*6):1),k);
        if(spec.halo!==false){ const g=ctx.createRadialGradient(0,0,0,0,0,size*0.8); g.addColorStop(0,'rgba(43,179,163,0.18)'); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.fillRect(-size,-size,2*size,2*size); }
        drawIcon(ctx,name,0,0,size,t,it.color); ctx.restore();
        if(it.cross!=null){ const c=clamp((t-it.cross)/0.4); ctx.strokeStyle=P.red; ctx.lineWidth=14; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(x-size*0.5,y-size*0.5); ctx.lineTo(x-size*0.5+size*c,y-size*0.5+size*c); ctx.stroke(); }
        if(it.label){ const lk=clamp((t-(it.t0??0.15+i*0.25)-0.3)/0.3); ctx.globalAlpha=lk; ctx.font='700 48px Inter'; ctx.fillStyle=P.ivory; ctx.textAlign='center'; ctx.fillText(it.label,x,y+size*0.75); ctx.globalAlpha=1; } });
      if(spec.checklist){ const x=W*0.68,y0=H*0.24; spec.checklist.forEach((line,i)=>{ const k=clamp((t-0.8-i*0.45)/0.3); if(k<=0) return; ctx.globalAlpha=k; ctx.strokeStyle=P.ivory; ctx.lineWidth=4; rr(ctx,x,y0+i*78-22,44,44,10); ctx.stroke(); const ck=clamp((t-1.1-i*0.45)/0.25); if(ck>0){ ctx.strokeStyle=P.teal; ctx.lineWidth=7; ctx.beginPath(); ctx.moveTo(x+10,y0+2); ctx.lineTo(x+20,y0+14); ctx.lineTo(x+36,y0-12); ctx.stroke(); } ctx.font='600 44px Inter'; ctx.fillStyle=P.ivory; ctx.textAlign='left'; ctx.fillText(line,x+64,y0+i*78+14); ctx.globalAlpha=1; }); } }); },
  // 6. ANATOMY — restyled Servier art with programs (spineIntro, discZoom) or a generic pointer/label
  ANATOMY:(ctx,t,spec,S)=>{ const cam={z:1,wx:W/2,wy:H/2,sx:W/2,sy:H/2,drift:0}; S.cam=cam; drawBodyStage(ctx,t,cam);
    const img=IMG[spec.asset];
    if(spec.program==='spineIntro'){ const p=EASE.io(clamp(t/0.8)), push=lerp(1,1.08,clamp(t/5.5));
      ctx.save(); ctx.translate(W*0.35,H*0.5); ctx.scale(push,push); ctx.translate(-W*0.35,-H*0.5); ctx.globalAlpha=p; const h=H*0.84, s=h/img.height, w=img.width*s; glowOn(ctx,'rgba(43,179,163,0.35)',40); ctx.drawImage(img,W*0.33-w/2,H*0.08,w,h); glowOff(ctx); ctx.globalAlpha=1;
      if(t>2.3){ for(let i=0;i<9;i++){ const k=clamp((t-2.3-i*0.17)/0.25); if(k<=0) continue; const yy=H*0.08+h*lerp(0.08,0.46,i/8); glowOn(ctx,P.ivory,30*k); ctx.globalAlpha=0.9*k; dot(ctx,W*0.33-w/2+w*0.18,yy,13,P.ivory); ctx.globalAlpha=1; glowOff(ctx); } } ctx.restore();
      if(t>2.6){ const q=EASE.ob(clamp((t-2.6)/0.5)); const v=IMG[spec.inset]; ctx.save(); ctx.translate(W*0.72,H*0.42); ctx.scale(q,q); glowOn(ctx,'rgba(43,179,163,0.4)',40); const vh=380, vw=v.width*vh/v.height; ctx.drawImage(v,-vw/2,-vh/2,vw,vh); glowOff(ctx); ctx.restore();
      ctx.globalAlpha=q; ctx.strokeStyle=P.ivory; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(W*0.33-w/2+w*0.18+16,H*0.08+h*0.30); ctx.lineTo(W*0.72-220,H*0.42); ctx.stroke(); ctx.font='700 40px Inter'; ctx.fillStyle=P.ivory; ctx.textAlign='center'; ctx.fillText('One vertebra, from above',W*0.72,H*0.42+250); ctx.globalAlpha=1; } }
    else if(spec.program==='discZoom'){ const p=EASE.io(clamp(t/0.7)), s=lerp(1.0,1.08,clamp(t/5.8)); ctx.save(); ctx.globalAlpha=p; const hh=H*0.92*s, ww=img.width*hh/img.height, x=W*0.33-ww/2, y=H*0.04-(hh-H*0.92)/2; ctx.drawImage(img,x,y,ww,hh);
      if(t>0.8){ ctx.globalAlpha=0.35+0.35*Math.sin(t*5); glowOn(ctx,P.disc,40); ctx.drawImage(IMG.mask_disc,x,y,ww,hh); glowOff(ctx); } ctx.globalAlpha=1;
      if(t>1.2){ const q=EASE.io(clamp((t-1.2)/0.5)), px=x+spec.pointer[0]/img.width*ww, py=y+spec.pointer[1]/img.height*hh, ex=W*0.66, ey=H*0.36; ctx.strokeStyle=P.ivory; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(px,py); ctx.lineTo(lerp(px,ex,q),lerp(py,ey,q)); ctx.stroke(); dot(ctx,px,py,9,P.ivory);
        if(q>=1){ const r=EASE.ob(clamp((t-1.8)/0.5)); ctx.save(); ctx.translate(W*0.72,H*0.56); ctx.scale(r,r); glowOn(ctx,'rgba(143,169,196,0.5)',40); dot(ctx,0,0,190,P.disc); glowOff(ctx); dot(ctx,0,0,100,P.ivory); ctx.strokeStyle=OUT; ctx.lineWidth=4; ctx.beginPath(); ctx.arc(0,0,190,0,7); ctx.stroke(); ctx.beginPath(); ctx.arc(0,0,100,0,7); ctx.stroke(); ctx.restore();
        ctx.globalAlpha=clamp(r); ctx.font='700 40px Inter'; ctx.textAlign='center'; ctx.fillStyle=P.disc; ctx.fillText('tough ring',W*0.72,H*0.56-215); ctx.font='700 30px Inter'; /* smaller than 'tough ring' so it sits inside the 100 px centre (Sebastian, 26 Oct 2026) */ ctx.fillStyle=P.navyD; ctx.fillText('soft center',W*0.72,H*0.56+11); ctx.font='800 54px Inter'; ctx.fillStyle=P.disc; ctx.fillText(spec.label,W*0.72,H*0.56-300); ctx.globalAlpha=1; } } ctx.restore(); }
    else { const p=EASE.io(clamp(t/0.7)); const h=H*(spec.h||0.84), s=h/img.height, w=img.width*s, x=W*(spec.x||0.5)-w/2, y=H*(spec.y||0.08); ctx.globalAlpha=p; ctx.drawImage(img,x,y,w,h); featherEdges(ctx,x,y,w,h,spec.feather??70); ctx.globalAlpha=1; if(spec.credit!==false) cite(ctx,'Anatomy: Servier Medical Art, CC BY 4.0',0.2,t,S.dur);
      if(spec.pointer && t>spec.pointer.t0){ const q=EASE.io(clamp((t-spec.pointer.t0)/0.5)), px=x+spec.pointer.at[0]/img.width*w, py=y+spec.pointer.at[1]/img.height*h, ex=W*0.68, ey=H*0.36; ctx.strokeStyle=P.ivory; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(px,py); ctx.lineTo(lerp(px,ex,q),lerp(py,ey,q)); ctx.stroke(); dot(ctx,px,py,9,P.ivory); if(q>=1){ ctx.font='800 54px Inter'; ctx.textAlign='left'; ctx.fillStyle=P.disc; ctx.fillText(spec.pointer.label,ex+18,ey+18); } } } },
  // 7. BANNER — urgency tier strip + icons beneath (icon and word, never colour alone)
  BANNER:(ctx,t,spec,S)=>{ const cam=pushCam(t,S.dur,1,1.02); S.cam=cam; drawVoid(ctx,t,null,cam,{floor:false,tint:P.navy});
    layer(ctx,cam,1.0,()=>{ const k=EASE.out(clamp(t/0.5)); const col=spec.tier==='GO NOW'?P.red:spec.tier==='SAME DAY'?P.amber:P.teal; const ic=spec.tier==='GO NOW'?'siren':spec.tier==='SAME DAY'?'sun':'calendar';
      ctx.save(); ctx.translate(0,(1-k)*-80); ctx.fillStyle='rgba(18,26,46,0.85)'; rr(ctx,W*0.1,H*0.14,W*0.8,150,30); ctx.fill(); ctx.strokeStyle=col; ctx.lineWidth=6; rr(ctx,W*0.1,H*0.14,W*0.8,150,30); ctx.stroke();
      drawIcon(ctx,ic,W*0.1+110,H*0.14+75,110,t); ctx.font='800 72px Inter'; ctx.fillStyle=col; ctx.textAlign='left'; ctx.fillText(spec.tier,W*0.1+200,H*0.14+100); if(spec.sub){ ctx.font='500 36px Inter'; ctx.fillStyle=P.ivory; ctx.fillText(spec.sub,W*0.1+200+ctx.measureText(spec.tier).width*2+40,H*0.14+98); } ctx.restore();
      const items=spec.items||[]; items.forEach((it,i)=>{ const x=W/2+(i-(items.length-1)/2)*380, y=H*0.58; const kk=popIn(t,0.5+i*0.3); if(kk<=0) return; ctx.save(); ctx.translate(x,y); ctx.scale(kk,kk); drawIcon(ctx,it.icon,0,0,170,t,it.color); ctx.restore(); if(it.label){ ctx.font='600 36px Inter'; ctx.fillStyle=P.ivory; ctx.textAlign='center'; ctx.globalAlpha=kk; ctx.fillText(it.label,x,y+140); ctx.globalAlpha=1; } }); }); },
  // 8. CHAPTER — title card with an inset
  CHAPTER:(ctx,t,spec,S)=>{ const cam=pushCam(t,S.dur,1,1.03); S.cam=cam;
    if(spec.ident==='dial'){ drawVoid(ctx,t,null,cam,{floor:false}); layer(ctx,cam,1.0,()=>drawIdentDial(ctx,t,spec)); return; }   // opening ident, option 1
    if(spec.ident==='char'){ drawIdentChar(ctx,t,S.char,spec); return; }                                                        // opening ident, option 2
    drawVoid(ctx,t,null,cam,{floor:false});
    layer(ctx,cam,1.0,()=>{ const k=EASE.out(clamp(t/0.6)); ctx.globalAlpha=k; ctx.font='500 44px Inter'; ctx.fillStyle=P.amber; ctx.textAlign='left'; ctx.fillText(spec.kicker||'',W*0.12,H*0.36); ctx.font='800 92px Inter'; ctx.fillStyle=P.ivory; ctx.fillText(spec.title,W*0.12,H*0.48); ctx.strokeStyle=P.teal; ctx.lineWidth=8; ctx.beginPath(); ctx.moveTo(W*0.12,H*0.53); ctx.lineTo(W*0.12+360*k,H*0.53); ctx.stroke(); ctx.globalAlpha=1;
      if(spec.inset){ const q=popIn(t,0.5,0.5); if(q>0){ ctx.save(); ctx.translate(W*0.75,H*0.46); ctx.scale(q,q); if(IMG[spec.inset]){ const im=IMG[spec.inset], h=H*0.6, w=im.width*h/im.height; glowOn(ctx,'rgba(43,179,163,0.4)',40); ctx.drawImage(im,-w/2,-h/2,w,h); glowOff(ctx); } else drawIcon(ctx,spec.inset,0,0,320,t); ctx.restore(); } } }); },
  // 9. GLOBE — a true rotating Earth (globe.js: d3-geo orthographic + Natural Earth land) with pop-up markers on real cities
  GLOBE:(ctx,t,spec,S)=>{ const cam=pushCam(t,S.dur); S.cam=cam; drawVoid(ctx,t,null,cam,{floor:false});
    layer(ctx,cam,1.0,()=>{ const a=EASE.io(clamp(t/0.6)); ctx.save(); ctx.translate(W/2,H*0.43); ctx.scale(a,a); drawGlobe(ctx,t,spec); ctx.restore(); }); },
  // 10. END — end card
  END:(ctx,t,spec,S)=>{ const cam={z:1,wx:W/2,wy:H/2,sx:W/2,sy:H/2,drift:0}; S.cam=cam; drawVoid(ctx,t,null,cam,{floor:false,tint:P.navy});
    const k=EASE.out(clamp(t/0.6)); ctx.globalAlpha=k; if(spec.title){ ctx.textAlign='center'; ctx.font='800 72px Inter'; ctx.fillStyle=P.ivory; ctx.fillText(spec.title,W/2,H*0.30); } else { wordmark(ctx,W/2,H*0.26,84,k); if(spec.meter!==false) drawMeter(ctx,t,{x:W/2,y:H*0.68,size:280,value:spec.meterValue??0.45,style:METER_STYLE,label:false,alpha:k}); }
    ctx.font='500 34px Inter'; ctx.fillStyle=P.ivory; ctx.textAlign='center'; (spec.lines||[]).forEach((l,i)=>ctx.fillText(l,W/2,H*(spec.title?0.42:0.36)+i*50)); ctx.font='700 40px Inter'; ctx.fillStyle=P.teal; ctx.fillText(spec.cta||'Subscribe for the next one',W/2,H*0.88); ctx.globalAlpha=1; },
};
