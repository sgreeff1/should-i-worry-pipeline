"""build_E01.py — E01 "The Back Pain That Can Kill You": Visual Brief v4 as code → episodes/E01.json.
Every shot, card and citation is timed from the voice-over sentence timings (episodes/E01_timings.json, 102 sentences),
offset by the opening ident. Re-run after any timing change: python3 build_E01.py
Row numbers (R##) refer to Visual Brief v3; S## to script sentences."""
import json, subprocess
T0=json.load(open('episodes/E01_timings.json'))
OFF=2.4                                            # opening ident (dial) before the voice starts
ST={s['i']:s['start']+OFF for s in T0}; EN={s['i']:s['end']+OFF for s in T0}
def T(i): return round(ST[i],2)
def E(i): return round(EN[i],2)
RED='#EB5757'; AMBER='#F2994A'; TEAL='#2BB3A3'; GREY='#6B7280'; DIM='#3C4A6E'
shots=[]; cards=[]; cites=[]
def shot(t0,kind,**k):
    k.update(kind=kind,t0=t0); shots.append(k); return k
def card(text,a,b):
    assert len(text.split())<=7, text; cards.append([text,round(a,2),round(b,2)])
def cite(text,a,b): cites.append([text,round(a,2),round(b,2)])
REG='Reginato et al., Pain Med, 2026'; HART='Hartvigsen et al., Lancet, 2018'; BUD='Budiman et al., Emerg Med Australas, 2026'
COSTA='da C Menezes Costa et al., CMAJ, 2012'; GIRFT='GIRFT, 2023'; WOOD='Woodfield et al., Neuroepidemiology, 2022; GIRFT, 2023'
REIH='Reihsaus et al., Neurosurg Rev, 2000'; DAVIS='Davis et al., J Emerg Med, 2004'; NICE='NICE NG234, 2023'; VERH='Verhagen et al., Pain, 2017'
HAN='Han et al., Cochrane, 2023'; SHAW='Shaw et al., Eur Spine J, 2020'; AZHAR='Azhar et al., J Endovasc Ther, 2014'; FERN='Fernando et al., Acad Emerg Med, 2022'
GALL='Galliker et al., Am J Med, 2020'; FIN='Finucane et al., JOSPT, 2020'; HEN='Henschke et al., Arthritis Rheum, 2009'; BRIN='Brinjikji et al., AJNR, 2015'
CHIU='Chiu et al., Clin Rehabil, 2015'; NG59='NICE NG59, 2020'
SERV='Anatomy: Servier Medical Art, CC BY 4.0'

# ---- ident + hook (R1–3) ----
shot(0.0,'CHAPTER',id='ident',ident='dial',cut=True)
shot(OFF,'CHAR',id=1,anim='hook',env='home',cut=True,cuts=[1.3,4.4,5.6,7.36,10.38])
# ---- R4–5 (S5) ----
shot(T(5),'COUNT',id=4,n=125,cols=25,highlight=[62],highlightAt=1.2,spineGlow=True)
shot(T(5)+4.2,'COUNT',id=5,n=125,cols=25,highlight=[62],highlightAt=0,stagger=0,spineGlow=True,zoomTo={'t0':0.1,'dur':1.6,'z':3.4})
card('About 1 in 125: spine problem',T(5)+0.8,T(5)+4.1); card('A serious spine problem',T(5)+5.0,E(5)); cite(REG,T(5)+0.8,E(5))
# ---- R6 (S6) ----
shot(T(6),'GLOBE',id=6); card('#1 cause of disability worldwide',T(6)+0.4,E(6)); cite(HART,T(6)+0.4,E(6))
# ---- R7 (S7–9) crowd ----
shot(T(7),'FIGURE',id=7,count=5,gap=330,pose='backPain',faces=['worried','tired','worried','calm','worried'],outfits=['lead','woman','older','woman','lead'],
     overlays=[{'region':'back','color':AMBER,'t0':0.4+0.2*i,'fig':i,'pulse':True} for i in range(5)],
     icons=[{'icon':'earMute','fig':2,'dx':165,'dy':-40,'t0':T(9)-T(7),'size':110}])
card('So common, we stop listening',T(9),E(9))
# ---- R8 (S10–11) ----
shot(T(10),'FIGURE',id=8,count=1,pose='stand',face='worried',overlays=[{'region':'legs','color':RED,'t0':1.0,'pulse':True},{'region':'saddle','color':RED,'t0':2.4,'pulse':True}],
     icons=[{'icon':'bladder','at':'pelvis','t0':2.6,'size':160,'color':RED,'dy':-60},{'icon':'triangle','dx':-320,'dy':-80,'t0':T(11)-T(10),'size':150}])
card('Rare, but serious',T(10)+0.6,E(11))
# ---- R9 (S12) ----
shot(T(12),'FIGURE',id=9,count=2,gap=600,pose='backPain',faces=['calm','calm'],overlays=[{'region':'back','color':AMBER,'t0':0.3,'fig':0},{'region':'back','color':AMBER,'t0':0.3,'fig':1},{'region':'back','color':RED,'t0':2.6,'fig':1,'alpha':0.95}],sweep={'t0':1.6,'dur':1.6,'fig':1},cut=True)
card('Often missed at first',T(12)+0.5,E(12)); cite(BUD,T(12)+0.5,E(12))
# ---- R10–11 (S13–14) ----
shot(T(13),'ICONS',id=10,layout='split',items=[{'icon':'toast','label':'Burnt toast'},{'icon':'flame','label':'Fire'}]); card('Dangerous, or just feels it?',T(13)+0.3,E(13))
shot(T(14),'ICONS',id=11,layout='single',size=320,items=[{'icon':'alarm','t0':0.1}],checklist=['Legs','Bladder','Numbness','Sudden pain']); card('Signs that mean "go now"',T(14)+0.3,E(14))
# ---- R12–13 (S15–17) anatomy ----
shot(T(15),'ANATOMY',id=12,program='spineIntro',asset='body',inset='vert'); card('Vertebrae: the stacked bones',T(16),E(16))
shot(T(17),'ANATOMY',id=13,program='discZoom',asset='spine',pointer=[280,931],label='Disc'); card('Disc: tough ring, soft center',T(17)+0.4,E(17))
# ---- R14 (S18) cord pulses ----
shot(T(18),'ANATOMY',id=14,program='layers',layers=[{'asset':'nervous','x':0.30,'y':0.5,'h':0.84}],
     marks=[{'type':'pulses','layer':0,'x':0.50,'y':0.12,'x2':0.50,'y2':0.40,'t0':0.6,'n':3,'period':1.4,'color':'#F2C94C','r':10},
            {'type':'pulses','layer':0,'x':0.50,'y':0.40,'x2':0.50,'y2':0.12,'t0':1.3,'n':3,'period':1.4,'color':'#FFF3B0','r':8},
            {'type':'label','x':0.52,'y':0.30,'text':'Spinal cord','t0':0.8,'size':54},{'type':'label','x':0.52,'y':0.36,'text':'the thick cable of nerves','t0':1.0,'size':34,'weight':500,'color':'#CFC6B2'},{'type':'line','layer':0,'x':0.52,'y':0.26,'x2':1.55,'y2':0.28,'t0':0.8,'alpha':0.7}])
card('Spinal cord: the nerve cable',T(18)+0.5,E(18))
# ---- R15 (S19) cord ends ----
shot(T(19),'ANATOMY',id=15,program='layers',layers=[{'asset':'spineFront','x':0.24,'y':0.5,'h':0.84}],
     marks=[{'type':'ring','layer':0,'x':0.50,'y':0.60,'r':44,'t0':0.5,'color':'#F2C94C'},{'type':'line','layer':0,'x':0.62,'y':0.60,'x2':1.9,'y2':0.52,'t0':0.9,'alpha':0.7},
            {'type':'label','x':0.48,'y':0.49,'text':'Cord ends about here','t0':1.0,'size':48},{'type':'label','x':0.48,'y':0.55,'text':'(top of the lower back, L1–L2)','t0':1.2,'size':34,'weight':500,'color':'#CFC6B2'}])
card('Cord ends near top of lower back',T(19)+0.5,E(19))
# ---- R16 (S20) cauda equina fans down ----
shot(T(20),'ANATOMY',id=16,program='layers',layers=[{'asset':'spineFront','x':0.24,'y':0.5,'h':0.84}],
     marks=[{'type':'ring','layer':0,'x':0.50,'y':0.60,'r':44,'t0':0,'color':'#F2C94C'}]+
           [{'type':'pulses','layer':0,'x':0.50,'y':0.60,'x2':0.50+dx,'y2':0.96,'t0':0.4+0.1*i,'n':3,'period':1.3,'color':'#F2C94C','r':8} for i,dx in enumerate([-0.22,-0.11,0,0.11,0.22])]+
           [{'type':'label','x':0.48,'y':0.58,'text':'Cauda equina','t0':1.4,'size':54},{'type':'label','x':0.48,'y':0.64,'text':'a loose bundle of nerves','t0':1.6,'size':34,'weight':500,'color':'#CFC6B2'}])
card('Cauda equina',T(20)+1.2,E(20))
# ---- R17 (S21–22) horse's tail + what it runs ----
shot(T(21),'ICONS',id=17,size=170,gap=340,items=[{'icon':'horsetail','label':"Horse's tail",'t0':0.1},{'icon':'legs','label':'Legs','t0':T(22)-T(21)+0.2},{'icon':'bladder','label':'Bladder','t0':T(22)-T(21)+0.8},{'icon':'bowel','label':'Bowel','t0':T(22)-T(21)+1.3},{'icon':'rings','label':'Sexual function','t0':T(22)-T(21)+1.8}])
card('"Horse\'s tail": legs, bladder, bowel',T(22)+0.3,E(22))
# ---- R18–19 (S23–24) smoke alarm ----
shot(T(23),'FIGURE',id=18,count=1,pose='backPain',face='worried',overlays=[{'region':'back','color':AMBER,'t0':0.3,'pulse':True}],icons=[{'icon':'alarm','at':'back','t0':0.6,'size':150,'dx':-60,'dy':-40}])
card('Back pain = smoke alarm',T(23)+0.4,E(24))
# ---- R20 (S25–26) burnt toast ----
shot(T(25),'ICONS',id=20,layout='single',size=320,items=[{'icon':'toast','t0':0.1,'pulse':True}]); card('Usually: burnt toast',T(25)+0.5,E(25))
shot(T(26),'FIGURE',id='20b',count=1,pose='backPain',face='ouch',overlays=[{'region':'back','color':AMBER,'t0':0.2,'pulse':True}],icons=[{'icon':'toast','at':'side','t0':0.5,'size':150,'dx':40,'dy':-40}]); card('Loud, miserable, usually harmless',T(26)+0.3,E(26))
# ---- R21 (S27) no single cause ----
shot(T(27),'FIGURE',id=21,count=1,pose='shrug',face='thinking',icons=[{'icon':'question','dx':0,'dy':-330,'t0':0.8,'size':150}]); card('Often no single cause found',T(27)+0.4,E(27)); cite(HART,T(27)+0.4,E(27))
# ---- R22 (S28) chart ----
shot(T(28),'CHART',id=22,type='bar',labels=['Week 0','Week 6'],values=[52,23],max=70,title='Average pain, acute back pain (0–100)'); card('Average pain drops fast',T(28)+0.6,E(28)); cite(COSTA,T(28)+0.3,E(28))
# ---- R23 (S29–30) toast flips to flame ----
shot(T(29),'ICONS',id=23,layout='single',size=320,items=[{'icon':'toast','t0':0.1,'flip':1.2,'flipTo':'flame'}]); card('Sometimes: a real fire',T(29)+1.4,E(30))
# ---- R24 (S31–32) Fire 1 ----
shot(T(31),'CHAPTER',id=24,kicker='Fire number one',title="A squeezed horse's tail",inset='horsetail')
shot(T(32),'FIGURE',id='24b',count=1,pose='backPain',face='worried',outfit='lead',overlays=[{'region':'back','color':AMBER,'t0':0.3,'pulse':True}],icons=[{'icon':'calendar','at':'side','t0':0.6,'size':150,'dx':60,'dy':-120}])
card('A week of grumbling',T(32)+0.5,E(32))
# ---- R25–27 (S33–36) ----
shot(T(33),'FIGURE',id=25,count=1,pose='stand',face='ouch',overlays=[{'region':'legs','color':RED,'t0':0.3,'pulse':True}],cut=True); card('Pain down both legs',T(33)+0.3,E(33))
shot(T(34),'FIGURE',id=26,count=1,pose='stand',face='worried',overlays=[{'region':'saddle','color':GREY,'t0':0.4,'alpha':0.9}]); card('Numb "saddle" area',T(34)+0.5,E(34))
shot(T(35),'FIGURE',id=27,count=1,pose='stand',face='worried',overlays=[{'region':'saddle','color':GREY,'t0':0,'alpha':0.9}],icons=[{'icon':'bladder','at':'pelvis','t0':0.5,'size':170,'color':RED,'dy':-70},{'icon':'triangle','dx':-320,'dy':-80,'t0':T(36)-T(35),'size':150}])
card('Cauda equina syndrome',T(36),E(36))
# ---- R28 (S37) disc pushes back ----
shot(T(37),'ANATOMY',id=28,program='layers',frames={'assets':['hern1','hern2','hern3','hern4'],'times':[0,1.2,2.2,3.2],'fade':0.6,'x':0.28,'y':0.42,'h':0.64},
     marks=[{'type':'icon','icon':'nerve','x':0.78,'y':0.48,'size':210,'t0':0.3,'color':RED,'text':'nerve bundle'},{'type':'label','x':0.56,'y':0.20,'text':'Disc, from above','t0':0.3,'size':40,'weight':500,'color':'#CFC6B2'},
            {'type':'label','x':0.56,'y':0.27,'text':'soft center pushes backward','t0':2.0,'size':40,'weight':700}])
card('Disc presses on nerve bundle',T(37)+0.6,E(37)); cite(GIRFT,T(37),E(37))
# ---- R29–30 (S38) signals fade ----
sig=T(38); stop=3.6
shot(sig,'ANATOMY',id=29,program='layers',credit=False,
     marks=[{'type':'icon','icon':'nerve','x':0.25,'y':0.42,'size':240,'t0':0.1,'text':'nerve bundle'},
            {'type':'icon','icon':'bladder','x':0.70,'y':0.22,'size':190,'t0':0.3,'text':'bladder'},{'type':'icon','icon':'person','x':0.70,'y':0.58,'size':170,'t0':0.5,'text':'saddle skin'},
            {'type':'pulses','x':0.30,'y':0.38,'x2':0.64,'y2':0.22,'t0':0.8,'stop':stop,'n':4,'period':1.3},{'type':'pulses','x':0.30,'y':0.46,'x2':0.64,'y2':0.58,'t0':1.0,'stop':stop,'n':4,'period':1.3},
            {'type':'icon','icon':'bladder','x':0.70,'y':0.22,'size':190,'t0':stop+0.6,'color':RED},{'type':'icon','icon':'person','x':0.70,'y':0.58,'size':170,'t0':stop+0.8,'color':GREY}])
card('Same nerves: bladder, saddle skin',sig+0.5,sig+stop); card('Signals go quiet',sig+stop+0.4,E(38))
# ---- R31 (S39–40) rare ----
shot(T(39),'COUNT',id=31,n=600,cols=40,mode='dots',highlight=[247,311],highlightAt=T(40)-T(39)+0.5,stagger=0.003); card('1–3 per 100,000 a year',T(40)+0.3,E(40)); cite(WOOD,T(40)+0.3,E(40))
# ---- R32 (S41) permanent ----
shot(T(41),'ICONS',id=32,size=170,items=[{'icon':'bladder','label':'Bladder'},{'icon':'bowel','label':'Bowel'},{'icon':'legs','label':'Legs'},{'icon':'rings','label':'Sex life'}]); card('Can be permanent',T(41)+0.4,E(41)); cite(GIRFT,T(41)+0.4,E(43))
# ---- R33 (S42–43) emergency, 4 hours ----
shot(T(42),'ICONS',id=33,layout='single',size=300,items=[{'icon':'hospital','t0':0.2}])
shot(T(43),'ICONS',id='33b',size=220,items=[{'icon':'clock','label':'Within 4 hours','t0':0.3},{'icon':'scanner','label':'A scan','t0':1.4}],cut=True)
card('Treated as an emergency',T(42)+0.3,E(42)); card('UK standard: scan within 4 hours',T(43)+0.3,E(43))
# ---- R34 (S44) Fire 2 ----
shot(T(44),'CHAPTER',id=34,kicker='Fire number two',title='Infection by the nerves',inset='bacteria')
# ---- R35 (S45) ----
shot(T(45),'ICONS',id=35,size=190,items=[{'icon':'skin','label':'Skin infection'},{'icon':'iv','label':'A drip'},{'icon':'glucose','label':'Diabetes'}]); card('Skin infection, IV drip, diabetes',T(45)+0.6,E(45)); cite(REIH,T(45)+0.6,E(45))
# ---- R36 (S46) ----
shot(T(46),'FIGURE',id=36,count=1,pose='backPain',face='worried',overlays=[{'region':'back','color':AMBER,'t0':0.3,'pulse':True}],icons=[{'icon':'thermometer','at':'side','t0':1.0,'size':160,'dx':40,'dy':-120}]); card('Back pain, maybe fever',T(46)+0.4,E(46))
# ---- R37 (S47) abscess ----
shot(T(47),'ANATOMY',id=37,program='layers',layers=[{'asset':'epidural','x':0.28,'y':0.44,'h':0.72}],
     marks=[{'type':'drift','layer':0,'x':0.9,'y':0.4,'x2':0.50,'y2':0.42,'t0':0.3,'t1':2.8,'n':7,'icon':'bacteria','size':80},
            {'type':'blob','layer':0,'x':0.505,'y':0.43,'r':46,'t0':2.6,'grow':2.4,'color':RED},
            {'type':'label','x':0.56,'y':0.50,'text':'a pocket of pus','t0':3.4,'size':44,'weight':700},{'type':'label','x':0.56,'y':0.56,'text':'in the space around the nerves','t0':3.6,'size':32,'weight':500,'color':'#CFC6B2'}])
card('Infection gathers beside nerves',T(47)+0.5,E(47))
# ---- R38 (S48–49) disguised ----
shot(T(48),'ICONS',id=38,layout='split',items=[{'icon':'toast','label':'What it looks like','t0':0.2},{'icon':'flame','label':'What it is','t0':T(49)-T(48)-0.4}]); card('Disguised as burnt toast',T(48)+0.4,E(49))
# ---- R39–42 (S50–53) ----
shot(T(50),'COUNT',id=39,n=8,cols=8,size=150,highlight=[3],highlightAt=1.4); card('All three at first: 1 in 8',T(50)+0.8,E(50)); cite(DAVIS,T(50)+0.8,E(52))
shot(T(51),'ICONS',id=40,size=170,items=[{'icon':'alarm','label':'Back pain','color':AMBER},{'icon':'thermometer','label':'Fever'},{'icon':'legs','label':'Nerve signs','color':RED}]); card('Back pain + fever + nerve signs',T(51)+0.4,E(51))
shot(T(52),'COUNT',id=41,n=4,cols=4,size=170,highlight=[0,1,2],highlightAt=1.2,highlightColor=AMBER); card('3 in 4 diagnosed late',T(52)+0.6,E(52))
shot(T(53),'COUNT',id=42,n=10,cols=10,size=140,highlight=[6],highlightAt=1.4,fadeGrey=2.6); card('About 1 in 10 died',T(53)+1.0,E(53)); cite(BUD,T(53)+1.0,E(53))
# ---- R43–47 (S54–59) Fire 3 ----
shot(T(54),'CHAPTER',id=43,kicker='Fire number three',title='Cancer in the spine',inset='tumor')
shot(T(55),'ICONS',id=44,size=190,items=[{'icon':'document','label':'Cancer history'},{'icon':'sun','label':'Same day','t0':1.4}]); card('Past cancer + new pain: same day',T(55)+0.5,E(55)); cite(NICE,T(55)+0.5,E(55))
shot(T(56),'ICONS',id=45,size=200,items=[{'icon':'document','label':'Cancer history','t0':0.1},{'icon':'magnifier','label':'A key clue','t0':0.8}]); card('A key clue: cancer history',T(56)+0.4,E(56)); cite(VERH,T(56)+0.4,E(56))
shot(T(57),'ICONS',id=46,size=180,items=[{'icon':'arrowUp','label':'Getting worse'},{'icon':'moon','label':'Night pain'},{'icon':'cough','label':'Cough or strain'}]); card('Worsening, night pain, straining',T(57)+0.5,E(57)); cite(NICE,T(57)+0.5,E(57))
shot(T(58),'ANATOMY',id=47,program='layers',layers=[{'asset':'epidural','x':0.28,'y':0.44,'h':0.72}],
     marks=[{'type':'blob','layer':0,'x':0.33,'y':0.47,'r':52,'t0':0.3,'grow':2.0,'color':'#C46A77'},{'type':'icon','icon':'legs','x':0.62,'y':0.40,'size':200,'t0':1.8,'color':GREY,'text':'legs weaken'},
            {'type':'icon','icon':'siren','x':0.82,'y':0.40,'size':170,'t0':T(59)-T(58)+0.2}])
card('Weak legs after cancer: emergency',T(58)+0.6,E(59)); cite(NICE,T(58),E(59))
# ---- R48–50 (S60–62) Fire 4 ----
shot(T(60),'CHAPTER',id=48,kicker='Fire number four',title='A broken bone',inset='vertebra')
shot(T(61),'ICONS',id=49,size=190,gap=440,items=[{'icon':'seventy','label':'Over 70','t0':0.3},{'icon':'pill','label':'Steroid medicines','t0':1.6},{'icon':'fall','label':'A real fall','t0':3.6}]); card('Over 70, steroids, a fall',T(61)+1.0,E(61)); cite(HAN,T(61)+1.0,E(61))
shot(T(62),'ANATOMY',id=50,program='layers',credit=False,marks=[{'type':'icon','icon':'vertebra','x':0.32,'y':0.48,'size':300,'t0':0.1,'text':'strong bone'},{'type':'icon','icon':'vertebra','x':0.68,'y':0.48,'size':300,'t0':0.4,'color':RED,'text':'weak bone'},
            {'type':'crack','pts':[[0.665,0.36],[0.685,0.40],[0.670,0.44],[0.695,0.47],[0.680,0.50]],'t0':1.4,'grow':0.6,'w':8}])
card('Weak bones crack more easily',T(62)+0.5,E(62))
# ---- R51 (S63–64) the twist ----
shot(T(63),'COUNT',id=51,n=1000,cols=50,mode='dots',stagger=0.0025,color=TEAL); card('Now the twist',T(63),T(64)+0.3); card('1,000 emergency patients',T(64)+0.4,E(64)); cite(SHAW,T(64)+0.4,E(65))
# ---- R52 (S65) ----
shot(T(65),'ICONS',id=52,layout='split',size=220,gap=600,items=[{'icon':'vertebra','label':'Inside the spine','t0':0.2},{'icon':'kidney','label':'Outside the spine','t0':1.2}]); card('Outside the spine: more common',T(65)+0.6,E(65))
# ---- R53 (S66) alarm in back, fire elsewhere ----
shot(T(66),'FIGURE',id=53,count=1,pose='backPain',face='worried',overlays=[{'region':'back','color':AMBER,'t0':0.2,'pulse':True},{'region':'belly','color':RED,'t0':2.0,'pulse':True}],
     icons=[{'icon':'alarm','at':'back','t0':0.4,'size':140,'dx':-60,'dy':-40},{'icon':'flame','at':'pelvis','t0':2.2,'size':150,'dx':150,'dy':-150}])
card('Alarm in back, fire elsewhere',T(66)+0.5,E(66))
# ---- R54 (S67) aorta ----
shot(T(67),'ANATOMY',id=54,program='layers',layers=[{'asset':'spineFront','x':0.24,'y':0.5,'h':0.84},{'asset':'aorta','x':0.23,'y':0.547,'h':0.58,'t0':0.8}],
     marks=[{'type':'label','x':0.50,'y':0.40,'text':'The aorta','t0':1.4,'size':54},{'type':'label','x':0.50,'y':0.46,'text':'the main artery, in front of the spine','t0':1.6,'size':34,'weight':500,'color':'#CFC6B2'},{'type':'line','layer':1,'x':0.55,'y':0.40,'x2':2.1,'y2':0.36,'t0':1.4,'alpha':0.7}])
card('The aorta: your main artery',T(67)+0.5,E(67))
# ---- R55 (S68) aneurysm / dissection ----
shot(T(68),'ANATOMY',id=55,program='layers',layers=[{'asset':'aneurysm','x':0.24,'y':0.46,'h':0.68},{'asset':'dissection','x':0.68,'y':0.44,'h':0.34,'t0':0.8,'feather':30}],
     marks=[{'type':'label','x':0.40,'y':0.70,'text':'Burst: aneurysm','t0':0.5,'size':44,'align':'left'},{'type':'label','x':0.68,'y':0.17,'text':'Torn: dissection','t0':1.2,'size':44,'align':'center'},{'type':'ring','layer':0,'x':0.50,'y':0.55,'r':130,'t0':0.5,'color':RED}])
card('Burst or torn: life-threatening',T(68)+0.4,E(68))
# ---- R56–57 (S69) ----
shot(T(69),'FIGURE',id=56,count=3,gap=480,pose='stand',faces=['calm','worried','calm'],outfits=['older','lead','woman'],overlays=[{'region':'belly','color':RED,'t0':1.4,'fig':1,'pulse':True}],icons=[{'icon':'question','fig':1,'dx':190,'dy':-130,'t0':1.8,'size':130}]); card('Burst aneurysm: 1 in 3 missed',T(69)+0.8,T(69)+4.0); cite(AZHAR,T(69)+0.8,E(69))
shot(T(69)+4.0,'ICONS',id=57,size=200,items=[{'icon':'person','label':'Missed at first','color':RED,'t0':0.1},{'icon':'scanner','label':'Then the scan','t0':0.9}]); card('First diagnosis: often something else',T(69)+4.4,E(69))
# ---- R58–59 (S70–72) tone change ----
shot(T(70),'ICONS',id=58,layout='single',size=300,items=[{'icon':'hand','t0':0.2}]); card('Calmly: the signs to check',T(70)+0.5,E(70))
shot(T(71),'ICONS',id=59,size=150,gap=260,items=[{'icon':'bladder','color':DIM,'t0':0.1},{'icon':'legs','color':DIM,'t0':0.2},{'icon':'flag','color':RED,'t0':T(72)-T(71)+0.2},{'icon':'bowel','color':DIM,'t0':0.3},{'icon':'thermometer','color':DIM,'t0':0.4}],halo=False)
card("You don't need all of them",T(71)+0.3,E(71)); card('One is enough',T(72)+0.2,E(72))
# ---- R60–66 (S73–79) GO NOW ----
shot(T(73),'BANNER',id=60,tier='GO NOW',sub='Emergency department',items=[{'icon':'hospital','label':'Emergency department'}]); card('GO NOW: emergency department',T(73)+0.5,T(73)+3.8); cite(GIRFT,T(73)+0.5,E(77))
shot(T(73)+4.0,'ICONS',id=61,layout='single',size=300,items=[{'icon':'bladder','color':RED,'t0':0.1}]); card('Trouble peeing, or not feeling full',T(73)+4.4,E(73))
shot(T(74),'FIGURE',id=62,count=1,pose='stand',face='worried',overlays=[{'region':'saddle','color':RED,'t0':0.4,'pulse':True}]); card('Numb saddle or genital area',T(74)+0.5,E(74))
shot(T(75),'ICONS',id=63,size=220,items=[{'icon':'bowel','label':'Bowel control','color':RED,'t0':0.2},{'icon':'rings','label':'Sexual function','t0':T(76)-T(75)+0.2}]); card('Bowel control; sexual function change',T(75)+0.4,E(76))
shot(T(77),'FIGURE',id=64,count=1,pose='stand',face='worried',overlays=[{'region':'legs','color':RED,'t0':0.4,'pulse':True}],icons=[{'icon':'arrowDown','at':'side','t0':1.0,'size':150,'dx':40,'dy':120}]); card('Weakening or numb legs',T(77)+0.4,E(77))
shot(T(78),'FIGURE',id=65,count=1,pose='backPain',face='ouch',overlays=[{'region':'back','color':RED,'t0':0.3,'pulse':True},{'region':'belly','color':RED,'t0':1.2,'pulse':True}],icons=[{'icon':'siren','at':'side','t0':2.6,'size':150,'dx':60,'dy':-40}])
card('Sudden severe pain, feeling faint',T(78)+0.5,E(78)); cite(FERN,T(78)+0.5,E(78))
shot(T(79),'ICONS',id=66,size=180,gap=420,items=[{'icon':'document','label':'Cancer history'},{'icon':'walk','label':'Weak legs','color':RED},{'icon':'siren','label':'Go now'}]); card('Past cancer + weak legs: go now',T(79)+0.5,E(79)); cite(NICE,T(79)+0.5,E(79))
# ---- R67–69 (S80–82) SAME DAY ----
shot(T(80),'BANNER',id=67,tier='SAME DAY',sub='See a doctor',items=[{'icon':'thermometer','label':'Fever'},{'icon':'person','label':'Feeling unwell','color':AMBER}]); card('SAME DAY: fever, feeling unwell',T(80)+0.5,E(80)); cite(SHAW,T(80)+0.5,E(80))
shot(T(81),'ICONS',id=68,size=180,gap=420,items=[{'icon':'skin','label':'Infection'},{'icon':'iv','label':'Drip or line'},{'icon':'syringe','label':'Injecting'}]); card('Especially: infection, IV line, injecting',T(81)+0.5,E(81)); cite(GALL,T(81)+0.5,E(81))
shot(T(82),'ICONS',id=69,size=190,items=[{'icon':'document','label':'Cancer history'},{'icon':'sun','label':'Same day','t0':1.2}]); card('SAME DAY: past cancer, new pain',T(82)+0.5,E(82)); cite(NICE,T(82)+0.5,E(82))
# ---- R70 (S83) SOON ----
shot(T(83),'BANNER',id=70,tier='SOON',sub='See a doctor',items=[{'icon':'fall','label':'After a fall'},{'icon':'seventy','label':'Over 70'},{'icon':'pill','label':'Long-term steroids'}]); card('SOON: fall, 70+, or steroids',T(83)+0.5,E(83)); cite(HAN,T(83)+0.5,E(83))
# ---- R71–72 (S84–85) kidneys ----
shot(T(84),'ANATOMY',id=71,program='layers',layers=[{'asset':'kidneyArt','x':0.26,'y':0.36,'h':0.56}],marks=[{'type':'icon','icon':'thermometer','x':0.78,'y':0.34,'size':200,'t0':0.8,'text':'fever'},{'type':'label','x':0.50,'y':0.56,'text':'Pain in your side','t0':1.6,'size':48},{'type':'label','x':0.50,'y':0.63,'text':'or pain when you pee','t0':2.4,'size':48}])
card('Side pain + fever: kidneys?',T(84)+0.5,E(84)); cite(SHAW,T(84),T(85)); cite(SHAW,T(85),E(85))
shot(T(85),'ICONS',id=72,size=220,items=[{'icon':'kidney','label':'Kidneys?','t0':0.1},{'icon':'stamp','label':'Same-day check','t0':0.7}]); card('Kidneys? Same-day check',T(85)+0.3,E(85))
# ---- R73–78 (S86–92) honest limits ----
shot(T(86),'ICONS',id=73,size=220,gap=560,items=[{'icon':'flag','t0':0.1,'label':'A warning sign'},{'icon':'question','t0':T(87)-T(86)+0.2,'label':'proves nothing alone'}]); card('No single sign proves anything',T(87)+0.3,E(87)); cite(FIN,T(87)+0.3,E(87))
shot(T(88),'COUNT',id=74,n=10,cols=10,size=140,highlight=[0,1,2,3,4,5,6,7],highlightAt=1.6,highlightColor=AMBER); card('8 in 10 have a "flag"',T(88)+1.0,E(88)); cite(HEN,T(88)+1.0,E(89))
shot(T(89),'COUNT',id=75,n=100,cols=20,highlight=[57],highlightAt=1.2,stagger=0.008); card('Under 1 in 100: serious',T(89)+0.6,E(89))
shot(T(90),'ICONS',id=76,size=130,gap=200,halo=False,items=[{'icon':'flag','color':'#CFC6B2','t0':0.1+0.1*i} for i in range(5)]); card('Most signs: small studies',T(90)+0.5,E(90)); cite(FIN+'; '+HAN,T(90)+0.5,E(90))
shot(T(91),'ICONS',id=77,size=160,gap=330,items=[{'icon':'bladder','label':'Bladder','color':RED},{'icon':'person','label':'Saddle','color':RED},{'icon':'legs','label':'Legs','color':RED},{'icon':'flame','label':'Sudden pain'},{'icon':'document','label':'Guidelines','t0':1.6}]); card('Go-now signs: named in guidelines',T(91)+0.5,E(91)); cite(GIRFT+'; '+NICE,T(91)+0.5,E(91))
shot(T(92),'ICONS',id=78,size=240,items=[{'icon':'scanner','t0':0.1},{'icon':'question','t0':0.8}]); card("Scans aren't magic",T(92)+0.3,E(92))
# ---- R79 (S93) chart ----
shot(T(93),'CHART',id=79,type='bar',labels=['Age 20','Age 80'],values=[30,84],max=100,format='{}%',title='Disc bulges in people with NO pain'); card('Pain-free, yet bulges: 30% → 84%',T(93)+0.8,E(93)); cite(BRIN,T(93)+0.3,E(93))
# ---- R80 (S94) herniation shrinks ----
shot(T(94),'ANATOMY',id=80,program='layers',frames={'assets':['hern4','hern3','hern2','hern1'],'times':[0,0.9,1.6,2.2],'fade':0.5,'x':0.28,'y':0.42,'h':0.64},marks=[{'type':'label','x':0.56,'y':0.34,'text':'over months','t0':0.5,'size':40,'weight':500,'color':'#CFC6B2'}])
card('Herniated discs often shrink',T(94)+0.4,E(94)); cite(CHIU,T(94),E(94))
# ---- R81–82 (S95–96) doctor ----
shot(T(95),'FIGURE',id=81,count=2,gap=560,pose='stand',faces=['thinking','happy'],outfits=['lead','doctor'],icons=[{'icon':'scanner','fig':1,'dx':300,'dy':-120,'t0':0.8,'size':130}]); card("Most don't need a scan",T(95)+0.4,E(95)); cite(NG59,T(95)+0.4,E(95))
shot(T(96),'CHAR',id=82,env='clinic',outfit='doctor',seq=[[0,'stand'],[0.6,'point',0.5],[2.4,'stand',0.5]],face=[[0,'calm'],[0.5,'talking'],[2.6,'happy']],opts={'standX':1920*0.42,'floor':1080*0.84}); card('Worried, or not settling? See a doctor',T(96)+0.5,E(96))
# ---- R83 (S97–98) callback ----
shot(T(97),'CHAR',id=83,env='home',outfit='lead',seq=[[0,'locked'],[0.9,'stand',1.2]],face=[[0,'ouch'],[1.0,'relief'],[2.2,'happy']],opts={'standX':1920*0.42,'floor':1080*0.84}); card('Back to that sock: burnt toast',T(98),E(98))
# ---- R84–85 (S99–100) recap ----
shot(T(99),'BANNER',id=84,tier='GO NOW',items=[{'icon':'bladder','label':'Bladder or bowel','color':RED},{'icon':'person','label':'Numb saddle','color':RED},{'icon':'legs','label':'Weak legs','color':RED},{'icon':'flame','label':'Sudden severe pain'}]); card('GO NOW: these signs',T(99)+0.5,E(99))
shot(T(100),'BANNER',id=85,cut=True,tier='SAME DAY',items=[{'icon':'thermometer','label':'Fever'},{'icon':'document','label':'New pain after cancer'}]); card('SAME DAY: fever; new pain after cancer',T(100)+0.4,E(100))
# ---- R86 (S101–102) look after your back, then the end card ----
shot(T(101),'CHAR',id='85b',env='home',outfit='lead',seq=[[0,'stand'],[0.8,'wave',0.5],[3.2,'stand',0.5]],face=[[0,'calm'],[0.6,'happy']],opts={'standX':1920*0.42,'floor':1080*0.84}); card('Look after your back',T(102),E(102)+0.6)
shot(E(102)+0.4,'END',id=86,lines=['Fact-checked by doctors','Every claim referenced. For educational purposes only.'],meterValue=0.45,cta='Subscribe for the next one')   # anonymous credit, Sebastian 27 Oct 2026 (Decision #55)
DUR=round(E(102)+6.0,2)
# close every shot at the next shot's start
for a,b in zip(shots,shots[1:]): a['t1']=b['t0']
shots[-1]['t1']=DUR
for s in shots: assert s['t1']-s['t0']>0.4, (s['id'],s['t0'],s['t1'])
# gate 4.2: every ANATOMY shot that shows Servier art carries the credit for its whole length (merged into a study citation if one is up)
for s in shots:
    if s['kind']!='ANATOMY' or not (s.get('asset') or s.get('layers') or s.get('frames')): continue
    if s.get('program')=='layers': s['credit']=False   # the composer's cite list draws it, not the template
    ov=[c for c in cites if c[1]<s['t1'] and c[2]>s['t0'] and 'Servier' not in c[0]]
    if ov: c=ov[0]; c[0]=c[0]+' · '+SERV; c[1]=min(c[1],s['t0']); c[2]=max(c[2],s['t1'])
    else: cites.append([SERV,s['t0'],s['t1']])
# worry meter track (corner overlay, bottom-right, 300 px); never during BANNER shots
meter=[{'t0':T(10),'t1':T(11)+0.5,'from':0.45,'to':0.92,'hold':3},{'t0':T(24),'t1':T(25)+0.5,'from':0.92,'to':0.32,'hold':3},
       {'t0':T(29),'t1':T(30),'from':0.32,'to':0.95,'hold':1.0},{'t0':T(70),'t1':T(71),'from':0.95,'to':0.5,'hold':2},
       {'t0':T(97)+1.0,'t1':T(98),'from':0.5,'to':0.32,'hold':round(T(99)-T(98)-0.4,2)}]
lib=subprocess.run(['git','-C','/home/claude/should-i-worry-pipeline','rev-parse','--short','HEAD'],capture_output=True,text=True).stdout.strip()
ep={'title':'E01 — The Back Pain That Can Kill You','tag':'Doctor-reviewed · every claim referenced','library':lib,'duration':DUR,'voOffset':OFF,
    'assets':{'spine':'assets/A_Espace_epidural.png','body':'assets/A_Colonne_normale2.png','vert':'assets/A_vertebre_06.png','mask_disc':'assets/mask_disc.png',
              'nervous':'assets/servier/Systeme_nerveux.png','spineFront':'assets/servier/colonne_02.png','epidural':'assets/A_Espace_epidural.png',
              'hern1':'assets/servier/Hernie_discale1.png','hern2':'assets/servier/Hernie_discale2.png','hern3':'assets/servier/Hernie_discale3.png','hern4':'assets/servier/Hernie_discale4.png',
              'aorta':'assets/servier/aorte_abdo.png','aneurysm':'assets/servier/anev_03.png','dissection':'assets/servier/Dissection_intima2.png','kidneyArt':'assets/servier/rein_01.png'},
    'shots':shots,'cards':cards,'cites':cites,'meter':meter}
json.dump(ep,open('episodes/E01.json','w'),indent=1)
print(len(shots),'shots',len(cards),'cards',len(cites),'cites','duration',DUR)
long=[(s['id'],round(s['t1']-s['t0'],1)) for s in shots if s['t1']-s['t0']>8.0]; print('shots over 8 s:',long)
