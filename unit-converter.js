/* Gnam culinary unit conversion layer.
   Converts common recipe measures into comparable quantities without inventing
   arbitrary 1 g values. Unknown package/ambiguous measures stay unmapped. */
(function(){
  const norm = s => String(s||'').toLowerCase().normalize('NFKC').replace(/[’]/g,"'").replace(/[-_/]+/g,' ').replace(/\s+/g,' ').trim();
  const units = {
    gram:'g', grams:'g', gr:'g', g:'g', kilogram:'kg', kilograms:'kg', kilo:'kg', kg:'kg',
    milliliter:'ml', milliliters:'ml', millilitre:'ml', millilitres:'ml', ml:'ml',
    liter:'l', liters:'l', litre:'l', litres:'l', l:'l',
    piece:'pz', pieces:'pz', pc:'pz', pcs:'pz', pz:'pz', each:'pz',
    clove:'clove', cloves:'clove', spicchio:'clove', spicchi:'clove',
    stalk:'stalk', stalks:'stalk', gambo:'stalk', gambi:'stalk',
    sprig:'sprig', sprigs:'sprig', rametto:'sprig', rametti:'sprig',
    slice:'slice', slices:'slice', fetta:'slice', fette:'slice',
    fillet:'fillet', fillets:'fillet', filetto:'fillet', filetti:'fillet',
    bunch:'bunch', bunches:'bunch', mazzo:'bunch', mazzetto:'bunch',
    handful:'handful', handfuls:'handful', manciata:'handful',
    cup:'cup', cups:'cup', tazza:'cup', tazze:'cup',
    tablespoon:'tbsp', tablespoons:'tbsp', tbsp:'tbsp', cucchiaio:'tbsp', cucchiai:'tbsp',
    teaspoon:'tsp', teaspoons:'tsp', tsp:'tsp', cucchiaino:'tsp', cucchiaini:'tsp'
  };
  const pieceG = {
    'aglio':3,'cipolla':150,'cipolla rossa':150,'scalogno':40,'patata':180,'patata dolce':250,
    'carota':70,'zucchina':200,'peperone':160,'melanzana':280,'pomodoro':120,'pomodorino':18,
    'cetriolo':200,'limone':120,'arancia':180,'mela':180,'pera':170,'banana':120,'kiwi':80,
    'avocado':200,'uova':60,'uovo':60,'fesa di tacchino':120,'petto di pollo':180,'salmone':150,
    'merluzzo':160,'orata':180,'tonno al naturale':120,'pane integrale':35,'pane':35,
    'mozzarella':125,'feta':150,'ricotta':250,'yogurt greco':170,
    'broccolo':500,'cavolfiore':800,'lattuga':250,'spinaci':200,'bietola':300,
    'finocchio':250,'porro':150,'sedano':60,'zenzero':20
  };
  const measureG = {
    'aglio':{clove:3},'cipolla':{clove:1},'rosmarino':{sprig:2},'timo':{sprig:1},'salvia':{sprig:2},
    'prezzemolo':{sprig:3,bunch:30},'basilico':{sprig:2,bunch:25},'coriandolo':{sprig:3,bunch:30},
    'spinaci':{bunch:250},'rucola':{bunch:100},'lattuga':{bunch:250},
    'pane':{slice:35},'pane integrale':{slice:35},'prosciutto':{slice:20},'mozzarella':{slice:20},
    'salmone':{fillet:150},'merluzzo':{fillet:160},'orata':{fillet:180},'petto di pollo':{fillet:180},
    'burro':{tbsp:14},'olio evo':{tbsp:13,tsp:4.6},'olio extravergine':{tbsp:13,tsp:4.6},
    'latte':{cup:240,tbsp:15,tsp:5},'yogurt greco':{cup:240,tbsp:15,tsp:5},'panna':{cup:240,tbsp:15,tsp:5},
    'passata di pomodoro':{cup:250,tbsp:16,tsp:5},'salsa di pomodoro':{cup:250,tbsp:16,tsp:5},
    'acqua':{cup:240,tbsp:15,tsp:5},'brodo':{cup:240,tbsp:15,tsp:5},'succo di limone':{cup:240,tbsp:15,tsp:5},
    'aceto':{cup:240,tbsp:15,tsp:5},
    'sale':{tsp:6},'pepe':{tsp:2},'pepe nero':{tsp:2},'paprika':{tsp:2.3},'curcuma':{tsp:2.3},
    'curry':{tsp:2},'cumino':{tsp:2.1},'cannella':{tsp:2.6},'origano':{tsp:1},'basilico secco':{tsp:1},
    'timo secco':{tsp:1},'rosmarino secco':{tsp:1.2}
  };
  const densityGPerMl = {
    'olio evo':0.92,'olio extravergine':0.92,'olio':0.92,'burro':0.91,'latte':1.03,'yogurt greco':1.03,
    'panna':1.00,'passata di pomodoro':1.05,'salsa di pomodoro':1.05,'succo di limone':1.03,'aceto':1.01,
    'miele':1.42,'acqua':1.0,'brodo':1.0
  };
  function unitOf(u){
    const k=norm(u).replace(/\./g,'');
    return units[k]||null;
  }
  function ingredientKey(n){return norm(n);}
  function cupGrams(name){
    const n=ingredientKey(name);
    if(measureG[n]?.cup!=null)return measureG[n].cup;
    return null;
  }
  function toBase(name,q,u){
    const n=ingredientKey(name), v=Math.max(0,Number(q)||0), cu=unitOf(u);
    if(!cu)return null;
    if(cu==='g')return {dim:'g',value:v};
    if(cu==='kg')return {dim:'g',value:v*1000};
    if(cu==='ml'){
      const d=densityGPerMl[n]; return d?{dim:'g',value:v*d}:{dim:'ml',value:v};
    }
    if(cu==='l'){
      const ml=v*1000,d=densityGPerMl[n]; return d?{dim:'g',value:ml*d}:{dim:'ml',value:ml};
    }
    if(cu==='pz'){
      return pieceG[n]!=null?{dim:'g',value:v*pieceG[n]}:{dim:'count',value:v};
    }
    if(measureG[n]?.[cu]!=null)return {dim:'g',value:v*measureG[n][cu]};
    if(cu==='cup'){
      const g=cupGrams(n); if(g!=null)return {dim:'g',value:v*g};
      const d=densityGPerMl[n]; return d?{dim:'g',value:v*240*d}:{dim:'ml',value:v*240};
    }
    if(cu==='tbsp' || cu==='tsp'){
      const g=measureG[n]?.[cu]; if(g!=null)return {dim:'g',value:v*g};
      const ml=cu==='tbsp'?15:5,d=densityGPerMl[n]; return d?{dim:'g',value:v*ml*d}:{dim:'ml',value:v*ml};
    }
    return null;
  }
  function fromBase(name,baseValue,targetUnit){
    const n=ingredientKey(name), cu=unitOf(targetUnit); if(!cu)return null;
    const v=Number(baseValue)||0;
    if(cu==='g')return v;
    if(cu==='kg')return v/1000;
    if(cu==='ml'){
      const d=densityGPerMl[n]; if(!d)return v; return v/d;
    }
    if(cu==='l'){
      const d=densityGPerMl[n]; return d?v/(d*1000):v/1000;
    }
    if(cu==='pz'){
      if(pieceG[n]!=null)return v/pieceG[n];
      return null;
    }
    if(measureG[n]?.[cu]!=null)return v/measureG[n][cu];
    if(cu==='cup'){
      const g=cupGrams(n); if(g!=null)return v/g; const d=densityGPerMl[n]; return d?v/(240*d):v/240;
    }
    if(cu==='tbsp' || cu==='tsp'){
      const g=measureG[n]?.[cu]; if(g!=null)return v/g; const ml=cu==='tbsp'?15:5,d=densityGPerMl[n]; return d?v/(ml*d):v/ml;
    }
    return null;
  }
  function compare(name,q1,u1,q2,u2){
    const a=toBase(name,q1,u1),b=toBase(name,q2,u2); if(!a||!b||a.dim!==b.dim)return null; return {a,b};
  }
  window.GNAM_UNITS={norm,unitOf,toBase,fromBase,compare,pieceG,measureG,densityGPerMl};
})();
