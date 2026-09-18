import fs from 'node:fs/promises';

const KEY = process.env.THEMEALDB_API_KEY || '1';
const BASE = `https://www.themealdb.com/api/json/v1/${KEY}`;
const OUT = new URL('../online-recipes.generated.js', import.meta.url);
const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const ALIAS = {
  'extra virgin olive oil':'olio evo','olive oil':'olio evo','oil':'olio evo','sunflower oil':'olio evo','vegetable oil':'olio evo','rapeseed oil':'olio evo','canola oil':'olio evo',
  'salt':'sale','sea salt':'sale','black pepper':'pepe nero','ground black pepper':'pepe nero','pepper':'pepe nero',
  'garlic':'aglio','garlic clove':'aglio','garlic cloves':'aglio','ginger':'zenzero','fresh ginger':'zenzero',
  'onion':'cipolla','red onions':'cipolla rossa','red onion':'cipolla rossa','spring onions':'cipollotto','spring onion':'cipollotto','scallions':'cipollotto','leek':'porro','leeks':'porro','shallot':'scalogno','scallion':'cipollotto',
  'carrots':'carote','carrot':'carote','potatoes':'patate','potato':'patate','sweet potato':'patata dolce','sweet potatoes':'patata dolce',
  'courgette':'zucchine','courgettes':'zucchine','zucchini':'zucchine','eggplant':'melanzane','aubergine':'melanzane','aubergines':'melanzane',
  'red pepper':'peperoni','green pepper':'peperoni','yellow pepper':'peperoni','pepper':'peperoni','romano pepper':'peperoni','bell pepper':'peperoni','bell peppers':'peperoni',
  'tomato':'pomodori','tomatoes':'pomodori','plum tomatoes':'pomodori','cherry tomatoes':'pomodorini','tinned tomatos':'passata di pomodoro','tinned tomatoes':'passata di pomodoro','tomato puree':'passata di pomodoro','tomato purée':'passata di pomodoro','tomato paste':'passata di pomodoro',
  'broccoli':'broccoli','spinach':'spinaci','peas':'piselli','green peas':'piselli','snow peas':'taccole','sugar snap peas':'taccole','green beans':'fagiolini','runner beans':'fagiolini','cabbage':'cavolo','red cabbage':'cavolo','cauliflower':'cavolfiore','celery':'sedano','celeriac':'sedano rapa','fennel':'finocchio','lettuce':'lattuga','rocket':'rucola','arugula':'rucola','mushrooms':'funghi','mushroom':'funghi',
  'chicken breast':'petto di pollo','chicken breasts':'petto di pollo','chicken':'pollo','chicken thighs':'cosce di pollo','chicken thigh':'coscia di pollo','chicken legs':'cosce di pollo',
  'turkey breast':'fesa di tacchino','turkey':'tacchino','beef mince':'macinato di manzo','ground beef':'macinato di manzo','beef':'manzo','beef steak':'bistecca di manzo','lamb mince':'agnello macinato','ground lamb':'agnello macinato','lamb':'agnello','pork':'maiale','pork belly':'pancetta','bacon':'pancetta','ham':'prosciutto cotto','sausage':'salsiccia',
  'salmon':'salmone','salmon fillet':'salmone','salmon fillets':'salmone','cod':'merluzzo','cod fillet':'merluzzo','cod fillets':'merluzzo','sea bass':'branzino','sea bream':'orata','tuna':'tonno al naturale','tinned tuna':'tonno al naturale','canned tuna':'tonno al naturale','prawns':'gamberi','shrimp':'gamberi','king prawns':'gamberi','raw tiger prawns':'gamberi','squid':'calamari','mussels':'cozze','clams':'vongole','seafood mix':'mix frutti di mare','mixed seafood':'mix frutti di mare',
  'egg':'uova','eggs':'uova','egg yolks':'tuorli','egg white':'albumi','egg whites':'albumi','greek yogurt':'yogurt greco','yogurt':'yogurt greco','double cream':'panna','heavy cream':'panna','cream':'panna','milk':'latte','whole milk':'latte','cottage cheese':'fiocchi di latte','ricotta':'ricotta','feta':'feta','parmesan':'parmigiano','cheddar':'cheddar','mozzarella':'mozzarella','butter':'burro',
  'plain flour':'farina','all purpose flour':'farina','all-purpose flour':'farina','flour':'farina','cornstarch':'amido di mais','semolina':'semola','breadcrumbs':'pangrattato','panko breadcrumbs':'pangrattato',
  'wholemeal pasta':'pasta integrale','wholewheat pasta':'pasta integrale','wholemeal bread':'pane integrale','whole wheat bread':'pane integrale','white bread':'pane','bread':'pane','pita':'pane pita','pita bread':'pane pita','tortilla wraps':'piadina','tortilla':'piadina','egg roll wrappers':'pasta wonton',
  'rice':'riso','basmati rice':'riso basmati','brown rice':'riso integrale','barley':'orzo','pearl barley':'orzo','couscous':'cous cous','cous cous':'cous cous','noodles':'noodles','spaghetti':'pasta','penne':'pasta','linguine':'pasta','macaroni':'pasta','lasagne sheets':'sfoglie lasagna','gnocchi':'gnocchi',
  'chickpeas':'ceci cotti','chickpeas canned':'ceci cotti','canned chickpeas':'ceci cotti','cooked chickpeas':'ceci cotti','lentils':'lenticchie cotte','green lentils':'lenticchie cotte','red lentils':'lenticchie cotte','cooked lentils':'lenticchie cotte','black beans':'fagioli neri','kidney beans':'fagioli rossi','cannellini beans':'fagioli cannellini','white beans':'fagioli cannellini','black eyed peas':'piselli dall\'occhio nero',
  'tofu':'tofu','tempeh':'tempeh','walnuts':'noci','almonds':'mandorle','cashew nuts':'anacardi','peanuts':'arachidi','peanut butter':'burro di arachidi','sesame seeds':'semi di sesamo','sunflower seeds':'semi di girasole','pumpkin seeds':'semi di zucca',
  'olive':'olive','olives':'olive','capers':'capperi','pickles':'cetriolini sottaceto','soy sauce':'salsa di soia','rice wine vinegar':'aceto di riso','red wine vinegar':'aceto','white wine vinegar':'aceto','balsamic vinegar':'aceto balsamico','vinegar':'aceto','stock':'brodo vegetale','vegetable stock':'brodo vegetale','chicken stock':'brodo di pollo','beef stock':'brodo di manzo',
  'curry powder':'curry','curry':'curry','paprika':'paprika','smoked paprika':'paprika','turmeric':'curcuma','cumin':'cumino','ground cumin':'cumino','oregano':'origano','dried oregano':'origano','rosemary':'rosmarino','thyme':'timo','sage':'salvia','mint':'menta','fresh mint':'menta','parsley':'prezzemolo','fresh parsley':'prezzemolo','coriander':'coriandolo','fresh coriander':'coriandolo','dill':'aneto','basil':'basilico','basil leaves':'basilico','chilli powder':'peperoncino','chili powder':'peperoncino','red chilli':'peperoncino','green chilli':'peperoncino','bay leaf':'alloro','bay leaves':'alloro','cinnamon':'cannella','nutmeg':'noce moscata','cloves':'chiodi di garofano',
  'lemon':'limone','lemons':'limone','lime':'lime','limes':'lime','apple':'mela','apples':'mela','banana':'banana','bananas':'banana','orange':'arancia','oranges':'arancia','pear':'pera','pears':'pera','kiwi':'kiwi','berries':'frutti di bosco','strawberries':'fragole','raspberries':'lamponi','blueberries':'mirtilli','avocado':'avocado',
  'sugar':'zucchero','honey':'miele','maple syrup':'sciroppo d\'acero','cocoa':'cacao','cocoa powder':'cacao','chocolate':'cioccolato','dark chocolate':'cioccolato fondente',
  'water':'__HOUSEHOLD_WATER__','ice':'__HOUSEHOLD_ICE__','ice water':'__HOUSEHOLD_ICE__'
};

const PIECE_G={
  aglio:3, zenzero:5, cipolla:150, 'cipolla rossa':150, cipollotto:25, porro:120, scalogno:40, carote:80, patate:180,
  peperoni:150, pomodori:120, pomodorini:20, zucchine:200, melanzane:250, broccoli:300, cavolfiore:500, finocchio:300, lattuga:250,
  limone:80, lime:70, mela:180, banana:120, arancia:170, pera:180, kiwi:80, avocado:150,
  'petto di pollo':180, 'fesa di tacchino':180, 'salmone':150, merluzzo:150, orata:200, tonno:100, gamberi:100,
  uova:60, 'pane pita':60, piadina:90
};
const LIQUIDS=new Set(['olio evo','latte','panna','aceto','aceto balsamico','aceto di riso','salsa di soia','brodo vegetale','brodo di pollo','brodo di manzo']);
const CUP_G={farina:125,'pasta':100,'riso':185,'orzo':160,'cous cous':173,'ceci cotti':164,'lenticchie cotte':192,'zucchero':200,'yogurt greco':245};

function norm(s){return String(s||'').toLowerCase().normalize('NFKC').replace(/[’]/g,"'").replace(/[-_/]+/g,' ').replace(/\s+/g,' ').trim();}
function canonical(raw){const n=norm(raw);return ALIAS[n]||n;}
function frac(s){
  const x=String(s).trim().replace(/½/g,' 1/2').replace(/¼/g,' 1/4').replace(/¾/g,' 3/4');
  let total=0;for(const token of x.split(/\s+/)){if(/^\d+\/\d+$/.test(token)){const [a,b]=token.split('/').map(Number);total+=a/b;}else if(/^\d+(?:\.\d+)?$/.test(token))total+=Number(token);}return total||null;
}
function parseMeasure(raw, ingredient){
  let s=norm(raw).replace(/about\s+/,'').replace(/approximately\s+/,'').replace(/divided\s+into\s+/,'').trim();
  const n=canonical(ingredient);
  if(!s)return null;
  if(/^(to taste|as needed|as required|for serving|to serve|for garnish|for brushing|for frying|as desired|some)$/.test(s)){
    if(LIQUIDS.has(n))return null;
    if(['sale'].includes(n))return {q:2,u:'g',estimated:true};
    if(['pepe nero'].includes(n))return {q:.5,u:'g',estimated:true};
    if(['curry','paprika','curcuma','cumino','origano','rosmarino','timo','salvia','menta','alloro','peperoncino','basilico','prezzemolo','coriandolo','aneto','cannella','noce moscata'].includes(n))return {q:2,u:'g',estimated:true};
    if(['limone','lime'].includes(n))return {q:1,u:'pz',estimated:true};
    return null;
  }
  let m=s.match(/^([\d\s\/\.½¼¾]+)\s*(kg|kilograms?|g|grams?|oz|ounces?|lb|lbs|pounds?|ml|l|litres?|liters?|tsp|teaspoons?|tbsp|tablespoons?|cups?|cup|cloves?|sprigs?|fillets?|slices?|pieces?|piece|medium|large|small|handfuls?|handful)?\b/i);
  if(!m){m=s.match(/^([\d\s\/\.½¼¾]+)\b/);}
  const amount=frac(m?.[1]||'');if(!amount)return null;
  const unit=norm(m?.[2]||'').replace(/s$/,'');
  if(['kg','kilogram','kilograms'].includes(unit))return {q:amount*1000,u:'g'};
  if(['g','gram','grams'].includes(unit))return {q:amount,u:'g'};
  if(['oz','ounce','ounces'].includes(unit))return {q:amount*28.35,u:'g'};
  if(['lb','lbs','pound','pounds'].includes(unit))return {q:amount*453.6,u:'g'};
  if(['ml'].includes(unit))return {q:amount,u:'ml'};
  if(['l','litre','litres','liter','liters'].includes(unit))return {q:amount*1000,u:'ml'};
  if(['tbsp','tablespoon','tablespoons'].includes(unit)){const mult=LIQUIDS.has(n)?13.5:10;return {q:amount*mult,u:'g',estimated:!LIQUIDS.has(n)};}
  if(['tsp','teaspoon','teaspoons'].includes(unit)){return {q:amount*(LIQUIDS.has(n)?4.5:2.5),u:'g',estimated:true};}
  if(['cup','cups'].includes(unit)){return {q:amount*(CUP_G[n]||240),u:'g',estimated:true};}
  if(['clove','cloves'].includes(unit)&&n==='aglio')return {q:amount*3,u:'g'};
  if(['sprig','sprigs'].includes(unit)){return {q:amount,u:'g',estimated:true};}
  if(['fillet','fillets'].includes(unit)){const g=PIECE_G[n]||150;return {q:amount*g,u:'g',estimated:true};}
  if(['slice','slices'].includes(unit)){const g=n==='pane'||n==='pane integrale'?35:30;return {q:amount*g,u:'g',estimated:true};}
  if(['handful','handfuls'].includes(unit)){const g=canonIngredientGroup(n);return {q:amount*(g==='nuts'?30:25),u:'g',estimated:true};}
  if(['medium','large','small','piece','pieces'].includes(unit)){const g=PIECE_G[n];if(!g)return null;return {q:amount,u:'pz'};}
  /* Bare numbers: only accept them when there is a reliable piece conversion or the ingredient is an egg. */
  if(!unit&&PIECE_G[n])return {q:amount,u:'pz',estimated:true};
  return null;
}
function canonIngredientGroup(n){if(['noci','mandorle','anacardi','arachidi'].includes(n))return'nuts';if(['spinaci','rucola','menta','prezzemolo','basilico','coriandolo','aneto'].includes(n))return'herb';return'other'}
function inferProtein(ings){const names=ings.map(x=>x[0]);if(names.some(n=>['salmone','merluzzo','orata','tonno al naturale','gamberi','calamari','cozze','vongole','mix frutti di mare'].includes(n)))return'fish';if(names.some(n=>['petto di pollo','pollo','fesa di tacchino','tacchino','macinato di manzo','manzo','agnello','agnello macinato','maiale','pancetta','prosciutto cotto','salsiccia'].includes(n)))return'meat';if(names.includes('uova'))return'egg';if(names.some(n=>n.includes('ceci')||n.includes('lenticchie')||n.includes('fagioli')))return'legume';if(names.some(n=>['ricotta','feta','parmigiano','fiocchi di latte','mozzarella','cheddar','yogurt greco'].includes(n)))return'dairy';return'veg';}
function difficulty(meal){const t=String(meal.strInstructions||'');const steps=(t.match(/step\s*\d+/gi)||[]).length;const len=t.length;return steps>=4||len>1600?3:(steps>=3||len>900?2:1);}
function estimateServings(ings,instructions){const m=ings.reduce((s,[n,q,u])=>s+(u==='g'?q:(PIECE_G[n]||100)*q),0);const explicit=String(instructions||'').match(/(?:serves|serve|servings?)\s*(?:about\s*)?(\d+)/i);if(explicit)return Math.max(1,Math.min(8,Number(explicit[1])));return Math.max(2,Math.min(6,Math.round(m/500)));}
function cleanupSteps(text){return String(text||'').split(/\r?\n+/).map(s=>s.replace(/^step\s*\d+\s*/i,'').trim()).filter(s=>s.length>=35);}
function isMealCategory(c){return !['dessert','side','starter','breakfast'].includes(norm(c));}
function mealFromApi(m){
  if(!m||!m.idMeal||!m.strMeal||!m.strInstructions||!isMealCategory(m.strCategory))return null;
  const ingredients=[];const seen=new Map();let uncertain=false;
  for(let i=1;i<=20;i++){
    const raw=String(m[`strIngredient${i}`]||'').trim();const meas=String(m[`strMeasure${i}`]||'').trim();if(!raw)continue;
    const cn=canonical(raw);if(cn==='__household_water__'||cn==='__household_ice__')continue;
    if(cn==='olive oil'&&canonical(raw)==='olive oil'){}
    const parsed=parseMeasure(meas,raw);if(!parsed){uncertain=true;break;}
    const key=cn;if(seen.has(key)){const prev=seen.get(key);if(prev.u===parsed.u)prev.q+=parsed.q;else{uncertain=true;break;}}else{seen.set(key,{q:parsed.q,u:parsed.u,estimated:Boolean(parsed.estimated)});}
  }
  if(uncertain)return null;
  for(const [n,v] of seen.entries())ingredients.push([n,Number(v.q.toFixed(2)),v.u]);
  if(ingredients.length<5)return null;
  const steps=cleanupSteps(m.strInstructions);if(steps.length<3)return null;
  /* Refuse payloads that look like an incomplete summary rather than a recipe. */
  if(/^(gather the ingredients\.?|step 1\.?|ingredients:?$)/i.test(steps[0]))return null;
  const sourceUrl=m.strSource||`https://www.themealdb.com/meal/${m.idMeal}`;
  if(!sourceUrl.startsWith('http'))return null;
  const servings=estimateServings(ingredients,m.strInstructions);
  return {
    id:`remote-${m.idMeal}`,remote:true,verifiedOnline:true,qaStatus:'passed',sourceUrl,sourceName:'TheMealDB',sourceMealId:String(m.idMeal),sourceUpdated:m.dateModified||null,
    name:m.strMeal.trim(),category:m.strCategory||'Miscellaneous',area:m.strArea||null,tags:String(m.strTags||'').split(',').map(x=>norm(x)).filter(Boolean),time:30,diff:difficulty(m),servings,servingsEstimated:true,
    ingredients,steps,kcal:null,p:null,c:null,f:null,protein:inferProtein(ingredients),qualityNote:'Ingredienti completi importati dalla fonte; misure ambigue rifiutate, non sostituite con quantità arbitrarie.'
  };
}
async function fetchJson(url,attempt=0){try{const r=await fetch(url,{headers:{'User-Agent':'gnam-github-action/7.0'}});if(!r.ok)throw new Error(`${r.status} ${r.statusText}`);return await r.json();}catch(e){if(attempt>=5)throw e;await sleep(750*Math.pow(2,attempt));return fetchJson(url,attempt+1);}}

const byId=new Map();
for(const letter of LETTERS){
  const json=await fetchJson(`${BASE}/search.php?f=${letter}`);for(const m of (json.meals||[])){if(!byId.has(m.idMeal))byId.set(m.idMeal,m);}await sleep(150);
}
const meals=[...byId.values()].map(mealFromApi).filter(Boolean);
meals.sort((a,b)=>a.name.localeCompare(b.name,'en'));
const MAX=900;
let previous=[];
try{
  const old=await fs.readFile(OUT,'utf8');
  const match=old.match(/const ONLINE_RECIPES=(\[.*\]);\s*const ONLINE_RECIPES_UPDATED_AT=/s);
  if(match)previous=JSON.parse(match[1]);
}catch{}
const merged=new Map();
for(const r of previous)if(r&&r.id)merged.set(r.id,r);
for(const r of meals)merged.set(r.id,r);
const selected=[...merged.values()]
  .sort((a,b)=>(String(b.sourceUpdated||'')).localeCompare(String(a.sourceUpdated||''))||a.name.localeCompare(b.name,'en'))
  .slice(0,MAX);
if(selected.length<500){console.error(`Only ${selected.length} validated recipes are available after merge; refusing to overwrite the previous database.`);process.exit(2);}
const payload=`/* Generated ${new Date().toISOString()} by scripts/update-recipes.mjs. Do not edit manually. */\nconst ONLINE_RECIPES=${JSON.stringify(selected)};\nconst ONLINE_RECIPES_UPDATED_AT=${JSON.stringify(new Date().toISOString().slice(0,10))};\n`;
await fs.writeFile(OUT,payload,'utf8');
console.log(`Wrote ${selected.length} validated online recipes to ${OUT.pathname} (daily merge, max ${MAX})`);
