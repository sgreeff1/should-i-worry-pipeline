// globe.js — a true rotating Earth for the GLOBE template.
// Projection: d3-geo orthographic (ISC, vendor/). Land: Natural Earth 1:110m via world.js (public domain).
// Rotation is eastward (features move left → right, as the real Earth turns). Markers sit on real cities and hide on the far side.
const GLOBE_CITIES = [ // [name, lon, lat] — large population centres across every inhabited continent, in pop-up order
  ['Lagos',3.39,6.45], ['Cairo',31.24,30.04], ['London',-0.13,51.51], ['Johannesburg',28.05,-26.20], ['Istanbul',28.98,41.01],
  ['Mumbai',72.88,19.08], ['Nairobi',36.82,-1.29], ['Moscow',37.62,55.75], ['Karachi',67.01,24.86], ['Madrid',-3.70,40.42],
  ['São Paulo',-46.63,-23.55], ['Buenos Aires',-58.38,-34.60], ['New York',-74.01,40.71], ['Mexico City',-99.13,19.43], ['Los Angeles',-118.24,34.05],
  ['Dhaka',90.41,23.81], ['Beijing',116.40,39.90], ['Jakarta',106.85,-6.21], ['Tokyo',139.69,35.69], ['Sydney',151.21,-33.87] ];
let _globeProj=null, _globeGrat=null;
function drawGlobe(ctx,t,spec={}){
  const r=spec.r||260, lon0=spec.lon0??22, lat0=spec.lat0??12, speed=spec.speed??11;   // start centred on Africa/Europe; degrees per second
  if(!_globeProj){ _globeProj=d3.geoOrthographic().translate([0,0]).clipAngle(90).precision(0.4); _globeGrat=d3.geoGraticule().step([30,30])(); }
  const cLon=lon0-speed*t, cLat=lat0;                      // centre longitude drifts west → the surface moves east
  _globeProj.scale(r).rotate([-cLon,-cLat]);
  const path=d3.geoPath(_globeProj).context(ctx);
  // ocean sphere with atmosphere glow
  const g=ctx.createRadialGradient(-r*0.3,-r*0.35,r*0.1,0,0,r); g.addColorStop(0,'#3f7fb0'); g.addColorStop(1,'#1d3b66');
  glowOn(ctx,'#3f7fb0',60); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(0,0,r,0,7); ctx.fill(); glowOff(ctx);
  // land
  ctx.save(); ctx.beginPath(); ctx.arc(0,0,r,0,7); ctx.clip();
  ctx.beginPath(); path(WORLD_LAND); ctx.fillStyle=spec.landColor||P.teal; ctx.fill(); ctx.lineJoin='round'; ctx.strokeStyle='rgba(20,110,100,0.85)'; ctx.lineWidth=1.6; ctx.stroke();
  // faint graticule, then spherical shading (light from the upper left)
  ctx.beginPath(); path(_globeGrat); ctx.strokeStyle='rgba(237,230,214,0.07)'; ctx.lineWidth=1; ctx.stroke();
  const sh=ctx.createRadialGradient(-r*0.35,-r*0.35,r*0.2,0,0,r*1.02); sh.addColorStop(0,'rgba(255,255,255,0.10)'); sh.addColorStop(0.55,'rgba(0,0,0,0)'); sh.addColorStop(1,'rgba(8,14,36,0.55)');
  ctx.fillStyle=sh; ctx.fillRect(-r,-r,2*r,2*r);
  ctx.restore();
  ctx.strokeStyle='rgba(180,220,255,0.35)'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(0,0,r-1,0,7); ctx.stroke();   // limb
  // markers: pop in order, only where visible; foreshortened toward the limb
  const n=spec.markers??14, t0=spec.markersAt??0.5;
  GLOBE_CITIES.slice(0,n).forEach(([name,lon,lat],i)=>{
    const d=d3.geoDistance([lon,lat],[cLon,cLat]); if(d>1.25) return; const limb=clamp((1.25-d)/0.25);   // fade out beyond ~57°, gone by ~72° from the view centre
    const p=clamp((t-t0-i*0.18)/0.3); if(p<=0) return;
    const xy=_globeProj([lon,lat]); if(!xy) return;
    const k=EASE.ob(p)*(0.55+0.45*Math.cos(d)); ctx.globalAlpha=limb;
    ctx.save(); ctx.translate(xy[0],xy[1]); ctx.scale(k,k);
    ctx.fillStyle='rgba(8,14,36,0.35)'; ctx.beginPath(); ctx.ellipse(0,22,20,7,0,0,7); ctx.fill();
    glowOn(ctx,P.amber,18); drawIcon(ctx,'person',0,-4,54,t,P.amber); glowOff(ctx); ctx.restore(); ctx.globalAlpha=1;
  });
}
