// style.js — the single source of truth for the channel look. Every scene reads from here.
const W = 1920, H = 1080;
const P = { navy:'#1F2A44', navyD:'#121A2E', navyL:'#2B3B62', teal:'#2BB3A3', tealD:'#23958A', amber:'#F2994A',
            red:'#EB5757', redD:'#C94545', ivory:'#EDE6D6', ivoryD:'#CFC6B2', yellow:'#F2C94C', white:'#FFFFFF',
            skin:'#F0C7A0', skinD:'#D9AD86', organ:'#E8949F', organD:'#C46A77', organL:'#F7C6CC', pants:'#2B3B62', pantsD:'#22304F', shoe:'#EDE6D6',
            floorNear:'#D9C9A8', floorFar:'#B9A585', plank:'#A89474', wallTop:'#1C2642', wallBot:'#131B31' };
const OUT='#141A2E'; let OUTW=6;   // silhouette outline weight (0 = none)
window.STYLE={eyes:'white', outline:true, shade:true};

const STYLE_FONT = { card:'800 64px Inter', cite:'500 26px Inter', tag:'700 22px Inter', small:'500 24px Inter' };
const MOTION = { blurSubframes:4, fps:25, crossfade:0.35, pushIn:0.04 };   // house motion rules
