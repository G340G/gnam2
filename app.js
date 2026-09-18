const ROOT = typeof window !== 'undefined' ? window : globalThis;
const $ = (s) => typeof document !== 'undefined' ? document.querySelector(s) : null;
const $$ = (s) => typeof document !== 'undefined' ? [...document.querySelectorAll(s)] : [];

const STORAGE='gnam-v7.1-food-os';
const DAY_NAMES=['Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato','Domenica'];
const PROFILE_INFO={
  normal:{name:'Normale',note:'Equilibrio quotidiano: varietà, fibre, fonti proteiche diverse e preparazioni realistiche.',protein:1,energy:1},
  sport:{name:'Sportivo',note:'Più energia e proteine, con distribuzione regolare delle fonti proteiche.',protein:1.25,energy:1.10},
  elegant:{name:'Elegante',note:'Piatti più curati e creativi, senza perdere struttura nutrizionale e semplicità.',protein:1.05,energy:1.03}
};

/* Pantry kit is deliberately part of the preset: if a recipe needs curry, rosemary, salt, etc., it must exist in the shopping inventory. */
const KITCHEN_KIT=[
  ['sale',100,'g'],['pepe nero',25,'g'],['curry',25,'g'],['paprika',20,'g'],['curcuma',15,'g'],['cumino',15,'g'],
  ['origano',20,'g'],['rosmarino',20,'g'],['basilico',20,'g'],['prezzemolo',20,'g'],['timo',15,'g'],['salvia',15,'g'],
  ['menta',10,'g'],['alloro',5,'g'],['peperoncino',10,'g'],['zenzero',40,'g'],['cannella',10,'g'],['noce moscata',8,'g'],
  ['aceto',250,'ml'],['aceto balsamico',150,'ml'],['salsa di soia',150,'ml'],['brodo vegetale',500,'g'],['aglio',100,'g']
];
const FRUIT_PACKS={
  smart:[['mela',3,'pz'],['banana',2,'pz'],['arancia',4,'pz']],
  balanced:[['mela',3,'pz'],['banana',2,'pz'],['arancia',3,'pz'],['kiwi',2,'pz']],
  comfort:[['mela',2,'pz'],['banana',2,'pz'],['arancia',3,'pz'],['kiwi',2,'pz'],['pera',2,'pz']],
  plus:[['mela',2,'pz'],['banana',2,'pz'],['arancia',4,'pz'],['kiwi',2,'pz'],['pera',2,'pz'],['frutti di bosco',250,'g']]
};
const BUDGET_BASES={
  smart:{id:'smart',target:35,icon:'🧺',title:'Smart · ~35€',desc:'essenziale ma completa, frutta e dispensa aromatica incluse',items:[['uova',10,'pz'],['petto di pollo',650,'g'],['fesa di tacchino',350,'g'],['salmone',300,'g'],['merluzzo',350,'g'],['orata',300,'g'],['tonno al naturale',360,'g'],['ceci cotti',800,'g'],['lenticchie cotte',800,'g'],['fagioli cannellini',600,'g'],['pasta integrale',800,'g'],['pasta',400,'g'],['riso',800,'g'],['orzo',400,'g'],['cous cous',450,'g'],['passata di pomodoro',1000,'g'],['patate',1400,'g'],['zucchine',800,'g'],['carote',600,'g'],['broccoli',500,'g'],['spinaci',450,'g'],['piselli',450,'g'],['pomodori',800,'g'],['peperoni',400,'g'],['melanzane',350,'g'],['taccole',300,'g'],['cipolla',350,'g'],['cipolla rossa',150,'g'],['olive',80,'g'],['sedano',250,'g'],['pecorino',80,'g'],['mandorle',100,'g'],['menta',10,'g'],['limone',4,'pz'],['yogurt greco',500,'g'],['ricotta',350,'g'],['feta',220,'g'],['tofu',350,'g'],['parmigiano',70,'g'],['pane integrale',500,'g'],['olio evo',300,'ml']]},
  balanced:{id:'balanced',target:55,icon:'🥕',title:'Balanced · ~55€',desc:'più varietà, pesce, legumi, frutta e dispensa completa',items:[['uova',8,'pz'],['petto di pollo',500,'g'],['salmone',350,'g'],['merluzzo',400,'g'],['tonno al naturale',240,'g'],['ceci cotti',500,'g'],['lenticchie cotte',450,'g'],['fagioli cannellini',350,'g'],['pasta integrale',500,'g'],['pasta',250,'g'],['riso',500,'g'],['orzo',300,'g'],['cous cous',300,'g'],['passata di pomodoro',700,'g'],['patate',900,'g'],['zucchine',600,'g'],['broccoli',400,'g'],['spinaci',300,'g'],['pomodori',600,'g'],['carote',450,'g'],['peperoni',350,'g'],['piselli',300,'g'],['cipolla',300,'g'],['limone',3,'pz'],['yogurt greco',350,'g'],['ricotta',250,'g'],['feta',180,'g'],['parmigiano',50,'g'],['pane integrale',400,'g'],['noci',100,'g'],['sedano',250,'g'],['pecorino',80,'g'],['mandorle',100,'g'],['menta',10,'g'],['olio evo',250,'ml']]},
  comfort:{id:'comfort',target:65,icon:'🍋',title:'Comfort · ~65€',desc:'via di mezzo: più fresco, pesce e varietà',items:[['uova',8,'pz'],['petto di pollo',500,'g'],['fesa di tacchino',300,'g'],['salmone',350,'g'],['merluzzo',350,'g'],['orata',300,'g'],['tonno al naturale',240,'g'],['ceci cotti',500,'g'],['lenticchie cotte',450,'g'],['fagioli cannellini',300,'g'],['pasta integrale',500,'g'],['pasta',250,'g'],['riso',500,'g'],['orzo',300,'g'],['cous cous',300,'g'],['passata di pomodoro',700,'g'],['patate',900,'g'],['zucchine',600,'g'],['broccoli',400,'g'],['spinaci',350,'g'],['pomodori',600,'g'],['carote',450,'g'],['peperoni',350,'g'],['melanzane',350,'g'],['lattuga',250,'g'],['taccole',300,'g'],['yogurt greco',400,'g'],['ricotta',250,'g'],['fiocchi di latte',250,'g'],['feta',180,'g'],['parmigiano',60,'g'],['pane integrale',400,'g'],['noci',100,'g'],['cipolla',300,'g'],['limone',3,'pz'],['olive',80,'g'],['piselli',350,'g'],['sedano',250,'g'],['pecorino',100,'g'],['mandorle',120,'g'],['menta',10,'g'],['olio evo',250,'ml']]},
  plus:{id:'plus',target:75,icon:'🍷',title:'Plus · ~75€',desc:'massima scelta: più pesce, frutta e ingredienti “premium”',items:[['uova',8,'pz'],['petto di pollo',500,'g'],['fesa di tacchino',350,'g'],['salmone',400,'g'],['merluzzo',400,'g'],['orata',350,'g'],['tonno al naturale',240,'g'],['ceci cotti',500,'g'],['lenticchie cotte',450,'g'],['fagioli cannellini',350,'g'],['pasta integrale',500,'g'],['pasta',300,'g'],['riso',500,'g'],['orzo',300,'g'],['cous cous',350,'g'],['passata di pomodoro',700,'g'],['patate',900,'g'],['zucchine',600,'g'],['broccoli',400,'g'],['spinaci',350,'g'],['pomodori',650,'g'],['carote',450,'g'],['peperoni',400,'g'],['melanzane',400,'g'],['lattuga',250,'g'],['taccole',300,'g'],['yogurt greco',450,'g'],['ricotta',250,'g'],['fiocchi di latte',250,'g'],['feta',180,'g'],['parmigiano',60,'g'],['pane integrale',400,'g'],['noci',120,'g'],['cipolla',300,'g'],['piselli',350,'g'],['sedano',250,'g'],['pecorino',100,'g'],['mandorle',120,'g'],['menta',10,'g'],['olio evo',250,'ml']]}
};
const NUTRITION_KIT=[['yogurt greco',1500,'g'],['noci',160,'g'],['feta',180,'g']];
const BUDGETS=Object.values(BUDGET_BASES).map(b=>({...b,items:[...b.items,...FRUIT_PACKS[b.id],...KITCHEN_KIT,...NUTRITION_KIT]}));

const EXTRA_META={
  sale:{group:'spice',unit:'g',days:3650,cost:.05,nutritionKey:'sale'},'pepe nero':{group:'spice',unit:'g',days:3650,cost:.12,nutritionKey:'pepe nero'},
  curry:{group:'spice',unit:'g',days:3650,cost:.12,nutritionKey:'curry'},paprika:{group:'spice',unit:'g',days:3650,cost:.1,nutritionKey:'paprika'},curcuma:{group:'spice',unit:'g',days:3650,cost:.1,nutritionKey:'curcuma'},cumino:{group:'spice',unit:'g',days:3650,cost:.1,nutritionKey:'cumino'},
  origano:{group:'herb',unit:'g',days:3650,cost:.15,nutritionKey:'origano'},rosmarino:{group:'herb',unit:'g',days:3650,cost:.15,nutritionKey:'rosmarino'},basilico:{group:'herb',unit:'g',days:3650,cost:.2,nutritionKey:'basilico'},prezzemolo:{group:'herb',unit:'g',days:3650,cost:.12,nutritionKey:'prezzemolo'},timo:{group:'herb',unit:'g',days:3650,cost:.12,nutritionKey:'timo'},salvia:{group:'herb',unit:'g',days:3650,cost:.12,nutritionKey:'salvia'},menta:{group:'herb',unit:'g',days:3650,cost:.12,nutritionKey:'menta'},alloro:{group:'herb',unit:'g',days:3650,cost:.1,nutritionKey:'alloro'},peperoncino:{group:'spice',unit:'g',days:3650,cost:.1,nutritionKey:'peperoncino'},zenzero:{group:'spice',unit:'g',days:60,cost:.2,nutritionKey:'zenzero'},cannella:{group:'spice',unit:'g',days:3650,cost:.1,nutritionKey:'cannella'},'noce moscata':{group:'spice',unit:'g',days:3650,cost:.1,nutritionKey:'noce moscata'},aceto:{group:'condiment',unit:'ml',days:3650,cost:.15,nutritionKey:'aceto'},'aceto balsamico':{group:'condiment',unit:'ml',days:3650,cost:.2,nutritionKey:'aceto balsamico'},'salsa di soia':{group:'condiment',unit:'ml',days:3650,cost:.2,nutritionKey:'salsa di soia'},'brodo vegetale':{group:'pantry',unit:'g',days:365,cost:.04,nutritionKey:'brodo vegetale'},
  tofu:{group:'plant',unit:'g',days:7,cost:1.2,nutritionKey:'tofu'},olive:{group:'pantry',unit:'g',days:365,cost:.9,nutritionKey:'olive'},cetrioli:{group:'vegetable',unit:'g',days:7,cost:.7,nutritionKey:'cetrioli'},pane:{group:'grain',unit:'g',days:5,cost:.35,nutritionKey:'pane'},'pane pita':{group:'grain',unit:'g',days:5,cost:.4,nutritionKey:'pane'},mozzarella:{group:'dairy',unit:'g',days:7,cost:1.1,nutritionKey:'mozzarella'},gnocchi:{group:'grain',unit:'g',days:7,cost:.45,nutritionKey:'gnocchi'},
  scalogno:{group:'vegetable',unit:'g',days:14,cost:.9,nutritionKey:'scalogno'},limone:{group:'fruit',unit:'pz',days:14,cost:.4,nutritionKey:'limone'},mela:{group:'fruit',unit:'pz',days:21,cost:.4,nutritionKey:'mela'},banana:{group:'fruit',unit:'pz',days:7,cost:.3,nutritionKey:'banana'},arancia:{group:'fruit',unit:'pz',days:14,cost:.4,nutritionKey:'arancia'},kiwi:{group:'fruit',unit:'pz',days:21,cost:.45,nutritionKey:'kiwi'},pera:{group:'fruit',unit:'pz',days:14,cost:.45,nutritionKey:'pera'},'frutti di bosco':{group:'fruit',unit:'g',days:4,cost:1.8,nutritionKey:'frutti di bosco'}
};
const EXTRA_ALIASES={
  'burro di arachidi':'burro di arachidi','burro di noccioline':'burro di arachidi','peanut butter':'burro di arachidi',
  'extra virgin olive oil':'olio evo','olive oil':'olio evo','olives':'olive','garlic clove':'aglio','garlic cloves':'aglio',
  'basil leaves':'basilico','fresh basil':'basilico','fresh parsley':'prezzemolo','parsley':'prezzemolo','coriander':'coriandolo',
  'black pepper':'pepe nero','ground black pepper':'pepe nero','salt':'sale','curry powder':'curry','turmeric':'curcuma','cumin':'cumino',
  'paprika powder':'paprika','chilli powder':'peperoncino','chili powder':'peperoncino','rosemary':'rosmarino','thyme':'timo','sage':'salvia','mint':'menta',
  'onion':'cipolla','red onions':'cipolla rossa','red onion':'cipolla rossa','carrots':'carote','potatoes':'patate','potato':'patate','courgette':'zucchine','courgettes':'zucchine','zucchini':'zucchine',
  'bell pepper':'peperoni','red pepper':'peperoni','romano pepper':'peperoni','green pepper':'peperoni','tomato':'pomodori','tomatoes':'pomodori','plum tomatoes':'pomodori','tinned tomatos':'passata di pomodoro','tomato puree':'passata di pomodoro','tomato purée':'passata di pomodoro',
  'broccoli':'broccoli','spinach':'spinaci','lettuce':'lattuga','peas':'piselli','green peas':'piselli','snow peas':'taccole','sugar snap peas':'taccole','eggplant':'melanzane','aubergine':'melanzane',
  'chicken breast':'petto di pollo','chicken breasts':'petto di pollo','chicken':'pollo','turkey breast':'fesa di tacchino','salmon':'salmone','cod':'merluzzo','sea bream':'orata','tuna':'tonno al naturale','canned tuna':'tonno al naturale',
  'eggs':'uova','egg':'uova','greek yogurt':'yogurt greco','yogurt':'yogurt greco','cottage cheese':'fiocchi di latte','ricotta cheese':'ricotta','feta cheese':'feta','parmesan':'parmigiano',
  'wholemeal pasta':'pasta integrale','wholewheat pasta':'pasta integrale','spaghetti':'pasta','penne':'pasta','pasta':'pasta','rice':'riso','barley':'orzo','pearl barley':'orzo','couscous':'cous cous','cous cous':'cous cous','bread':'pane','wholemeal bread':'pane integrale','white bread':'pane',
  'chickpeas':'ceci cotti','chickpeas canned':'ceci cotti','cooked chickpeas':'ceci cotti','lentils':'lenticchie cotte','cooked lentils':'lenticchie cotte','cannellini beans':'fagioli cannellini','white beans':'fagioli cannellini',
  'walnuts':'noci','almonds':'mandorle','butter':'burro','milk':'latte','olive oil':'olio evo','extra virgin olive oil':'olio evo',
  'apple':'mela','banana':'banana','orange':'arancia','kiwi':'kiwi','pear':'pera','berries':'frutti di bosco','lemon':'limone','lime':'limone'
};

const state=Object.assign({pantry:[],profile:'normal',difficulty:2,people:1,age:30,weight:70,activity:'moderate',weekStart:null,plan:null,score:null,suggestions:[],prefs:{likes:{},seen:{}},shoppingChecks:[],planHistory:[],budgetPreset:null,budgetTarget:null},loadState());
function loadState(){try{return JSON.parse(localStorage.getItem(STORAGE))||{}}catch{return{}}}
function save(){if(typeof localStorage!=='undefined')localStorage.setItem(STORAGE,JSON.stringify(state))}
function todayISO(){return new Date().toISOString().slice(0,10)}
function parseDate(s){return new Date(`${s}T12:00:00`)}
function addDays(date,days){const d=new Date(`${date}T12:00:00`);d.setDate(d.getDate()+days);return d.toISOString().slice(0,10)}
function daysFromToday(s){return Math.round((parseDate(s)-parseDate(todayISO()))/86400000)}
function mondayOf(date=new Date()){const d=new Date(date),day=(d.getDay()+6)%7;d.setDate(d.getDate()-day);return d.toISOString().slice(0,10)}
function fmtDate(s){return new Intl.DateTimeFormat('it-IT',{day:'2-digit',month:'2-digit'}).format(parseDate(s))}
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function money(n){return `€ ${Number(n||0).toFixed(2).replace('.',',')}`}
function quantityForDisplay(q,u){return `${Number(q).toLocaleString('it-IT',{maximumFractionDigits:1})} ${u}`}
function normalizeLoose(s){return String(s||'').toLowerCase().normalize('NFKC').replace(/[’]/g,"'").replace(/[-_/]+/g,' ').replace(/[(),]/g,' ').replace(/\s+/g,' ').trim()}
function normalizeName(s){const x=normalizeLoose(s);return EXTRA_ALIASES[x]||ROOT.INGREDIENT_ALIASES?.[x]||x}
function canonMeta(n){const key=normalizeName(n);return EXTRA_META[key]||ROOT.INGREDIENT_CATALOG?.[key]||{group:'other',unit:'g',days:7,cost:.8,nutritionKey:key}}
function toBase(name,q,u){return ROOT.GNAM_UNITS?.toBase(name,q,u)||null}
function fromBase(name,q,u){return ROOT.GNAM_UNITS?.fromBase(name,q,u)??null}
function baseAmount(q,u,name=''){const x=toBase(name,q,u);return x?x.value:0}
function availableFor(name,pantry){const n=normalizeName(name);let total=0,dim=null;for(const i of pantry.filter(x=>normalizeName(x.name)===n&&x.qty>0).sort((a,b)=>a.expiry.localeCompare(b.expiry))){const c=toBase(n,i.qty,i.unit);if(!c)continue;if(dim==null)dim=c.dim;if(c.dim===dim)total+=c.value}return total}
function clonePantry(p){return p.map(x=>({...x}))}
function expirySuggested(name){return addDays(todayISO(),canonMeta(name).days??7)}
function toast(msg){const t=$('#toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(ROOT.__toast);ROOT.__toast=setTimeout(()=>t.classList.remove('show'),2600)}
function displayFood(n){return n}

/* Representative composition values per 100g. Planning estimates only. */
const NUTRIENTS={
 'uova':[143,13,1,10,0],'petto di pollo':[120,23,0,3,0],'fesa di tacchino':[114,24,0,2,0],pollo:[165,31,0,3.6,0],salmone:[208,20,0,13,0],merluzzo:[82,18,0,1,0],orata:[121,20,0,4,0],'tonno al naturale':[116,26,0,1,0],'ceci cotti':[164,9,27,3,8],'lenticchie cotte':[116,9,20,.4,8],'fagioli cannellini':[140,9,25,.6,6],tofu:[76,8,2,5,1],ricotta:[174,11,3,13,0],'fiocchi di latte':[98,12,4,4,0],'yogurt greco':[97,9,4,5,0],feta:[265,14,4,21,0],parmigiano:[402,33,0,29,0],latte:[46,3.3,4.8,1.6,0],pasta:[350,12,72,1.5,3],'pasta integrale':[350,14,67,2.5,7],riso:[360,7,80,1,1],orzo:[350,10,77,1,10],'cous cous':[376,13,77,.6,5],farina:[364,10,76,1,2.7],patate:[77,2,17,.1,2.2],zucchine:[17,1.2,3.1,.3,1],broccoli:[35,2.4,7,.4,3],spinaci:[23,2.9,3.6,.4,2.2],lattuga:[15,1.4,2.9,.2,1.3],pomodori:[18,.9,3.9,.2,1.2],pomodorini:[18,.9,3.9,.2,1.2],carote:[41,.9,10,.2,2.8],peperoni:[31,1,6,.3,2.1],melanzane:[25,1,6,.2,3],piselli:[81,5,14,.4,5],cipolla:[40,1.1,9,.1,1.7],'cipolla rossa':[40,1.1,9,.1,1.7],aglio:[149,6.4,33,.5,2.1],taccole:[31,2,7,.2,3],pane:[265,9,49,3,3],'pane integrale':[247,13,41,4,7],noci:[654,15,14,65,7],mandorle:[579,21,22,50,12.5],'olio evo':[884,0,0,100,0],'passata di pomodoro':[30,1.3,5,.3,1.5],burro:[717,.9,.1,81,0],mela:[52,.3,14,.2,2.4],banana:[89,1.1,23,.3,2.6],arancia:[47,.9,12,.1,2.4],kiwi:[61,1.1,15,.5,3],pera:[57,.4,15,.1,3.1],'frutti di bosco':[50,1,12,.5,5],limone:[29,1.1,9,.3,2.8],olive:[115,0.8,6,10.7,3.2],cetrioli:[15,.7,3.6,.1,.5],mozzarella:[280,20,3,20,0],gnocchi:[160,4,33,1,2]};
const MICROS={
 'uova':{ca:56,fe:1.75,vc:0,fol:44,k:138,o3:.11},'petto di pollo':{ca:12,fe:1.3,vc:0,fol:4,k:256,o3:0},'fesa di tacchino':{ca:11,fe:1.4,vc:0,fol:6,k:228,o3:0},pollo:{ca:12,fe:1.3,vc:0,fol:4,k:256,o3:0},salmone:{ca:12,fe:.8,vc:0,fol:25,k:363,o3:2.2},merluzzo:{ca:16,fe:.4,vc:0,fol:8,k:413,o3:.15},orata:{ca:20,fe:.6,vc:0,fol:15,k:288,o3:.4},'tonno al naturale':{ca:10,fe:1,vc:0,fol:2,k:237,o3:.12},'ceci cotti':{ca:49,fe:2.9,vc:1.3,fol:172,k:291,o3:.08},'lenticchie cotte':{ca:19,fe:3.3,vc:1.5,fol:181,k:369,o3:.06},'fagioli cannellini':{ca:69,fe:2.1,vc:1.2,fol:81,k:391,o3:.08},ricotta:{ca:207,fe:.4,vc:0,fol:12,k:120,o3:.1},'fiocchi di latte':{ca:83,fe:.1,vc:0,fol:12,k:104,o3:.05},'yogurt greco':{ca:110,fe:.1,vc:.5,fol:7,k:141,o3:.08},feta:{ca:493,fe:.7,vc:0,fol:32,k:62,o3:.2},parmigiano:{ca:1184,fe:.5,vc:0,fol:7,k:92,o3:.1},'pasta integrale':{ca:40,fe:3.3,vc:0,fol:40,k:337,o3:.05},pasta:{ca:24,fe:1.3,vc:0,fol:18,k:223,o3:.03},riso:{ca:10,fe:.8,vc:0,fol:8,k:115,o3:.02},orzo:{ca:29,fe:2.5,vc:0,fol:23,k:280,o3:.02},'cous cous':{ca:24,fe:1.1,vc:0,fol:15,k:166,o3:.03},patate:{ca:12,fe:.8,vc:20,fol:15,k:425,o3:.02},broccoli:{ca:47,fe:.7,vc:89,fol:63,k:316,o3:.05},spinaci:{ca:99,fe:2.7,vc:28,fol:194,k:558,o3:.14},zucchine:{ca:16,fe:.4,vc:18,fol:24,k:261,o3:.03},carote:{ca:33,fe:.3,vc:5.9,fol:19,k:320,o3:.02},peperoni:{ca:7,fe:.4,vc:128,fol:46,k:211,o3:.03},pomodori:{ca:10,fe:.3,vc:14,fol:15,k:237,o3:.03},melanzane:{ca:9,fe:.2,vc:2.2,fol:22,k:229,o3:.04},piselli:{ca:25,fe:1.5,vc:40,fol:65,k:244,o3:.03},cipolla:{ca:23,fe:.2,vc:7.4,fol:19,k:146,o3:.01},aglio:{ca:181,fe:1.7,vc:31,fol:3,k:401,o3:.02},taccole:{ca:37,fe:1,vc:60,fol:43,k:200,o3:.02},'pane integrale':{ca:107,fe:2.7,vc:0,fol:85,k:254,o3:.05},noci:{ca:98,fe:2.9,vc:1.3,fol:98,k:441,o3:9.1},mandorle:{ca:269,fe:3.7,vc:0,fol:44,k:733,o3:0},mela:{ca:6,fe:.1,vc:4.6,fol:3,k:107,o3:.01},banana:{ca:5,fe:.3,vc:8.7,fol:20,k:358,o3:.03},arancia:{ca:40,fe:.1,vc:53,fol:30,k:181,o3:.01},kiwi:{ca:34,fe:.3,vc:93,fol:25,k:312,o3:.03},pera:{ca:9,fe:.2,vc:4.3,fol:7,k:116,o3:.01},'frutti di bosco':{ca:25,fe:.7,vc:30,fol:30,k:150,o3:.03},olive:{ca:88,fe:3.3,vc:0.9,fol:3,k:8,o3:.08},cetrioli:{ca:16,fe:.3,vc:2.8,fol:7,k:147,o3:.03},mozzarella:{ca:505,fe:.4,vc:0,fol:10,k:95,o3:.2},gnocchi:{ca:16,fe:1.5,vc:0,fol:10,k:190,o3:.02}};
function nutrientFor(n){const x=normalizeName(n);return NUTRIENTS[x]||NUTRIENTS[canonMeta(x).nutritionKey]||null}
function microFor(n){const x=normalizeName(n);return MICROS[x]||MICROS[canonMeta(x).nutritionKey]||{ca:0,fe:0,vc:0,fol:0,k:0,o3:0}}
function macroForItems(items){let k=0,p=0,c=0,f=0,fiber=0;for(const i of items){const n=nutrientFor(i.name);const grams=baseAmount(i.qty,i.unit,i.name);if(!n||!grams)continue;const z=grams/100;k+=n[0]*z;p+=n[1]*z;c+=n[2]*z;f+=n[3]*z;fiber+=n[4]*z}return {k:Math.round(k),p:Math.round(p),c:Math.round(c),f:Math.round(f),fiber:Math.round(fiber)}}
function microForItems(items){const out={ca:0,fe:0,vc:0,fol:0,k:0,o3:0};for(const i of items){const n=microFor(i.name);const g=baseAmount(i.qty,i.unit,i.name);if(!g)continue;const z=g/100;for(const key of Object.keys(out))out[key]+=n[key]*z}return out}
function groupSet(){const out={};for(const [name,m] of Object.entries(ROOT.INGREDIENT_CATALOG||{}))(out[m.group]??=[]).push(name);for(const [name,m] of Object.entries(EXTRA_META))(out[m.group]??=[]).push(name);return out}
const GROUPS=groupSet();
function byGroups(p){const out={};for(const i of p){const g=canonMeta(i.name).group;(out[g]??=[]).push(i)}return out}
function proteinFamily(i){const g=canonMeta(i.name).group,n=normalizeName(i.name);if(['fish','seafood'].includes(g)||['salmone','merluzzo','orata','tonno al naturale'].includes(n))return'fish';if(g==='meat'||['petto di pollo','fesa di tacchino','pollo'].includes(n))return'meat';if(g==='eggs')return'egg';if(g==='legume')return'legume';if(g==='dairy')return'dairy';if(g==='nuts')return'nuts';if(['tofu','tempeh','seitan'].includes(n))return'plant';return null}
function enrichRecipe(r){
  const rr={...r,ingredients:[...(r.ingredients||[]).map(x=>[x[0],x[1],x[2]])]};
  const extra=[];const tags=(rr.tags||[]).map(x=>String(x).toLowerCase());const name=String(rr.name||'').toLowerCase();
  const has=(needle)=>rr.ingredients.some(x=>normalizeName(x[0])===normalizeName(needle));
  if(!has('sale'))extra.push(['sale',2,'g']);
  if(!has('pepe nero'))extra.push(['pepe nero',.5,'g']);
  if(name.includes('curry')||tags.includes('speziato')){if(!has('curry'))extra.push(['curry',4,'g']);if(!has('curcuma'))extra.push(['curcuma',1,'g']);if(!has('cumino'))extra.push(['cumino',1,'g'])}
  if((rr.protein==='fish'||tags.includes('pesce'))&&!has('prezzemolo'))extra.push(['prezzemolo',3,'g']);
  if(tags.includes('forno')&&['orata','salmone'].some(x=>name.includes(x))&&!has('rosmarino'))extra.push(['rosmarino',1,'g']);
  if((tags.includes('mediterranea')||name.includes('pomodoro'))&&!has('origano'))extra.push(['origano',1,'g']);
  if((rr.protein==='egg'||name.includes('frittata'))&&!has('prezzemolo'))extra.push(['prezzemolo',2,'g']);
  rr.ingredients.push(...extra);return rr;
}
function recipeIngredients(r){const rr=enrichRecipe(r),servings=Math.max(1,Number(rr.servings)||2),people=Math.max(1,Number(state.people)||1);return rr.ingredients.map(([n,q,u])=>({name:normalizeName(n),label:n,qty:Number(q)*people/servings,unit:u}))}
function recipeCovered(r,pantry){return recipeIngredients(r).every(x=>{const c=toBase(x.name,x.qty,x.unit);return c&&availableFor(x.name,pantry)>=c.value-.01})}
function consumeItems(pantry,items){for(const x of items){const xb=toBase(x.name,x.qty,x.unit);if(!xb)continue;let need=xb.value;for(const item of pantry.filter(i=>normalizeName(i.name)===normalizeName(x.name)&&i.qty>0).sort((a,b)=>a.expiry.localeCompare(b.expiry))){const cb=toBase(x.name,item.qty,item.unit);if(!cb||cb.dim!==xb.dim)continue;const used=Math.min(cb.value,need);const rem=cb.value-used;const nq=fromBase(x.name,rem,item.unit);if(nq==null)continue;item.qty=Math.max(0,nq);need-=used;if(need<=0)break}}}
function consumeRecipe(pantry,r){consumeItems(pantry,recipeIngredients(r))}
function hasPlaceholderSteps(r){return Array.isArray(r.steps)&&r.steps.some(s=>/^(step|passo)\s*\d+\s*$/i.test(String(s).trim()))}
function recipeIsValid(r){if(!r||!r.name||!Array.isArray(r.ingredients)||r.ingredients.length<4)return false;if(!Array.isArray(r.steps)||r.steps.length<4||hasPlaceholderSteps(r))return false;if(r.ingredients.some(([n,q,u])=>!n||!(Number(q)>0)||!u))return false;if(r.remote&&!r.sourceUrl)return false;if(r.remote&&r.qaStatus!=='passed')return false;return true}
function allRecipes(){const local=typeof RECIPES!=='undefined'&&Array.isArray(RECIPES)?RECIPES:[];const extra=typeof GNAM_RECIPE_ADDITIONS!=='undefined'&&Array.isArray(GNAM_RECIPE_ADDITIONS)?GNAM_RECIPE_ADDITIONS:[];const online=typeof ONLINE_RECIPES!=='undefined'&&Array.isArray(ONLINE_RECIPES)?ONLINE_RECIPES:[];const map=new Map();for(const r of [...local,...extra,...online]){if(!recipeIsValid(r))continue;map.set(r.id,enrichRecipe(r))}return [...map.values()]}
function recipeAllowed(r){return recipeIsValid(r)&&Number(r.diff||1)<=Number(state.difficulty||2)&&!(r.category&&['Dessert','Side','Starter','Breakfast'].includes(r.category))&&!/\bbowl\b/i.test(String(r.name||''))}
function coreIngredientSet(r){return new Set(recipeIngredients(r).map(x=>x.name).filter(n=>!['sale','pepe nero','curry','curcuma','cumino','origano','rosmarino','prezzemolo','basilico','timo','salvia','menta','alloro','peperoncino'].includes(n)))}
function pairOverlap(a,b){const A=coreIngredientSet(a),B=coreIngredientSet(b);return [...A].filter(x=>B.has(x))}
function estimateRecipe(r){const m=macroForItems(recipeIngredients(r));return {kcal:m.k||520,p:m.p||25,c:m.c||55,f:m.f||18,fiber:m.fiber||5,micro:microForItems(recipeIngredients(r))}}
function dailyEnergy(){const factor={low:1,moderate:1.1,high:1.2}[state.activity]||1.1;return 24*(Number(state.weight)||70)*factor*PROFILE_INFO[state.profile].energy}
/* Planning block = lunch + dinner + fruit; breakfast/snacks are intentionally left outside. */
function dailyTargets(){const base=24*(Number(state.weight)||70)*PROFILE_INFO[state.profile].energy;return {kcalMin:Math.round(base*.40),kcalMax:Math.round(base*.90),proteinMin:Math.round((Number(state.weight)||70)*0.83*PROFILE_INFO[state.profile].protein*.60),fiberMin:15,vegFruitMin:400,caMin:400,feMin:7,vcMin:40,folMin:100,kMin:1000,o3Min:.25}}
function extractRecipeFood(pair,extras){return [...pair.flatMap(m=>recipeIngredients(m.recipe)),...(extras||[]).map(x=>({name:normalizeName(x.name),qty:x.qty,unit:x.unit}))]}
function nutritionFromItems(foods){
  const m=macroForItems(foods), energy=m.k||1;
  const pct={c:m.c*4/energy*100,f:m.f*9/energy*100,p:m.p*4/energy*100};
  const mi=microForItems(foods),t=dailyTargets();
  const veg=foods.filter(x=>canonMeta(x.name).group==='vegetable').reduce((s,x)=>s+baseAmount(x.qty,x.unit,x.name),0);
  const fruitG=foods.filter(x=>canonMeta(x.name).group==='fruit' && COMPLEMENT_FRUITS.has(normalizeName(x.name))).reduce((s,x)=>s+baseAmount(x.qty,x.unit,x.name),0);
  const totalVegFruit=veg+fruitG;
  const legumes=foods.some(x=>canonMeta(x.name).group==='legume');
  const macroOK=pct.c>=45&&pct.c<=60&&pct.f>=20&&pct.f<=35&&pct.p>=15&&pct.p<=30&&m.fiber>=t.fiberMin&&energy>=t.kcalMin&&energy<=t.kcalMax&&m.p>=t.proteinMin;
  const microFlags={ca:mi.ca>=t.caMin,fe:mi.fe>=t.feMin,vc:mi.vc>=t.vcMin,fol:mi.fol>=t.folMin,k:mi.k>=t.kMin};
  const microCount=Object.values(microFlags).filter(Boolean).length;
  const microOK=microCount>=4;
  const fruitOK=fruitG>=120;
  const vegFruitOK=totalVegFruit>=t.vegFruitMin;
  const ok=macroOK&&microOK&&fruitOK&&vegFruitOK;
  let score=0;
  score += pct.c>=45&&pct.c<=60?17:8;
  score += pct.f>=20&&pct.f<=35?15:7;
  score += pct.p>=15&&pct.p<=30?13:7;
  score += m.fiber>=25?13:m.fiber>=15?8:3;
  score += totalVegFruit>=400?12:totalVegFruit>=300?7:2;
  score += fruitOK?7:0;
  score += Math.round(microCount*2.6);
  score += legumes?4:0;
  score=Math.min(100,score);
  return {total:m,pct,mi,score,ok,targets:t,veg,fruitG,totalVegFruit,legumes,microFlags,microCount};
}
function nutritionDay(pair,fruit,addOns=[]){
  const foods=extractRecipeFood(pair,[...(fruit?[fruit]:[]),...addOns]);
  return nutritionFromItems(foods);
}
const COMPLEMENT_FRUITS=new Set(['mela','banana','arancia','kiwi','pera','frutti di bosco','fragole','lamponi','mirtilli']);
function chooseFruit(working,usedFruitNames){const fruits=working.filter(i=>COMPLEMENT_FRUITS.has(normalizeName(i.name))&&i.qty>0).sort((a,b)=>a.expiry.localeCompare(b.expiry));for(const i of fruits){const n=normalizeName(i.name);if(usedFruitNames.has(n)&&fruits.some(x=>normalizeName(x.name)!==n))continue;const target=i.unit==='pz'?1:Math.min(i.qty,150);const b=toBase(n,target,i.unit);if(!b)continue;return {name:n,qty:target,unit:i.unit};}return null}
function availableAddOn(working,name,qty,unit){return availableFor(name,working)>=baseAmount(qty,unit,name)-.01}
function bestAddOns(pair,fruit,working){
  const specs=[['yogurt greco',170,'g'],['noci',20,'g'],['broccoli',150,'g'],['spinaci',120,'g'],['ceci cotti',120,'g'],['pane integrale',60,'g']];
  const candidates=[];
  for(const [name,qty,unit] of specs){if(!availableAddOn(working,name,qty,unit))continue;const dn=nutritionDay(pair,fruit,[{name,qty,unit}]);candidates.push({adds:[{name,qty,unit}],dn});}
  const singlesOK=candidates.find(x=>x.dn.ok);if(singlesOK)return singlesOK;
  for(let i=0;i<specs.length;i++)for(let j=i+1;j<specs.length;j++){
    const [a,aq,au]=specs[i],[b,bq,bu]=specs[j];if(!availableAddOn(working,a,aq,au)||!availableAddOn(working,b,bq,bu))continue;const adds=[{name:a,qty:aq,unit:au},{name:b,qty:bq,unit:bu}];const dn=nutritionDay(pair,fruit,adds);candidates.push({adds,dn});
  }
  const pairOK=candidates.find(x=>x.dn.ok);if(pairOK)return pairOK;
  /* Only inspect 3-add-on combinations when one/two additions are insufficient. */
  for(let i=0;i<specs.length;i++)for(let j=i+1;j<specs.length;j++)for(let k=j+1;k<specs.length;k++){
    const trio=[specs[i],specs[j],specs[k]];if(!trio.every(([n,q,u])=>availableAddOn(working,n,q,u)))continue;const adds=trio.map(([name,qty,unit])=>({name,qty,unit}));const dn=nutritionDay(pair,fruit,adds);candidates.push({adds,dn});if(dn.ok)return {adds,dn};
  }
  candidates.sort((x,y)=>y.dn.score-x.dn.score);return candidates[0]||{adds:[],dn:nutritionDay(pair,fruit,[])};
}
function dayExtras(pair,working,prevFruit){
  const fruit=chooseFruit(working,new Set(prevFruit||[]));
  if(!fruit)return {fruit:null,addOns:[],temp:clonePantry(working),dn:nutritionDay(pair,null,[])};
  const temp=clonePantry(working);consumeItems(temp,[fruit]);
  const base=nutritionDay(pair,fruit,[]);
  if(base.ok)return {fruit,addOns:[],temp,dn:base};
  const best=bestAddOns(pair,fruit,temp);const addOns=best.adds||[];if(addOns.length)consumeItems(temp,addOns);
  return {fruit,addOns,temp,dn:best.dn};
}
function urgencyForRecipe(r,working){let s=0;for(const x of recipeIngredients(r)){const item=working.find(y=>normalizeName(y.name)===x.name&&y.qty>0);if(item){const d=daysFromToday(item.expiry);s+=Math.max(0,10-d)*3}}return s}
function pairScore(a,b,working,day,seed,historyNames){const dn=nutritionDay([{recipe:a},{recipe:b}],null,[]);let s=dn.score*2+urgencyForRecipe(a,working)+urgencyForRecipe(b,working);if(dn.ok)s+=90;s-=Math.min(30,pairOverlap(a,b).length*8);if(proteinFamilyFromRecipe(a)===proteinFamilyFromRecipe(b))s-=80;for(const r of [a,b]){const seen=state.prefs.seen[r.name]||0;s-=Math.min(30,seen*5);if(historyNames.has(r.name))s-=8;if(state.prefs.likes[r.name]<0)s-=25;if(state.prefs.likes[r.name]>0)s+=Math.min(15,state.prefs.likes[r.name]*3)}if((a.protein==='fish'||b.protein==='fish'))s+=4;if((a.protein==='legume'||b.protein==='legume'))s+=3;return s+(hashString(`${a.id}|${b.id}|${day}|${seed}`)%41)}
function proteinFamilyFromRecipe(r){if(r.protein)return r.protein;return proteinFamily({name:recipeIngredients(r)[0]?.name||''})}
function hashString(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return Math.abs(h>>>0)}
function fingerprint(meals){return meals.map(m=>`${m.day}:${m.slot}:${m.recipe.id}`).join('|')}
function candidatePriority(r,working,used){const e=estimateRecipe(r);let s=urgencyForRecipe(r,working)*2; s+=Math.min(80,e.p); s+=e.fiber*2; s-=(state.prefs.seen[r.name]||0)*9; s+=(state.prefs.likes[r.name]||0)*6; s+=hashString(`${r.id}|${used.size}`)%17; return s;}
function recipeSetPriority(r,working,step){
  const e=estimateRecipe(r);let score=urgencyForRecipe(r,working)*2+Math.min(70,e.p)+e.fiber*2;
  if(Array.isArray(r.style)&&r.style.includes(state.profile))score+=12;
  score-=(state.prefs.seen[r.name]||0)*8;score+=(state.prefs.likes[r.name]||0)*6;
  if(r.protein==='fish')score+=4;if(r.protein==='legume')score+=4;if(r.protein==='egg')score+=2;
  score+=(hashString(`${r.id}|${step}`)%19);return score;
}
function pairCoveredInPantry(a,b,working){
  const temp=clonePantry(working);
  if(!recipeCovered(a,temp)) return null;
  consumeRecipe(temp,a);
  if(!recipeCovered(b,temp)) return null;
  consumeRecipe(temp,b);
  return temp;
}
function pantryBaseMap(pantry){
  const out=new Map();
  for(const item of pantry){
    if(!(item.qty>0))continue;
    const n=normalizeName(item.name), b=toBase(n,item.qty,item.unit);
    if(!b)continue;
    out.set(n,(out.get(n)||0)+b.value);
  }
  return out;
}
function requirementMap(items){
  const out=new Map();
  for(const item of items||[]){
    const n=normalizeName(item.name), b=toBase(n,item.qty,item.unit);
    if(!b||!(b.value>0))continue;
    out.set(n,(out.get(n)||0)+b.value);
  }
  return out;
}
function mergeRequirementMaps(...maps){
  const out=new Map();
  for(const map of maps){for(const [k,v] of map||[])out.set(k,(out.get(k)||0)+v)}
  return out;
}
function requirementFits(req,available){
  for(const [k,v] of req){if((available.get(k)||0)+.01<v)return false}
  return true;
}
function consumeRequirement(available,req){
  const next=new Map(available);
  for(const [k,v] of req)next.set(k,Math.max(0,(next.get(k)||0)-v));
  return next;
}
function candidateFruitItems(source){
  const byName=new Map();
  for(const item of source){
    const n=normalizeName(item.name);
    if(!COMPLEMENT_FRUITS.has(n)||item.qty<=0)continue;
    if(byName.has(n))continue;
    const qty=item.unit==='pz'?1:Math.min(150,item.qty);
    const base=toBase(n,qty,item.unit);if(!base)continue;
    byName.set(n,{name:n,qty,unit:item.unit});
  }
  return [...byName.values()];
}
function fastCandidateScore(a,b,source,seed,dn){
  let s=dn.score*6+urgencyForRecipe(a,source)+urgencyForRecipe(b,source);
  s+=dn.ok?1500:0;
  s-=Math.min(30,pairOverlap(a,b).length*7);
  const fa=proteinFamilyFromRecipe(a),fb=proteinFamilyFromRecipe(b);
  if(fa&&fb&&fa!==fb)s+=25;
  if(a.protein==='fish'||b.protein==='fish')s+=7;
  if(a.protein==='legume'||b.protein==='legume')s+=7;
  for(const r of [a,b]){
    s-=Math.min(45,(state.prefs.seen[r.name]||0)*8);
    s+=Math.min(15,(state.prefs.likes[r.name]||0)*3);
    if((state.prefs.likes[r.name]||0)<0)s-=30;
  }
  return s+(hashString(`${a.id}|${b.id}|${seed}`)%71);
}
function buildFastPairPool(pool,source,seed,strict=true){
  const available=pantryBaseMap(source);
  const fruits=candidateFruitItems(source);
  if(!fruits.length)return[];
  const prepared=pool.filter(recipeAllowed).map(r=>({r,req:requirementMap(recipeIngredients(r)),foods:recipeIngredients(r)})).filter(x=>requirementFits(x.req,available))
    .sort((x,y)=>recipeSetPriority(y.r,source,0)-recipeSetPriority(x.r,source,0));
  const limited=prepared.slice(0,180);
  const out=[];
  const reqCache=new Map(limited.map(x=>[x.r.id,x.req]));
  const foodCache=new Map(limited.map(x=>[x.r.id,x.foods]));
  const fruitReq=new Map(fruits.map(f=>[f.name,requirementMap([f])]));
  const fruitFoods=new Map(fruits.map(f=>[f.name,[f]]));
  for(let i=0;i<limited.length;i++){
    const a=limited[i].r,ra=reqCache.get(a.id),ia=foodCache.get(a.id),fa=proteinFamilyFromRecipe(a);
    for(let j=i+1;j<limited.length;j++){
      const b=limited[j].r,fb=proteinFamilyFromRecipe(b);
      if(fa&&fb&&fa===fb)continue;
      const rb=reqCache.get(b.id),ib=foodCache.get(b.id),pairReq=mergeRequirementMaps(ra,rb);
      if(!requirementFits(pairReq,available))continue;
      for(const fruit of fruits){
        const req=mergeRequirementMaps(pairReq,fruitReq.get(fruit.name));
        if(!requirementFits(req,available))continue;
        const dn=nutritionFromItems([...ia,...ib,...fruitFoods.get(fruit.name)]);
        if(strict&&!dn.ok)continue;
        const score=fastCandidateScore(a,b,source,seed,dn);
        out.push({a,b,fruit,req,dn,score,baseOK:dn.ok});
      }
    }
  }
  out.sort((a,b)=>b.score-a.score);
  return out.slice(0,strict?900:700);
}
function searchFastWeeklyCandidates(pairPool,source,seed){
  const initial={remaining:pantryBaseMap(source),used:new Set(),days:[],score:0,fruitHistory:[],recipeNames:new Set()};
  let states=[initial],BEAM=220;
  for(let day=0;day<7;day++){
    const next=[];
    for(const st of states){
      for(const cand of pairPool){
        if(st.used.has(cand.a.id)||st.used.has(cand.b.id))continue;
        if(!requirementFits(cand.req,st.remaining))continue;
        const fruitName=cand.fruit.name,repeatedFruit=st.fruitHistory.includes(fruitName);
        const used=new Set(st.used);used.add(cand.a.id);used.add(cand.b.id);
        const recipeNames=new Set(st.recipeNames);recipeNames.add(cand.a.name);recipeNames.add(cand.b.name);
        let score=st.score+cand.score+(cand.dn.ok?6000:0)-(repeatedFruit?12:0)-st.days.reduce((n,d)=>n+(d.a.protein===cand.a.protein&&cand.a.protein?20:0),0);
        score += hashString(`${cand.a.id}|${cand.b.id}|${day}|${seed}`)%53;
        const priorWeeks=state.planHistory||[];
        const recipeSeenInWeek=priorWeeks.some(fp=>fp.includes(cand.a.id)||fp.includes(cand.b.id));
        if(recipeSeenInWeek)score-=45;
        next.push({remaining:consumeRequirement(st.remaining,cand.req),used,days:st.days.concat([{a:cand.a,b:cand.b,fruit:cand.fruit,addOns:[],nutrition:cand.dn}]),score,fruitHistory:st.fruitHistory.concat(fruitName),recipeNames});
      }
    }
    if(!next.length)break;
    next.sort((a,b)=>{
      const ao=a.days.filter(d=>d.nutrition.ok).length,bo=b.days.filter(d=>d.nutrition.ok).length;
      const as=ao*12000+a.days.reduce((s,d)=>s+d.nutrition.score,0)*8+a.score;
      const bs=bo*12000+b.days.reduce((s,d)=>s+d.nutrition.score,0)*8+b.score;
      return bs-as;
    });
    const dedupe=new Map();
    for(const st of next){const key=st.days.map(d=>`${d.a.id}+${d.b.id}|${d.fruit.name}`).join(';;');if(!dedupe.has(key))dedupe.set(key,st);if(dedupe.size>=BEAM*2)break}
    states=[...dedupe.values()].slice(0,BEAM);
  }
  const full=states.filter(s=>s.days.length===7&&s.days.every(d=>d.nutrition.ok)).sort((a,b)=>b.score-a.score);
  const anyFull=states.filter(s=>s.days.length===7).sort((a,b)=>{
    const ao=a.days.filter(d=>d.nutrition.ok).length,bo=b.days.filter(d=>d.nutrition.ok).length;
    return (bo*10000+b.score)-(ao*10000+a.score);
  });
  return full[0]||anyFull[0]||states[0]||null;
}
function searchWeeklyPlan(pool,source,seed){
  const strict=buildFastPairPool(pool,source,seed,true);
  if(strict.length){const exact=searchFastWeeklyCandidates(strict,source,seed);if(exact&&exact.days.length===7&&exact.days.every(d=>d.nutrition.ok))return exact;}
  const relaxed=buildFastPairPool(pool,source,seed,false);
  return searchFastWeeklyCandidates(relaxed,source,seed);
}
function calculatePlanCosts(source,days){
  const working=clonePantry(source),costByKey=new Map();
  const takeCost=(items)=>{
    let total=0;
    for(const x of items){
      const baseNeed=toBase(x.name,x.qty,x.unit);if(!baseNeed)continue;
      let need=baseNeed.value;
      for(const item of working.filter(i=>normalizeName(i.name)===normalizeName(x.name)&&i.qty>0).sort((a,b)=>a.expiry.localeCompare(b.expiry))){
        const avail=toBase(x.name,item.qty,item.unit);if(!avail||avail.dim!==baseNeed.dim)continue;
        const used=Math.min(avail.value,need);
        const unitCost=item.price>0?item.price/avail.value:(canonMeta(x.name).cost||.8)/100;
        total+=used*unitCost;need-=used;if(need<=.001)break;
      }
    }
    consumeItems(working,items);
    return Number(total.toFixed(2));
  };
  for(let d=0;d<days.length;d++){
    const day=days[d];
    costByKey.set(`${d}-0`,takeCost(recipeIngredients(day.a)));
    let dinnerCost=takeCost(recipeIngredients(day.b));
    if(day.fruit)dinnerCost+=takeCost([day.fruit]);
    if(day.addOns?.length)dinnerCost+=takeCost(day.addOns);
    costByKey.set(`${d}-1`,Number(dinnerCost.toFixed(2)));
  }
  return costByKey;
}
function estimateRecipeCost(r,working){let total=0;for(const x of recipeIngredients(r)){let need=baseAmount(x.qty,x.unit,x.name);for(const item of working.filter(i=>normalizeName(i.name)===x.name&&i.qty>0).sort((a,b)=>a.expiry.localeCompare(b.expiry))){const avail=baseAmount(item.qty,item.unit,x.name);if(!avail)continue;const use=Math.min(avail,need);total+=item.price>0?item.price*(use/avail):(canonMeta(x.name).cost||.8)*(use/100);need-=use;if(need<=0)break}}return Number(total.toFixed(2))}
function menuPool(){return allRecipes().filter(recipeAllowed)}
function buildPlan(){
  const source=state.pantry.filter(x=>x.qty>0).map(x=>({...x}));if(!source.length){state.plan=null;renderAll();return;}
  syncSettings();const pool=menuPool();const onlineCount=pool.filter(r=>r.remote).length;const updated=typeof ONLINE_RECIPES_UPDATED_AT!=='undefined'&&ONLINE_RECIPES_UPDATED_AT!=='never'?` · online aggiornato ${ONLINE_RECIPES_UPDATED_AT}`:'';const rs=$('#recipePoolStatus');if(rs)rs.textContent=`🍽️ ${pool.length} ricette validate · ${onlineCount} online${updated} · database locale + GitHub Actions`;
  let best=null;
  const baseSeed=Date.now();
  let strictPool=buildFastPairPool(pool,source,baseSeed,true);
  let relaxedPool=null;
  const tryPool=(candidatePool,attemptOffset=0)=>{
    if(!candidatePool?.length)return null;
    let chosen=null;
    for(let attempt=0;attempt<5;attempt++){
      const candidate=searchFastWeeklyCandidates(candidatePool,source,baseSeed+attemptOffset*9973+attempt*7919);
      if(!candidate||!candidate.days?.length)continue;
      candidate.meals=[];
      candidate.days.forEach((d,day)=>{candidate.meals.push({day,slot:0,recipe:d.a},{day,slot:1,recipe:d.b});});
      if(candidate.meals.length<14)continue;
      candidate.fp=fingerprint(candidate.meals);
      const duplicate=(state.planHistory||[]).includes(candidate.fp);
      const allOK=candidate.days.length===7&&candidate.days.every(d=>d.nutrition.ok);
      candidate.score-=(duplicate?12000:0);
      if(!chosen||candidate.score>chosen.score||(allOK&&!duplicate&&!(chosen.days||[]).every(d=>d.nutrition?.ok)))chosen=candidate;
      if(allOK&&!duplicate)return candidate;
    }
    return chosen;
  };
  best=tryPool(strictPool,0);
  if(!best?.days?.length||!best.days.every(d=>d.nutrition.ok)){
    relaxedPool=buildFastPairPool(pool,source,baseSeed+4444,false);
    const fallback=tryPool(relaxedPool,1);
    if(fallback&&(!best||fallback.score>best.score))best=fallback;
  }
  if(!best||best.meals.length<14){
    if(best?.meals?.length){renderPartialPlan(best,source);toast('La spesa non consente una settimana completa 100% OK senza inventare ingredienti. Ho mantenuto solo pasti reali e mostrato cosa manca.');}
    else{state.plan=null;renderPlan();toast('Non trovo 14 pasti coperti dalla spesa: aggiungi varietà o usa un preset.');}
    return;
  }
  const costs=calculatePlanCosts(source,best.days);
  const meals=best.meals.map((m,idx)=>{const r=enrichRecipe(m.recipe),est=estimateRecipe(r);const rr={...r,kcal:r.kcal||est.kcal,p:r.p||est.p,c:r.c||est.c,f:r.f||est.f,cost:costs.get(`${m.day}-${m.slot}`)||0};return{id:`m-${m.day}-${m.slot}-${Date.now()}-${idx}`,day:m.day,slot:m.slot,recipe:rr};});
  state.plan={start:state.weekStart,meals,remaining:best.working,dayDetails:best.days.map(d=>d.nutrition),daysExtra:best.days,weekCost:meals.reduce((s,m)=>s+m.recipe.cost,0),menuFingerprint:best.fp};
  state.planHistory=[...(state.planHistory||[]),best.fp].slice(-20);for(const m of meals)state.prefs.seen[m.recipe.name]=(state.prefs.seen[m.recipe.name]||0)+1;save();buildSuggestions();renderAll();toast('14 pasti pronti · 7/7 giornate OK · settimana diversa dalle precedenti quando possibile.');
}
function renderPartialPlan(best,source){
  const costs=calculatePlanCosts(source,best.days||[]);
  const meals=best.meals.map((m,idx)=>{const r=enrichRecipe(m.recipe),est=estimateRecipe(r);return{id:`m-${m.day}-${m.slot}-${Date.now()}-${idx}`,day:m.day,slot:m.slot,recipe:{...r,kcal:r.kcal||est.kcal,p:r.p||est.p,c:r.c||est.c,f:r.f||est.f,cost:costs.get(`${m.day}-${m.slot}`)||0}}});
  const dayDetails=best.days.map(d=>d.nutrition);state.plan={start:state.weekStart,meals,remaining:best.working,dayDetails,daysExtra:best.days,weekCost:meals.reduce((s,m)=>s+m.recipe.cost,0),menuFingerprint:fingerprint(meals)};buildRepairSuggestions();renderAll();
}
function buildRepairSuggestions(){
  const p=state.pantry.filter(x=>x.qty>0);const missing=[];
  const candidates=[
    ['yogurt greco',170,'g','calcio + proteine'],['noci',20,'g','omega-3 ALA + grassi insaturi'],
    ['broccoli',150,'g','vitamina C + folati + fibra'],['spinaci',150,'g','folati + ferro + potassio'],
    ['ceci cotti',150,'g','fibra + folati + ferro'],['arancia',1,'pz','vitamina C + potassio'],
    ['kiwi',1,'pz','vitamina C + fibra'],['pane integrale',60,'g','carboidrati complessi + fibra'],
    ['salmone',120,'g','proteine + omega-3'],['uova',2,'pz','proteine + colina + micronutrienti']
  ];
  const partial=state.plan?.dayDetails||[];const dayExtras=state.plan?.daysExtra||[];
  for(let d=0;d<partial.length;d++){
    if(partial[d]?.ok)continue;
    const day=dayExtras[d];if(!day)continue;
    const pair=[{recipe:day.a},{recipe:day.b}],fruit=day.fruit||null;
    const ranked=[];
    for(const [n,q,u,why] of candidates){
      const dn=nutritionDay(pair,fruit,[{name:n,qty:q,unit:u}]);
      const available=availableFor(n,p)>=baseAmount(q,u,n)-.01;
      ranked.push({name:n,qty:q,unit:u,why,dn,available,gain:dn.score-(partial[d].score||0)});
    }
    ranked.sort((a,b)=>b.gain-a.gain);
    for(const x of ranked.slice(0,3)){
      if(x.gain<=0)continue;
      missing.push({day:d,name:x.name,qty:x.qty,unit:x.unit,why:x.why+(x.available?' · già presente, aumenta la quantità':' · da aggiungere alla spesa')});
    }
  }
  const seen=new Set();state.repairSuggestions=missing.filter(x=>{const k=`${x.day}|${x.name}`;if(seen.has(k))return false;seen.add(k);return true}).slice(0,15);
}
function groceryEstimatedCost(){const presetReady=state.budgetPreset&&state.budgetTarget&&state.pantry.length&&state.pantry.every(i=>i.presetId===state.budgetPreset);if(presetReady)return Number(state.budgetTarget.toFixed(2));return Number(state.pantry.reduce((s,i)=>s+(i.price||((canonMeta(i.name).cost||.8)*(baseAmount(i.qty,i.unit,i.name)/100))),0).toFixed(2))}
function consumedMenuCost(){return Number((state.plan?.meals||[]).reduce((s,m)=>s+(m.recipe.cost||0),0).toFixed(2))}
function renderPlan(){
  const g=$('#planGrid'),status=$('#planStatus');if(!g||!status)return;
  if(!state.plan?.meals?.length){g.innerHTML='';status.textContent=state.pantry.length?'Premi “Genera 7 giorni” per costruire il calendario.':'Inserisci la spesa o scegli un preset.';$('#weeklySummary')?.classList.add('hidden');return;}
  const byDay=DAY_NAMES.map((name,d)=>({name,d,meals:state.plan.meals.filter(m=>m.day===d)}));
  g.innerHTML=byDay.map(day=>{
    const dn=state.plan.dayDetails?.[day.d];const extra=state.plan.daysExtra?.[day.d];const date=addDays(state.plan.start,day.d);
    const mealsHtml=[0,1].map(slot=>{const m=day.meals.find(x=>x.slot===slot);if(!m)return `<div class="meal-card empty-slot"><div class="meal-type">${slot?'CENA':'PRANZO'}</div><p>Non coperto</p></div>`;return `<button class="meal-card ${slot?'dinner':''}" data-meal="${m.id}"><div class="meal-type">${slot?'CENA':'PRANZO'}</div><div class="meal-title">${escapeHtml(m.recipe.name)}</div><div class="meal-meta"><span>⏱ ${m.recipe.time||20}′</span><span>${m.recipe.kcal||estimateRecipe(m.recipe).kcal} kcal</span><span>${money(m.recipe.cost)}</span></div><div class="meal-bottom"><span>${m.recipe.remote?'✓ online QA':'✓ curata'}</span><span>↗ dettagli</span></div></button>`}).join('');
    const nutrition=dn?`<div class="day-nutrition"><b>${dn.ok?'🟢 Giornata OK':'🟠 Giornata da riequilibrare'}</b><span>${dn.total.kcal} kcal · P ${dn.total.p}g · C ${dn.total.c}g · G ${dn.total.f}g · fibra ${dn.total.fiber}g</span><small>C ${Math.round(dn.pct.c)}% · G ${Math.round(dn.pct.f)}% · P ${Math.round(dn.pct.p)}% · verdura+frutta ${Math.round(dn.totalVegFruit)}g · Ca ${Math.round(dn.mi.ca)}mg · Fe ${dn.mi.fe.toFixed(1)}mg · vit.C ${Math.round(dn.mi.vc)}mg</small>${extra?.fruit?`<div class="fruit-complement">🍎 ${quantityForDisplay(extra.fruit.qty,extra.fruit.unit)} ${escapeHtml(displayFood(extra.fruit.name))}${extra.addOns?.length?` · + ${extra.addOns.map(x=>`${quantityForDisplay(x.qty,x.unit)} ${escapeHtml(x.name)}`).join(' · + ')}`:''}</div>`:''}</div>`:'';
    return `<article class="day-card"><button class="day-head day-detail-btn" data-day="${day.d}"><div><b>${day.name}</b><small>${fmtDate(date)}</small></div><span class="day-score">${dn?`⚖ ${dn.score}/100 ${dn.ok?'🟢':'🟠'}`:`${day.meals.length}/2`}</span></button>${mealsHtml}${nutrition}</article>`;
  }).join('');
  $$('[data-meal]').forEach(b=>b.onclick=e=>{e.stopPropagation();openMeal(b.dataset.meal)});$$('[data-day]').forEach(b=>b.onclick=()=>openDay(Number(b.dataset.day)));
  const grocery=groceryEstimatedCost(),used=consumedMenuCost(),bad=byDay.filter(d=>!state.plan.dayDetails?.[d.d]?.ok).length;status.innerHTML=`<b>${state.plan.meals.length}/14 pasti coperti</b> · <b>${money(grocery)}</b> spesa · ${money(used)} valore ingredienti consumati · ${bad?`⚠ ${bad} giornate da riequilibrare`:'<b>7/7 giornate OK</b>'}`;
  const summary=$('#weeklySummary');if(summary){summary.innerHTML=`<div class="summary-stat"><b>${state.plan.meals.length}/14</b><span>pasti coperti</span></div><div class="summary-stat"><b>${money(grocery)}</b><span>totale spesa</span></div><div class="summary-stat"><b>${money(used)}</b><span>valore consumato dal menu</span></div><div class="summary-stat"><b>${Math.round((state.plan.dayDetails||[]).reduce((s,d)=>s+(d?.score||0),0)/Math.max(1,state.plan.dayDetails?.length||1))}/100</b><span>equilibrio medio</span></div>`;summary.classList.remove('hidden');}
  renderRepairSuggestions();
}
function renderPantry(){
  const p=state.pantry;const count=p.length;$('#pantryCount').textContent=`${count} prodott${count===1?'o':'i'}`;if(!count){$('#pantryList').innerHTML='<div class="empty-pantry">Inventario vuoto. Parti da un ingrediente o da un preset. 🍋</div>';$('#expiredBanner').classList.add('hidden');return;}
  const sorted=[...p].sort((a,b)=>a.expiry.localeCompare(b.expiry));$('#pantryList').innerHTML=sorted.map(i=>`<div class="pantry-row"><div class="pantry-main"><span class="food-dot ${daysFromToday(i.expiry)<=3?'hot':''}"></span><div><b>${escapeHtml(i.original||i.name)}</b><small>${quantityForDisplay(i.qty,i.unit)} · ${money(i.price||0)} · ${daysFromToday(i.expiry)<=3?'⏰ '+(daysFromToday(i.expiry)<=0?'oggi/oltre':'entro 3 gg'):freshInfo(i)}</small></div></div><div class="pantry-actions"><button class="icon-btn" title="Modifica quantità" data-edit="${i.id}">✎</button><button class="icon-btn danger" title="Elimina" data-delete="${i.id}">×</button></div></div>`).join('');
  $$('[data-delete]').forEach(b=>b.onclick=()=>{state.pantry=state.pantry.filter(x=>x.id!==b.dataset.delete);state.plan=null;state.budgetPreset=null;state.budgetTarget=null;save();checkShopping(true);renderAll()});
  $$('[data-edit]').forEach(b=>b.onclick=()=>editPantry(b.dataset.edit));const exp=sorted.filter(i=>daysFromToday(i.expiry)<=3).length;$('#expiredBanner').classList.toggle('hidden',!exp);if(exp)$('#expiredBanner').innerHTML=`⏰ ${exp} prodott${exp===1?'o è':'i sono'} da usare presto: il planner darà loro priorità.`;
}
function freshInfo(i){const d=daysFromToday(i.expiry);return d<0?'scaduto':d===0?'oggi':d===1?'domani':`${d} gg`}
function editPantry(id){const i=state.pantry.find(x=>x.id===id);if(!i)return;const q=prompt(`Quantità di ${i.original||i.name}`,String(i.qty));if(q!==null&&!Number.isNaN(Number(q))){i.qty=Math.max(0,Number(q));delete i.presetId;state.budgetPreset=null;state.budgetTarget=null;state.plan=null;save();checkShopping(true);renderAll();}}
function addPantryItems(items,target){
  const t=todayISO(),raw=items.map(x=>Math.max(.15,(canonMeta(x[0]).cost||.8)*(Math.max(1,baseAmount(x[1],x[2],x[0]))/100)));const rawTotal=raw.reduce((a,b)=>a+b,0)||1;let assigned=0;
  items.forEach((x,idx)=>{let price=idx===items.length-1?Number(Math.max(.01,target-assigned).toFixed(2)):Number((target*raw[idx]/rawTotal).toFixed(2));assigned+=price;state.pantry.push({id:`i-${Date.now()}-${idx}-${Math.random()}`,name:normalizeName(x[0]),original:x[0],qty:x[1],unit:x[2],expiry:addDays(t,canonMeta(x[0]).days??7),price,presetId:state.budgetPreset});});
}
function applyPreset(id){const b=BUDGETS.find(x=>x.id===id);if(!b)return;state.pantry=[];state.budgetTarget=b.target;state.budgetPreset=b.id;state.plan=null;state.score=null;addPantryItems(b.items,b.target);save();checkShopping(true);buildPlan();toast(`${b.title} caricata: spesa, check e calendario aggiornati.`);window.scrollTo({top:0,behavior:'smooth'})}
function renderPresets(){$('#presetGrid').innerHTML=BUDGETS.map(b=>`<button class="preset-card" data-preset="${b.id}"><span>${b.icon}</span><div><b>${b.title}</b><small>${b.desc}</small></div><strong>→</strong></button>`).join('');$$('[data-preset]').forEach(b=>b.onclick=()=>applyPreset(b.dataset.preset))}
function renderQuickAdds(){const q=['uova','yogurt greco','petto di pollo','salmone','ceci cotti','pasta integrale','riso','zucchine','mela','banana','curry','rosmarino'];$('#quickAdds').innerHTML=q.map(n=>`<button class="quick-pill" data-quick="${escapeHtml(n)}">+ ${escapeHtml(n)}</button>`).join('');$$('[data-quick]').forEach(b=>b.onclick=()=>fillIngredient(b.dataset.quick))}
function renderAutocomplete(value){const q=normalizeLoose(value),target=$('#autocomplete');if(!q){target.innerHTML='';target.classList.remove('show');return}const items=ROOT.INGREDIENT_SEARCH_ITEMS||[];const toks=q.split(/\s+/);const hits=items.map(x=>{const s0=normalizeLoose(x),canon=normalizeName(x);let s=s0===q?100:s0.startsWith(q)?65:0;for(const t of toks)if(s0.includes(t))s+=12;if(canon===q)s+=25;else if(canon.startsWith(q))s+=12;return{x,s,canon}}).filter(x=>x.s>0).sort((a,b)=>b.s-a.s||a.x.length-b.x.length).slice(0,14);target.innerHTML=hits.map(h=>`<button type="button" data-hit="${escapeHtml(h.x)}"><b>${escapeHtml(h.x)}</b>${normalizeName(h.x)!==normalizeLoose(h.x)?`<small>→ ${escapeHtml(h.canon)}</small>`:''}</button>`).join('');target.classList.toggle('show',hits.length>0);$$('[data-hit]').forEach(b=>b.onclick=()=>fillIngredient(b.dataset.hit))}
function fillIngredient(raw){const n=normalizeName(raw),m=canonMeta(n);$('#ingredientName').value=raw;$('#ingredientUnit').value=m.unit||'g';$('#ingredientExpiry').value=expirySuggested(n);$('#ingredientExpiry').dataset.manual='';$('#autocomplete').classList.remove('show');$('#ingredientQty').focus()}
function webSearch(){const active=state.pantry.filter(x=>x.qty>0).sort((a,b)=>a.expiry.localeCompare(b.expiry));if(!active.length){toast('Prima inserisci qualcosa.');return}$('#webRecipesSection').classList.remove('hidden');const names=active.slice(0,4).map(x=>displayFood(x.name));const q=encodeURIComponent(`${names.join(' ')} recipe`);$('#webGrid').innerHTML=`<article class="web-card"><div class="web-body"><h3>Ispirazione esterna</h3><p>La ricerca resta fuori dal planner: Gnam non importa pagine arbitrarie nel menu. Le ricette entrano nel database soltanto tramite il workflow giornaliero con QA.</p><div class="web-links"><a class="primary-btn" href="https://www.google.com/search?q=${q}" target="_blank" rel="noreferrer">Cerca ricette ↗</a><a class="ghost-btn" href="https://www.themealdb.com/" target="_blank" rel="noreferrer">TheMealDB ↗</a></div></div></article>`}
function buildSuggestions(){const p=state.pantry.filter(x=>x.qty>0);if(!p.length){state.suggestions=[];renderSuggestions();return}const candidates=[];for(const r of allRecipes().filter(recipeIsValid)){if(recipeCovered(r,p))continue;const missing=[...new Set(recipeIngredients(r).filter(x=>{const ba=baseAmount(x.qty,x.unit,x.name);return ba&&availableFor(x.name,p)<ba-.01}).map(x=>x.name))];if(missing.length===1)candidates.push({r,missing:missing[0]})}const seen=new Set();state.suggestions=candidates.sort((a,b)=>(state.prefs.seen[a.r.name]||0)-(state.prefs.seen[b.r.name]||0)).filter(x=>{if(seen.has(x.r.name))return false;seen.add(x.r.name);return true}).slice(0,6);save();renderSuggestions()}
function renderSuggestions(){const a=state.suggestions||[];$('#suggestionSection').classList.toggle('hidden',!a.length);$('#suggestionGrid').innerHTML=a.map(x=>`<button class="suggestion-card" data-suggest="${escapeHtml(x.r.id)}"><div class="suggestion-art">+1</div><div><span class="suggestion-add">Ti manca solo</span><h3>${escapeHtml(x.missing)}</h3><p>${escapeHtml(x.r.name)}</p><small>${x.r.kcal||estimateRecipe(x.r).kcal} kcal · ${x.r.time||20} min</small></div></button>`).join('');$$('[data-suggest]').forEach(b=>b.onclick=()=>openSuggested(b.dataset.suggest))}
function renderRepairSuggestions(){const box=$('#repairSection'),grid=$('#repairGrid');if(!box||!grid)return;const items=state.repairSuggestions||[];box.classList.toggle('hidden',items.length===0);grid.innerHTML=items.map(x=>`<div class="repair-card"><b>${DAY_NAMES[x.day]}</b><span>+ ${quantityForDisplay(x.qty,x.unit)} ${escapeHtml(x.name)}</span><small>${escapeHtml(x.why)}</small></div>`).join('')}
function openSuggested(id){const r=allRecipes().find(x=>x.id===id);if(!r)return;const fake={id:'s',day:0,slot:0,recipe:r};state.plan={meals:[fake],start:state.weekStart,dayDetails:[]};openMeal('s')}
function openDay(day){const dn=state.plan?.dayDetails?.[day];if(!dn)return;const extra=state.plan.daysExtra?.[day],date=addDays(state.plan.start,day),t=dn.targets;const rows=[
 ['Energia',`${dn.total.kcal} kcal`,`range Gnam: ${t.kcalMin}–${t.kcalMax}`,dn.total.kcal>=t.kcalMin&&dn.total.kcal<=t.kcalMax],
 ['Proteine',`${dn.total.p} g`,`≥ ${t.proteinMin} g`,dn.total.p>=t.proteinMin],['Carboidrati',`${dn.total.c} g · ${Math.round(dn.pct.c)} E%`,'45–60 E%',dn.pct.c>=45&&dn.pct.c<=60],['Grassi',`${dn.total.f} g · ${Math.round(dn.pct.f)} E%`,'20–35 E%',dn.pct.f>=20&&dn.pct.f<=35],['Fibra',`${dn.total.fiber} g`,`≥ ${t.fiberMin} g`,dn.total.fiber>=t.fiberMin],['Frutta+verdura',`${Math.round(dn.totalVegFruit)} g`,`≥ ${t.vegFruitMin} g`,dn.totalVegFruit>=t.vegFruitMin],['Calcio',`${Math.round(dn.mi.ca)} mg`,`≥ ${t.caMin} mg`,dn.mi.ca>=t.caMin],['Ferro',`${dn.mi.fe.toFixed(1)} mg`,`≥ ${t.feMin} mg`,dn.mi.fe>=t.feMin],['Vitamina C',`${Math.round(dn.mi.vc)} mg`,`≥ ${t.vcMin} mg`,dn.mi.vc>=t.vcMin],['Folati',`${Math.round(dn.mi.fol)} µg`,`≥ ${t.folMin} µg`,dn.mi.fol>=t.folMin],['Potassio',`${Math.round(dn.mi.k)} mg`,`≥ ${t.kMin} mg`,dn.mi.k>=t.kMin],['Omega-3',`${dn.mi.o3.toFixed(2)} g`,`≥ ${t.o3Min} g (stima)`,dn.mi.o3>=t.o3Min]
 ];
  const explanations=dn.ok?`La coppia pranzo+cena è considerata OK perché i carboidrati e i grassi sono nelle bande di pianificazione EFSA, la quota proteica e la fibra sono adeguate per il blocco dei due pasti, frutta e verdura superano il target operativo e almeno 4 dei 5 micronutrienti-cardine superano la soglia. La frutta è esplicitamente aggiunta al bilancio.`:`Questa giornata non è completamente OK: il planner dovrebbe prima sostituire uno dei due pasti. Se non trova una sostituzione compatibile, mostra gli ingredienti che migliorerebbero concretamente il bilancio.`;
  $('#modalContent').innerHTML=`<div class="modal-eyebrow">${DAY_NAMES[day]} · ${fmtDate(date)} · ANALISI SCIENTIFICA DELLA GIORNATA</div><h2 id="modalTitle">${dn.ok?'🟢':'🟠'} ${dn.ok?'Perché questa giornata è OK':'Cosa manca per renderla OK'}</h2><div class="day-detail-banner ${dn.ok?'ok':'warn'}"><b>${dn.score}/100</b><span>${escapeHtml(explanations)}</span></div><div class="nutrition-table">${rows.map(r=>`<div class="nutrition-row"><b>${r[0]}</b><span>${r[1]}</span><small>${r[2]}</small><strong class="${r[3]?'yes':'no'}">${r[3]?'OK':'△'}</strong></div>`).join('')}</div><div class="day-reasoning"><b>Perché questi criteri?</b><p>WHO raccomanda almeno 400 g/die di frutta e verdura negli adulti e almeno 25 g/die di fibra naturalmente presente negli alimenti. Per i carboidrati, l'EFSA riporta 45–60% dell'energia; per i grassi 20–35%; per le proteine, il PRI adulto EFSA è 0,83 g/kg/die. Gnam applica queste basi al solo blocco pranzo+cena e lascia margine a colazione e spuntini.</p><p>Micro: calcio ${Math.round(dn.mi.ca)} mg, ferro ${dn.mi.fe.toFixed(1)} mg, vitamina C ${Math.round(dn.mi.vc)} mg, folati ${Math.round(dn.mi.fol)} µg, potassio ${Math.round(dn.mi.k)} mg. ${dn.microCount}/5 superano la soglia operativa del blocco.</p><p>Complemento: ${extra?.fruit?`🍎 ${quantityForDisplay(extra.fruit.qty,extra.fruit.unit)} ${escapeHtml(extra.fruit.name)}`:'nessuna frutta disponibile'}${extra?.addOns?.length?` · ${extra.addOns.map(x=>`+ ${quantityForDisplay(x.qty,x.unit)} ${escapeHtml(x.name)}`).join(' · ')}`:''}</p><small>Le quantità nutrizionali sono stime da dati composizionali rappresentativi. Sono strumenti di pianificazione, non una valutazione dietetica clinica personalizzata.</small></div><div class="source-line"><a href="https://www.who.int/health-topics/healthy-diet" target="_blank" rel="noreferrer">WHO · Healthy diet</a> · <a href="https://www.efsa.europa.eu/en/topics/topic/dietary-reference-values" target="_blank" rel="noreferrer">EFSA · Dietary Reference Values</a> · <a href="https://fdc.nal.usda.gov/" target="_blank" rel="noreferrer">USDA FoodData Central</a></div>`;
  $('#recipeModal').classList.remove('hidden');
}
function recipeInstructions(r){return Array.isArray(r.steps)&&r.steps.length?r.steps:['Procedura non validata: la ricetta non dovrebbe essere mostrata.']}
function openMeal(id){const m=state.plan?.meals?.find(x=>x.id===id);if(!m)return;const r=enrichRecipe(m.recipe),ing=recipeIngredients(r).map(x=>`<li><b>${quantityForDisplay(x.qty,x.unit)}</b> ${escapeHtml(displayFood(x.name))}</li>`).join(''),steps=recipeInstructions(r).map((s,i)=>`<li><span>${i+1}</span>${escapeHtml(s)}</li>`).join(''),source=r.sourceUrl?`<a href="${escapeHtml(r.sourceUrl)}" target="_blank" rel="noreferrer">Fonte ↗</a>`:'',provenance=r.remote?'✓ database online · QA':'✓ ricetta curata';$('#modalContent').innerHTML=`<div class="modal-eyebrow">${DAY_NAMES[m.day]} · ${m.slot?'CENA':'PRANZO'} · ${provenance}</div><h2 id="modalTitle">${escapeHtml(r.name)}</h2><div class="recipe-metrics"><span>⏱ ${r.time||20} min</span><span>🧩 difficoltà ${r.diff||1}/3</span><span>🧬 ${r.kcal||estimateRecipe(r).kcal} kcal</span><span>💪 ${r.p||estimateRecipe(r).p} g proteine</span><span>💶 ${money(m.recipe.cost)}</span></div><div class="source-line">${source}</div><div class="recipe-cols"><div><h3>Ingredienti per ${state.people} person${state.people===1?'a':'e'}</h3><ul class="ingredient-list">${ing}</ul></div><div><h3>Preparazione</h3><ol class="step-list">${steps}</ol></div></div><div class="tip-box"><b>💡 Consiglio Gnam</b> ${escapeHtml(r.tip||'Le spezie indicate qui sono ingredienti reali della ricetta e devono essere presenti nella spesa; non vengono aggiunte “di nascosto”.')}</div><div class="modal-actions"><button class="primary-btn" id="likeBtn">👍 Mi è piaciuto</button><button class="ghost-btn" id="dislikeBtn">👎 Non rifarlo</button></div>`;$('#recipeModal').classList.remove('hidden');$('#likeBtn').onclick=()=>rateRecipe(r,1);$('#dislikeBtn').onclick=()=>rateRecipe(r,-1)}
function rateRecipe(r,val){state.prefs.likes[r.name]=(state.prefs.likes[r.name]||0)+val;save();toast(val>0?'Preferenza salvata.':'Ricevuto: la ricetta perderà priorità.');closeModal()}
function closeModal(){$('#recipeModal').classList.add('hidden')}
function shoppingScore(p){const g=byGroups(p),fruit=(g.fruit||[]).length,veg=(g.vegetable||[]).length,proteins=new Set(p.map(proteinFamily).filter(Boolean)).size,fresh=p.filter(i=>daysFromToday(i.expiry)<=7).length,long=p.filter(i=>daysFromToday(i.expiry)>14).length;let score=Math.min(20,veg*4)+Math.min(10,fruit*2)+Math.min(16,proteins*5)+((g.legume||[]).length?12:0)+((g.grain||[]).length?10:0)+((g.dairy||[]).length?5:0)+((g.nuts||[]).length?7:0)+((g.oil||[]).length?5:0)+(fresh&&long?8:fresh||long?4:0)+(g.spice?.length||g.herb?.length?5:0);return Math.max(1,Math.min(100,Math.round(score)))}
function checkShopping(silent=false){const p=state.pantry.filter(x=>x.qty>0);if(!p.length){state.score=null;renderCheck();return}const g=byGroups(p),proteins=new Set(p.map(proteinFamily).filter(Boolean)),score=shoppingScore(p),checks=[['🥬','Verdure',`${(g.vegetable||[]).length} tipi`,(g.vegetable||[]).length>=4],['🍎','Frutta',`${(g.fruit||[]).length} tipi`,(g.fruit||[]).length>=2],['💪','Proteine',`${proteins.size} famiglie`,proteins.size>=3],['🌾','Legumi/cereali',`${(g.legume||[]).length} legumi · ${(g.grain||[]).length} cereali`,(g.legume||[]).length>0&&(g.grain||[]).length>0],['🌿','Spezie/erbe',`${(g.spice||[]).length+(g.herb||[]).length} elementi`,(g.spice||[]).length+(g.herb||[]).length>=3],['⏳','Fresco + dispensa',`${p.filter(i=>daysFromToday(i.expiry)<=7).length} · ${p.filter(i=>daysFromToday(i.expiry)>14).length}`,true]];const suggestions=[];if((g.fruit||[]).length<2)suggestions.push('Aggiungi almeno 2 frutti diversi.');if((g.vegetable||[]).length<4)suggestions.push('Porta le verdure ad almeno 4 tipologie diverse.');if(proteins.size<3)suggestions.push('Aggiungi una terza famiglia proteica.');if(!(g.legume||[]).length)suggestions.push('Aggiungi ceci, lenticchie o fagioli.');if(((g.spice||[]).length+(g.herb||[]).length)<3)suggestions.push('Aggiungi sale, pepe e le erbe/spezie più usate.');if(!p.some(i=>canonMeta(i.name).group==='nuts'))suggestions.push('Aggiungi noci o mandorle.');state.score={score,checks,suggestions};state.shoppingChecks=[...(state.shoppingChecks||[]),{date:todayISO(),score}].slice(-60);save();renderCheck();if(!silent)$('#checkSection')?.scrollIntoView({behavior:'smooth',block:'start'})}
function renderCheck(){const x=state.score,box=$('#shoppingCheck');if(!x){$('#shoppingScoreBadge').textContent='— / 100';$('#shoppingScoreBadge').className='score-badge neutral';box.innerHTML='<div class="check-face">🛒</div><div><h3>Check live</h3><p>Ogni ingrediente aggiunto aggiorna automaticamente il controllo della spesa.</p></div>';return}const cls=x.score>=80?'great':x.score>=65?'good':x.score>=50?'mid':'low';$('#shoppingScoreBadge').textContent=`${x.score} / 100`;$('#shoppingScoreBadge').className=`score-badge ${cls}`;box.innerHTML=`<div class="score-big ${cls}">${x.score}</div><div class="check-main"><div class="check-grid">${x.checks.map(c=>`<div><span>${c[0]}</span><b>${c[1]}</b><small>${c[2]}</small><strong>${c[3]?'✓':'△'}</strong></div>`).join('')}</div><div class="improve"><b>🎯 Per migliorare</b>${x.suggestions.length?x.suggestions.map(s=>`<span>→ ${escapeHtml(s)}</span>`).join(''):'<span>→ La spesa è ben strutturata.</span>'}</div></div>`}
function syncSettings(){state.people=Math.max(1,Number($('#people')?.value||state.people||1));state.difficulty=Number($('#difficulty')?.value||state.difficulty||2);state.age=Number($('#age')?.value||state.age||30);state.weight=Number($('#weight')?.value||state.weight||70);state.activity=$('#activity')?.value||state.activity;state.weekStart=$('#weekStart')?.value||state.weekStart||mondayOf();save()}
function renderSuggestions(){const a=state.suggestions||[];$('#suggestionSection').classList.toggle('hidden',!a.length);$('#suggestionGrid').innerHTML=a.map(x=>`<button class="suggestion-card" data-suggest="${escapeHtml(x.r.id)}"><div class="suggestion-art">+1</div><div><span class="suggestion-add">Ti manca solo</span><h3>${escapeHtml(x.missing)}</h3><p>${escapeHtml(x.r.name)}</p><small>${x.r.kcal||estimateRecipe(x.r).kcal} kcal · ${x.r.time||20} min</small></div></button>`).join('');$$('[data-suggest]').forEach(b=>b.onclick=()=>openSuggested(b.dataset.suggest))}
function renderAll(){renderPantry();renderCheck();renderPlan();renderSuggestions();buildRepairSuggestions();renderRepairSuggestions()}
function bind(){
  $('#ingredientName').addEventListener('input',e=>{renderAutocomplete(e.target.value);const n=normalizeName(e.target.value);if(ROOT.INGREDIENT_CATALOG?.[n]||EXTRA_META[n]){if(!$('#ingredientExpiry').dataset.manual)$('#ingredientExpiry').value=expirySuggested(n);$('#ingredientUnit').value=canonMeta(n).unit||$('#ingredientUnit').value;}});
  $('#ingredientExpiry').addEventListener('input',e=>e.target.dataset.manual='1');document.addEventListener('click',e=>{if(!e.target.closest('.autocomplete-wrap'))$('#autocomplete').classList.remove('show')});
  $('#ingredientForm').addEventListener('submit',e=>{e.preventDefault();const raw=$('#ingredientName').value.trim(),n=normalizeName(raw),qty=Number($('#ingredientQty').value),unit=$('#ingredientUnit').value,expiry=$('#ingredientExpiry').value,price=Number($('#ingredientPrice').value)||null;if(!raw||!qty||!expiry)return;const m=canonMeta(n);state.pantry.push({id:`i-${Date.now()}-${Math.random()}`,name:n,original:raw,qty,unit,expiry,price});state.budgetPreset=null;state.budgetTarget=null;state.plan=null;save();e.target.reset();$('#ingredientQty').value=m.unit==='pz'?1:300;$('#ingredientUnit').value=m.unit||'g';$('#ingredientExpiry').value=addDays(todayISO(),m.days??7);$('#ingredientExpiry').dataset.manual='';checkShopping(true);renderAll();toast(`${raw} aggiunto · check aggiornato.`);});
  $$('.profile-tab').forEach(b=>b.onclick=()=>{state.profile=b.dataset.profile;$$('.profile-tab').forEach(x=>x.classList.toggle('active',x===b));$('#profileNote').textContent=PROFILE_INFO[state.profile].note;save()});
  ['difficulty','people','age','weight','activity','weekStart'].forEach(id=>$('#'+id).addEventListener('change',()=>{syncSettings()}));
  $('#generateBtn').onclick=buildPlan;$('#generateTopBtn').onclick=()=>{buildPlan();$('#planSection').scrollIntoView({behavior:'smooth'})};$('#checkBtn').onclick=()=>checkShopping();$('#webBtn').onclick=webSearch;$('#demoBtn').onclick=()=>applyPreset('balanced');document.addEventListener('click',e=>{if(e.target.closest('[data-close-modal]'))closeModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
}
function init(){if(typeof document==='undefined')return;state.weekStart=state.weekStart||mondayOf();$('#weekStart').value=state.weekStart;$('#profileNote').textContent=PROFILE_INFO[state.profile].note;$$('.profile-tab').forEach(x=>x.classList.toggle('active',x.dataset.profile===state.profile));$('#difficulty').value=state.difficulty;$('#people').value=state.people;$('#age').value=state.age;$('#weight').value=state.weight;$('#activity').value=state.activity;renderPresets();renderQuickAdds();checkShopping(true);renderAll();bind();}
ROOT.GNAM_STATE=state; ROOT.GNAM_DATA={BUDGETS,KITCHEN_KIT,FRUIT_PACKS}; ROOT.GNAM_ENGINE={buildPlan,checkShopping,allRecipes,recipeIsValid,dailyTargets,nutritionDay,searchWeeklyPlan,searchFastWeeklyCandidates,recipeCovered,estimateRecipeCost,dayExtras,consumeRecipe,proteinFamilyFromRecipe,pairOverlap,recipeAllowed,calculatePlanCosts,groceryEstimatedCost,consumedMenuCost,buildFastPairPool,applyPreset,addPantryItems,consumeItems,recipeIngredients};
init();
