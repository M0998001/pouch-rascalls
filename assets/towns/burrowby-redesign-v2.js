// Pouch Rascalls — Burrowby Village, ground-up map redesign v2.
// Uses native 16px tiles and existing 20x28 character sprites; no save reset.
// Emergency fallback: ?classicBurrowby=1 (or legacy ?quietBurrowby=1).
(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  if (params.has('classicBurrowby') || params.has('quietBurrowby')) {
    const oldStart=startWorld;
    startWorld=async function(n){
      // Loading a save made inside a newly added building while opting out should
      // not strand the player on a map that the classic layout does not have.
      if(G && ['in_burrowby_workshop','in_burrowby_tearoom','in_burrowby_gardenhouse'].includes(G.map)){
        G.map='burrowby';G.x=12;G.y=18;G.dir='down';
      }
      if(G&&G.map==='burrowby'&&(G.x>=MAPS.burrowby.w||G.y>=MAPS.burrowby.h||BLOCK.has(tileAt(MAPS.burrowby,G.x,G.y)))){
        G.x=12;G.y=18;
      }
      return oldStart(n);
    };
    return;
  }
  const town = MAPS.burrowby;
  if (!town || town._landscapeV2) return;
  const oldDoors = {...town.doors};
  const oldTriggers = town.triggers.slice();
  const oldWarps = town.warps.slice();
  const ROWS = ["TTTTTTTTTTTT==TTTTTTTTTTTTTTTTTTTTTTTTTT","TTTT........==......................TTTT","TT..........==.........T.........T....TT","TTTT.....T..==..VVVVVV...RRRRR....T...TT","T..RRRRR..T.==..VVVVVV...RRRRR....rT...T","T..RRRRR....==..OHDHHO...OHDHO..r.r....T","T..OHDHO....==....=.....=..=...*..*....T","T....=......=======.....=..=...*.**....T","T....=========....=.=========.......T..T","T..**==**...==**S.=FgFFFFFFFFFFFFFT.*..T","T.*..==.*.**==....=F=.........*..F..*..T","T....==..==========F=....*.......F.T...T","T..PPPPP.=_________F=.......*..*.F...T.T","T..PPPPP===________F=...*........F.....T","TT.OHDHO.=_________FFFFFFFFFFFFFFF.T...T","TT....=..=_________=======.........T..TT","T..*..=*.=________==PPPP.*.....*.....TTT","T.T...=..=__==_____=PPPP...............T","T.TQQQQQQ===========OHDH........*.T.r..T","T..QQQQQQS..==.........=.........VVVV..T","T..OHHDHO...==......*..=.*.......VVVVT.T","T.....========.........=.......**HDHOT.T","T...........==.RRRRRR.*=..=...r...=.S..T","T..**....TT.==.RRRRRR..=*.=========....T","TT.WWWWWW...==.OHDHHO.....=.......=*..TT","T.WWWWBWWW..============S.=.......=,,,.T","T.WWWWBWWW..==............=....T...,,T.T","T.WWWWBWWW..=..**.**=============.T,,,.T","T..WWW=======..**T***............T.....T","T.T......T...*....T.........T.....T.TT.T","T..T.....rT......*...........T........TT","TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"];
  if(ROWS.length!==32 || ROWS.some(r=>r.length!==40))throw Error('Burrowby redesign map dimensions mismatch');

  town.rows=ROWS.slice();
  town.w=40;town.h=32;town.music='town';
  town._landscapeV2=1;
  // Existing scripted doors/quests are kept; only the entrance coordinates move.
  // These keys belong to the EXPANDED Burrowby map (the village expansion already migrated saves).
  const routeDoor=(oldKey,newKey,label)=>{
    const fn=oldDoors[oldKey];
    if(typeof fn!=='function') console.warn('Burrowby: preserving missing door fallback:',label,oldKey);
    if(fn) town.doors[newKey]=fn;
  };
  town.doors={};
  routeDoor('3,4','5,6','Grandma Juniper');
  routeDoor('21,4','18,5','Professor Hazel');
  routeDoor('4,11','6,20','Village Shop');
  routeDoor('22,18','22,18','Player home');
  routeDoor('27,5','27,5','Ranch barn');
  // Retain any extra door handlers contributed by future gameplay extensions.
  const mapped = new Set(['3,4','21,4','4,11','22,18','27,5']);
  for(const [key,fn] of Object.entries(oldDoors)){
    if(mapped.has(key))continue;
    if(!town.doors[key] && typeof fn==='function' && town.rows[+key.split(',')[1]]?.[+key.split(',')[0]]==='D') town.doors[key]=fn;
    else console.warn('Burrowby additional door needs placement:',key);
  }
  // Original ranch gate, full ranch systems, crop garden and all storage Rascals remain untouched.
  town.gates={'20,9':town.gates['20,9']||(async api=>api.ranch())};
  town.warps=oldWarps.map((w,i)=>w.to==='clover'?{...w,x:12+i%2,y:0}:w);
  const labGuard=oldTriggers.find(t=>typeof t.run==='function' && t.when);
  town.triggers=labGuard?[{...labGuard,x:12,y:1,w:2,h:1}]:[];
  // Connect Clover Path's existing rebuilt route to the new gate, without rewriting Clover itself.
  const clover=MAPS.clover;
  if(clover)for(const w of clover.warps||[])if(w.to==='burrowby'){
    w.tx=w.x===Math.min(...clover.warps.filter(q=>q.to==='burrowby').map(q=>q.x))?12:13;
    w.ty=1;w.dir='down';
  }
  if(typeof TOWNS!=='undefined')TOWNS.burrowby=[12,18];
  const oldSigns={...town.signs};
  town.signs={
    '16,9':'BURROWBY VILLAGE\nGrandma Juniper & the laboratory: north\nVillage Square: south\nRanch, barn & gardens: east',
    '9,19':'BURROWBY GENERAL STORE\nFresh Pouches, berries and supplies.',
    '24,25':'BURROWBY COMMUNITY GARDEN\nGrow together, wander together.',
    '36,22':'BURROWBY GARDEN HOUSE\nFlowers, seeds, and gardeners welcome.',
    '24,18':oldSigns['24,18']||'YOUR COTTAGE\nA home to make your own.'
  };
  const bwNpc=id=>town.npcs.find(n=>n.id===id);
  const place=(id,x,y)=>{const n=bwNpc(id);if(n){n.x=x;n.y=y;}};
  place('kid1',9,18);place('girl1',11,21);place('old1',18,19);place('mailbox',3,8);
  // Other legacy town NPCs keep their interactive state, but are shifted to accessible
  // ground if the new road layout happens to have a building at the old location.
  const isWalk=(x,y)=>x>0&&y>0&&x<town.w-1&&y<town.h-1&&!BLOCK.has(tileAt(town,x,y));
  const anchors=[[8,18],[11,19],[16,19],[8,16],[22,23],[34,16],[7,9],[24,8],[12,25]];
  const permanent=new Set(['kid1','girl1','old1','mailbox']);
  for(const n of town.npcs){
    if(permanent.has(n.id)||n.drawFn||n.mon||n.item)continue;
    if(isWalk(n.x,n.y))continue;
    const option=anchors.find(([x,y])=>isWalk(x,y)&&!town.npcs.some(q=>q!==n&&q.x===x&&q.y===y));
    if(option){n.x=option[0];n.y=option[1];}
  }
  // Remap existing/new saves ONLY ONCE. The previous expansion's coordinates are
  // not reused, so previous saves inside town arrive at the new central plaza.
  const migrate0=migrate;
  migrate=function(g){g=migrate0(g);if(!g.burrowbyLandscapeV2){
    g.burrowbyLandscapeV2=1;
    if(g.map==='burrowby'){g.x=12;g.y=18;g.dir='down';}
    if(g.respawn&&g.respawn.map==='burrowby'){g.respawn.x=5;g.respawn.y=7;}
  }return g;};
  // The original new-game flow and Grandma's existing heal event still refer to
  // the old spawn (3,5). Resolve these to the path outside her relocated cottage.
  const oldChangeMap=changeMap;
  changeMap=function(id,x,y,...rest){
    if(id==='burrowby'&&x===3&&y===5){x=5;y=7;}
    return oldChangeMap(id,x,y,...rest);
  };
  const oldRespawn=api.setRespawn;
  api.setRespawn=(id,x,y)=>id==='burrowby'&&x===3&&y===5?oldRespawn(id,5,7):oldRespawn(id,x,y);
  // For new games created after this upgrade, initialization calls newState() and
  // not migrate() before entering the game; remap the legacy start there as well.
  const start0=startWorld;
  startWorld=async function(n){
    if(G && G.map==='burrowby' && G.x===3 && G.y===5){G.x=5;G.y=7;}
    if(G && G.map==='burrowby' && (G.x<1||G.y<1||G.x>=town.w-1||G.y>=town.h-1||BLOCK.has(tileAt(town,G.x,G.y)))){G.x=12;G.y=18;}
    return start0(n);
  };
  // Player home and barn always return to their original fixed addresses, which
  // remain completely functional at 22,18 and 27,5 in the new map.
  // Do not change HOME_DOOR, any ranch crop patches, or the grazing pasture.
  const PX='bw2_';
  const key=(x,y)=>x+','+y;
  const hour=()=>SND.cfg.realClock?new Date().getHours()+new Date().getMinutes()/60:G?.clock?G.clock.t/60:12;
  const phase=()=>{const h=hour();return h<6||h>=20?'night':h<11?'morning':h<17?'day':'evening';};
  const open=()=>hour()>=7 && hour()<18.5;
  const seasonCol=()=>G&&G.clock&&typeof season==='function'&&SND.cfg.seasons!==false?({spring:'#f5a1c7',summer:'#f2cf61',autumn:'#df965b',winter:'#94d6ed'}[season().k]||'#f5a1c7'):'#f5a1c7';
  const rect=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w,h);};
  // All village decorations use 16px tile-native pixel drawings and work in 2D and 2.5D.
  const decor=(id,name,x,y,drawFn,talk,show)=>{
    if(!isWalk(x,y) || town.npcs.some(n=>n.x===x&&n.y===y))return null;
    const n={id:PX+id,name,x,y,dir:'down',noRep:1,deco:1,drawFn,talk};
    if(show)n.show=show;town.npcs.push(n);return n;
  };
  const lamp=(c,x,y,t)=>{
    const lit=phase()==='night'||phase()==='evening';
    rect(c,x+7,y-11,2,26,'#6a4a36');rect(c,x+4,y-13,8,3,'#554139');
    rect(c,x+4,y-10,8,8,'#3d3540');rect(c,x+5,y-9,6,6,lit?'#ffe39c':'#bdc5bf');
    rect(c,x+6,y-8,4,4,lit?'#fff0b6':'#e0ddd1');rect(c,x+3,y-2,10,2,'#76543f');
    if(lit){c.fillStyle='rgba(255,215,125,'+(.09+Math.sin(t/500)*.035)+')';c.fillRect(x-5,y-13,26,25);}
  };
  const flowerbed=(c,x,y,t)=>{
    rect(c,x+1,y+9,14,5,'#8d6545');rect(c,x+2,y+9,12,1,'#cf9d6e');
    for(let i=0;i<3;i++){const fx=x+3+i*4+((t/900+i)|0)%2;rect(c,fx,y+5,1,5,'#468e4f');
      rect(c,fx-1,y+3,3,3,[seasonCol(),'#ffdc8c','#fff6d8'][i]);rect(c,fx,y+4,1,1,'#e9af48');}
  };
  const stall=(kind)=>(c,x,y,t)=>{
    const active=open(),s=kind==='flowers'?seasonCol():'#e9c179';
    rect(c,x+2,y+4,12,10,'#674330');rect(c,x+3,y+5,10,8,'#ad744a');
    rect(c,x+2,y-8,12,4,active?s:'#a69b8e');
    for(let i=0;i<3;i++)rect(c,x+2+i*4,y-7,3,2,active?'#fff5d8':'#8d8075');
    rect(c,x+1,y-4,14,2,'#6a473a');rect(c,x+2,y-2,2,8,'#70503e');rect(c,x+12,y-2,2,8,'#70503e');
    if(active)for(let i=0;i<3;i++){
      if(kind==='flowers'){rect(c,x+3+i*4,y+4,1,5,'#4c924b');rect(c,x+2+i*4,y+2+(Math.sin(t/650+i)>0?0:1),3,3,[seasonCol(),'#ffe7ac','#ffffff'][i]);}
      else{rect(c,x+3+i*3,y+5,3,3,['#e86955','#f2c457','#80b65e'][i]);rect(c,x+4+i*3,y+4,1,1,'#539947');}
    }else rect(c,x+3,y+3,10,5,'#9b8979');
  };
  // The fountain is four adjacent 16px elements forming a real 32x32 landmark.
  // Each element is independently depth-sorted in 2D and visible in 2.5D.
  function fountainPiece(qx,qy){return(c,x,y,t)=>{
    const ax=x-16*qx,ay=y-16*qy;
    c.save();c.beginPath();c.rect(x,y,16,16);c.clip();
    rect(c,ax+2,ay+4,28,25,'#665b59');rect(c,ax+3,ay+3,26,25,'#b6aaa1');
    rect(c,ax+5,ay+5,22,19,'#75b6d3');rect(c,ax+7,ay+7,18,15,'#489cc6');
    rect(c,ax+12,ay+10,8,11,'#b8b5ad');rect(c,ax+14,ay+5,4,7,'#e6dfce');
    rect(c,ax+15,ay+3,2,3,'#ffffff');
    const splash=Math.floor(t/350)%4;
    rect(c,ax+10+splash,ay+8,2,2,'#d5f1fd');rect(c,ax+21-splash,ay+16,3,1,'#b8e8ff');
    rect(c,ax+4,ay+26,24,2,'#8c817a');c.restore();
  };}
  for(let yy=0;yy<2;yy++)for(let xx=0;xx<2;xx++){
    decor('fountain_'+xx+'_'+yy,'Juniper Fountain',14+xx,14+yy,fountainPiece(xx,yy),async()=>say('Water splashes around the village fountain. The stonework was built by generations of Burrowby gardeners.'));
  }
  decor('berry_cart','Farmers Market Cart',10,11,stall('berries'),async()=>say(open()?'Fresh berries, cider, and honey are stacked for the morning market.':'Canvas covers protect the market goods until morning.'));
  decor('flower_cart','Florist Stall',18,11,stall('flowers'),async()=>say(open()?'A cheerful display of seasonal flowers, grown right here in Burrowby.':'The flower merchant has packed away the bouquets.'));
  for(const [id,x,y] of [['lane_n',9,10],['lane_e',19,17],['lane_s',9,22],['barn_lamp',31,7]])decor(id,'Village Lantern',x,y,lamp,async()=>say('Every evening, the village lamplighter lights the lanes so everybody can find their way home.'));
  for(const [id,x,y] of [['front_garden',8,17],['pond_bloom',10,26],['orchard_bloom',21,26],['lab_herbs',22,7]])decor(id,'Village Flowerbed',x,y,flowerbed,async()=>say('Freshly tended flowers and herbs. Even the local Rascals stop to smell them.'));
  const board=(c,x,y)=>{rect(c,x+7,y+6,2,9,'#72543c');rect(c,x+1,y-4,14,11,'#69452f');rect(c,x+2,y-3,12,9,'#d3a671');rect(c,x+3,y-2,10,6,'#f4dcab');rect(c,x+5,y,6,1,'#af845d');rect(c,x+5,y+2,5,1,'#af845d');rect(c,x+12,y-2,1,1,'#df6f67');};
  decor('notice','Town Noticeboard',8,15,board,async()=>{
    const what=open()?'OPEN':'CLOSED';await say('BURROWBY VILLAGE\nWelcome to Juniper Square!\nMarket: 7:00 AM–6:30 PM ('+what+')\nNorth: Grandma & Hazel’s lab\nEast: Ranch & Barn\nSouth: Tea Room & Community Gardens');
    if(G.player.badges.length)await say('A handmade banner celebrates your growing collection of Warden Badges. Your neighbors are proud!');
  });
  // The two new building exteriors contain actual interior maps, not placeholder door text.
  const rooms=[
    {id:'in_burrowby_workshop',title:'Burrowby Craft & Post Hall',door:[5,14],outside:[5,15],roof:'P',host:'Keeper Rill',look:LOOKS.old,desc:'Woodcraft, village letters and tools. A cozy place for the community to work.',
      talk:async()=>{await say('Keeper Rill: Every family has mended something at this bench. A little patience can fix almost anything.');
        if(G.player.badges.length>=1)await say('Rill: Grandpa Thistle teaches crafting at the ranch. Start there if you want to make your own gear.');}},
    {id:'in_burrowby_gardenhouse',title:'Burrowby Garden House',door:[34,21],outside:[34,22],roof:'V',host:'Herbalist Yarrow',look:LOOKS.ranger,desc:'Seed packets, flowers, and jars of dried mountain herbs.',
      talk:async()=>{await say('Herbalist Yarrow: A healthy village begins with healthy soil. Even Rascals like to help carry the watering cans.');
        if(G.player.badges.length>=1)await say('Yarrow: Ask Grandpa Thistle about growing berries. The fields reward a little patience.');}},
    {id:'in_burrowby_tearoom',title:'Burrowby Tea Room',door:[17,24],outside:[17,25],roof:'R',host:'Auntie Maple',look:LOOKS.baker,desc:'Warm berry pastries, fresh tea and stories from the village.',
      talk:async()=>{await say('Auntie Maple: Make yourself comfortable! The kettle is always warm.');
        const c=await ask('Auntie Maple: Fresh berry tea and biscuits?', ['Tea and a rest — 40 coins','Just chatting']);
        if(c===0){if(G.player.money<40){await say('Maple: No hurry, dear. Come back when you like.');return;}
          G.player.money-=40;healParty();SND.sfx('item');await say('The tea is lovely. Your Rascals are fully rested!');saveQuiet();}
      }}
  ];
  rooms.forEach(room=>{
    MAPS[room.id]={name:room.title,music:'town',indoor:true,bg:'indoor',parentId:'burrowby',
      rows:['ZZzZZfZZzZZ','kwwwwwwwwbb','wwwwwwwwwbb','wwwnnwwwwww','wwwnnwwwwwp','wwwwwwuwwww','wwwwwwuwwww','ZZZZZxZZZZZ'],
      warps:[{x:5,y:7,to:'burrowby',tx:room.outside[0],ty:room.outside[1],dir:'down'}],arrive:[5,6],
      npcs:[{id:room.id+'_host',x:7,y:3,dir:'down',look:room.look,name:room.host,talk:room.talk}]};
    normMap(room.id);
    town.doors[key(...room.door)]=async()=>{SND.sfx('door');await changeMap(room.id,5,6,'up');};
  });
  // Friendly residents support small repeatable commerce, without changing game economy or quests.
  const dayData=()=>G.burrowbyLife||(G.burrowbyLife={});
  const person=(id,name,look,x,y,talk,show)=>{
    if(!isWalk(x,y))return null;
    const n={id:PX+id,name,x,y,dir:'down',look,noRep:1,talk};if(show)n.show=show;town.npcs.push(n);return n;
  };
  person('marnie','Marnie the Gardener',LOOKS.girl,9,12,async()=>{
    if(!G.flags.gotStarter){await say('Marnie: Our village flowers love the morning sunshine!');return;}
    const rec=dayData();if(rec.flowerDay===G.clock.day){await say('Marnie: Another bunch will be ready tomorrow!');return;}
    const c=await ask('Marnie: Fresh from our gardens! Two Sweet Berries for 80 coins?', ['Buy berries','Not today']);if(c!==0)return;
    if(G.player.money<80){await say('Marnie: They will be here when you need them.');return;}
    G.player.money-=80;G.bag.sweetberry=(G.bag.sweetberry||0)+2;rec.flowerDay=G.clock.day;
    SND.sfx('item');await say('Marnie: Enjoy! These are especially good for your Rascal friends.');saveQuiet();
  },open);
  person('bram','Bram the Delivery Baker',LOOKS.baker,18,12,async()=>{
    if(!G.flags.gotStarter){await say('Bram: Early deliveries keep our village fed!');return;}
    const rec=dayData();if(rec.deliveryDay===G.clock.day){await say('Bram: Thanks again for today’s delivery. See you tomorrow!');return;}
    if((G.bag.berry||0)<1){await say('Bram: Grandma needs one Berry for her cocoa biscuits. Bring me a Berry when you can!');return;}
    if(await ask('Bram: Have a Berry to spare for Grandma? I can pay 120 coins.', ['Help with delivery','Keep the Berry'])!==0)return;
    G.bag.berry--;G.player.money+=120;rec.deliveryDay=G.clock.day;
    SND.sfx('item');await say('Bram: Wonderful! This will make Grandma’s day. (Received 120 coins.)');saveQuiet();
  },open);
  person('gardener','Groundskeeper Sage',LOOKS.ranger,24,23,async()=>{
    await say('Sage: The new garden paths are planted with perennials so every season brings a different color.');
    if(G.flags.badge1)await say('Sage: Marnie said the whole village raised a toast when you earned your first badge!');
  });
  // Preserve original story NPC dialogues but add optional, time-dependent remarks.
  const routes={kid1:{morning:[9,17],day:[11,19],evening:[8,18],night:[5,9]},girl1:{morning:[10,21],day:[10,18],evening:[12,24],night:[11,21]},old1:{morning:[18,19],day:[17,18],evening:[18,20],night:[18,19]},[PX+'gardener']:{morning:[25,23],day:[24,23],evening:[23,24],night:[24,23]}};
  const chatter={
    kid1:{morning:'Tobin: I watched the market vendors set up before breakfast!',day:'Tobin: Did you see the fountain? I race Poppy around it!',evening:'Tobin: The lamps are coming on. I’d better head home!',night:'Tobin: I should be asleep, but the night sky is so pretty.'},
    girl1:{morning:'Poppy: There are freshly baked biscuits in the square!',day:'Poppy: We all helped plant the flowers around the pond.',evening:'Poppy: The tea room smells wonderful when the sun goes down.',night:'Poppy: The whole village feels peaceful at night.'},
    old1:{morning:'Old Rowan: Ah, the sound of birds and market stalls opening.',day:'Old Rowan: These winding lanes were once just muddy animal trails.',evening:'Old Rowan: See how the lanterns light each doorstep?',night:'Old Rowan: I remember when the village was half this size.'}
  };
  for(const [id,byTime] of Object.entries(chatter)){
    const n=bwNpc(id);if(!n||!n.talk)continue;
    const original=n.talk;n.talk=async api=>{const rec=dayData();rec.talk=rec.talk||{};
      const token=G.clock.day+':'+phase();if(rec.talk[id]!==token){rec.talk[id]=token;await say(byTime[phase()]);}
      return original(api);};
  }
  // One resident takes one safe BFS walking step roughly every two seconds.
  // Skip active scripted interactions, offscreen towns and occupied paths.
  const reserved=new Set(town.npcs.filter(n=>n.drawFn).map(n=>key(n.x,n.y)));
  const dirs=[[0,1],[1,0],[-1,0],[0,-1]];
  const keepClear=(x,y,id)=>{
    if(!isWalk(x,y)||reserved.has(key(x,y)))return false;
    if(town.warps.some(w=>w.x===x&&w.y===y)||town.triggers.some(t=>x>=t.x&&x<t.x+t.w&&y>=t.y&&y<t.y+(t.h||1)))return false;
    if(town.gates[key(x,y)]||town.doors[key(x,y)]||town.signs[key(x,y)])return false;
    if(Object.keys(town.doors).some(k=>{const [dx,dy]=k.split(',').map(Number);return dx===x&&dy+1===y;}))return false;
    if(G.x===x&&G.y===y)return false;
    return !visibleNpcs().some(n=>n.id!==id&&((npcPos(n).x===x&&npcPos(n).y===y)||(npcPos(n).fx===x&&npcPos(n).fy===y)));
  };
  const nextStep=(n,dest)=>{
    const from=npcPos(n),start=key(from.x,from.y),end=key(...dest);
    if(start===end||!keepClear(...dest,n.id))return null;
    const q=[[from.x,from.y]],seen=new Map([[start,null]]);
    for(let i=0;i<q.length&&i<town.w*town.h;i++){
      const [x,y]=q[i],k=key(x,y);if(k===end)break;
      for(const [dx,dy] of dirs){const xx=x+dx,yy=y+dy,kk=key(xx,yy);
        if(seen.has(kk)||!keepClear(xx,yy,n.id))continue;
        seen.set(kk,k);q.push([xx,yy]);}
    }
    if(!seen.has(end))return null;
    let p=end;while(seen.get(p)&&seen.get(p)!==start)p=seen.get(p);
    const [x,y]=p.split(',').map(Number);return [x-from.x,y-from.y];
  };
  let last=0,ix=0;
  const inMotion=new Set();
  setInterval(()=>{
    if(!G||G.map!=='burrowby'||mode!=='world'||busy||P.moving||UI.active()||Dialog.active)return;
    const t=performance.now();if(t-last<1600)return;last=t;
    const ids=Object.keys(routes),id=ids[ix++%ids.length];
    const n=bwNpc(id),target=routes[id]?.[phase()];
    if(!n||!target||inMotion.has(id)||npcPos(n).fx!==undefined)return;
    const p=npcPos(n);if(Math.abs(p.x-G.x)+Math.abs(p.y-G.y)<2)return;
    const d=nextStep(n,target);if(!d)return;
    const [dx,dy]=d;const direction=dx>0?'right':dx<0?'left':dy>0?'down':'up';
    npcState[id]={...p,dir:direction};inMotion.add(id);
    animNpcStep(n,dx,dy).catch(e=>console.warn('Burrowby resident movement:',e)).finally(()=>inMotion.delete(id));
  },550);
  // Avoid touching story flags, the player's inventory or any Rascal species.
  // Rebuild 2D and 3D tiles when the new map is installed.
  delete GFX.burrowby;
  if(typeof R3!=='undefined'&&R3.maps)delete R3.maps.burrowby;
  console.info('Burrowby Village v2: 40×32 redesigned streets, 8 active buildings, central fountain, tea room and gardens.');
})();