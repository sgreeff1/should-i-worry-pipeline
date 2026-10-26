# build_world.py — regenerates world.js from data/land-110m.topo.json (see the one-off decode in the session log; kept for reproducibility)
import json
T=json.load(open('data/land-110m.topo.json')); sc,tr=T['transform']['scale'],T['transform']['translate']; arcs=[]
for arc in T['arcs']:
    x=y=0; pts=[]
    for dx,dy in arc: x+=dx; y+=dy; pts.append((round(x*sc[0]+tr[0],3), round(y*sc[1]+tr[1],3)))
    arcs.append(pts)
def ring(idx):
    out=[]
    for i in idx:
        a=arcs[i] if i>=0 else arcs[~i][::-1]; out.extend(a[1:] if out and out[-1]==a[0] else a)
    return out
polys=[]
for g in T['objects']['land']['geometries']:
    for poly in (g['arcs'] if g['type']=='MultiPolygon' else [g['arcs']]): polys.append([ring(r) for r in poly])
geo={'type':'MultiPolygon','coordinates':[[[list(pt) for pt in r] for r in p] for p in polys]}
open('world.js','w').write("// world.js — land outlines from Natural Earth 1:110m (public domain), via world-atlas@2.0.2 land-110m.json. Built by build_world.py.\nconst WORLD_LAND="+json.dumps(geo,separators=(',',':'))+";\n")
