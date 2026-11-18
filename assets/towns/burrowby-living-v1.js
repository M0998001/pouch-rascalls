// Pouch Rascalls — Burrowby Living Village, town pilot 01
// Native 16px world props; no map geometry, exits, doors, or collision rules are replaced.
// Emergency opt-out: ?quietBurrowby=1 (does not touch saves).
(() => {
  'use strict';
  if (new URLSearchParams(location.search).has('quietBurrowby')) return;
  const town = MAPS.burrowby;
  if (!town || town._livingVillageV1) return;
  town._livingVillageV1 = true;

  const prefix = 'bwlife_';
  const reserved = new Set();
  const spotKey = (x,y) => x + ',' + y;
  const townHour = () => {
    if (SND.cfg.realClock) { const d = new Date(); return d.getHours() + d.getMinutes()/60; }
    return G && G.clock ? G.clock.t / 60 : 12;
  };
  const marketOpen = () => { const h=townHour(); return h>=7 && h<18.5; };
  const period = () => {
    const h=townHour();
    return h<6 || h>=20.5 ? 'night' : h<11 ? 'morning' : h<16.5 ? 'day' : 'evening';
  };
  const seasonColor = () => {
    const colors={spring:'#f6a2cc',summer:'#f3cc55',autumn:'#e3a15e',winter:'#9ad8ed'};
    if (!G || !G.clock || SND.cfg.seasons===false || typeof season!=='function') return colors.spring;
    return colors[season().k] || colors.spring;
  };
  const safe = (x,y) => {
    if (!Number.isInteger(x) || !Number.isInteger(y) || x<1 || y<1 || x>=town.w-1 || y>=town.h-1) return false;
    if (BLOCK.has(tileAt(town,x,y)) || reserved.has(spotKey(x,y))) return false;
    if (town.warps.some(w => w.x===x && w.y===y)) return false;
    if (town.triggers.some(t => x>=t.x && x<t.x+t.w && y>=t.y && y<t.y+(t.h||1))) return false;
    if (town.gates[spotKey(x,y)] || town.doors[spotKey(x,y)] || town.signs[spotKey(x,y)]) return false;
    // Always leave the one-tile entry immediately outside each existing doorway unobstructed.
    if (Object.keys(town.doors).some(k => { const [dx,dy]=k.split(',').map(Number);return x===dx && y===dy+1; })) return false;
    if (town.npcs.some(n => n.x===x && n.y===y)) return false;
    return true;
  };
  const claim = (choices) => {
    for (const [x,y] of choices) if (safe(x,y)) { reserved.add(spotKey(x,y)); return [x,y]; }
    return null;
  };
  const prop = (id,name,candidates,drawFn,talk,show) => {
    const p=claim(candidates);if (!p) { console.warn('Burrowby prop location unavailable:',id);return null; }
    const n={id:prefix+id,x:p[0],y:p[1],dir:'down',name,noRep:1,deco:1,drawFn,talk};
    if (show) n.show=show;
    town.npcs.push(n);return n;
  };
  const pixel = (c,x,y,w,h,col) => { c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w,h); };

  // Two seasonal kiosks: closed canvas awnings remain at night; merchandise changes by season.
  const stall = (kind) => (c,sx,sy,now) => {
    const open=marketOpen(),cloth=kind==='flower'?seasonColor():'#e8c66a';
    const shadow='#49342e';
    pixel(c,sx+2,sy+11,12,3,'rgba(30,25,34,.16)');
    pixel(c,sx+2,sy+3,12,9,shadow);pixel(c,sx+3,sy+3,10,8,'#8c5a3c');
    pixel(c,sx+2,sy-7,12,3,open?cloth:'#b19f8d');
    pixel(c,sx+3,sy-6,3,3,open?'#fff5df':'#988777');
    pixel(c,sx+9,sy-6,3,3,open?'#fff5df':'#988777');
    pixel(c,sx+1,sy-4,14,2,'#694935');
    pixel(c,sx+2,sy-2,2,7,'#805538');pixel(c,sx+12,sy-2,2,7,'#805538');
    if (open) {
      for(let i=0;i<3;i++){
        const px=sx+3+i*3;
        if (kind==='flower') {
          const sway=Math.sin(now/600+i*2)>.55?1:0;
          pixel(c,px+1+sway,sy+2,1,5,'#498a40');
          pixel(c,px+sway,sy,3,3,[seasonColor(),'#fbe8a0','#fff8e2'][i]);
          pixel(c,px+1+sway,sy+1,1,1,'#f4b650');
        } else {
          pixel(c,px,sy+3,3,3,['#de6f48','#edbe4a','#a1c85f'][i]);
          pixel(c,px+1,sy+2,1,1,'#568a41');
          pixel(c,px,sy+7,3,2,'#ba8354');
        }
      }
    } else {
      pixel(c,sx+3,sy+3,10,5,'#9b8172');
      pixel(c,sx+4,sy+4,8,1,'#bb9f8c');
    }
  };
  const berryStall=prop('berry_stall','Village Produce Cart',[[7,8],[8,8],[6,8]],stall('berry'),async()=>{
    await say(marketOpen()?'The Burrowby produce cart is stacked with ripe berries and local honey.':'The produce cart is closed for the evening. Fresh stock arrives each morning.');
  });
  const flowerStall=prop('flower_stall','Seasonal Flower Cart',[[10,8],[11,8],[9,8]],stall('flower'),async()=>{
    await say(marketOpen()?'Pots of seasonal flowers sway in the village breeze.':'A canvas cover protects the flower cart until morning.');
  });

  // Market residents occupy separate spots in front of their stalls; closed shops are unmanned.
  function marketNpc(id,name,stallNpc,looks,dialogue) {
    if(!stallNpc)return;
    const x=stallNpc.x,y=stallNpc.y+1;
    const place=claim([[x,y],[x-1,y],[x+1,y]]);
    if(!place)return;
    town.npcs.push({id:prefix+id,x:place[0],y:place[1],dir:'down',name,noRep:1,
      look:looks,show:marketOpen,talk:dialogue});
  }
  const dayRecord = () => {
    if (!G.burrowbyLife || typeof G.burrowbyLife!=='object') G.burrowbyLife={};
    return G.burrowbyLife;
  };
  marketNpc('marnie','Marnie the Gardener',flowerStall,LOOKS.girl,async()=>{
    const s=typeof season==='function'?season().n:'spring';
    if (!G.flags.gotStarter) { await say(`Marnie: These ${s.toLowerCase()} flowers cheer up the whole square!`);return; }
    const rec=dayRecord();
    if(rec.flowerDay===G.clock.day){await say('Marnie: Your flowers should last a while! Come back tomorrow and I might have more.');return;}
    const c=await ask(`Marnie: It's ${s} and my seedlings are thriving! Would you like a little bundle of berries for your Rascals?`,['Buy 2 Sweet Berries — 80 coins','Maybe later']);
    if(c!==0)return;
    if(G.player.money<80){await say('Marnie: No rush. Come back when you have 80 coins.');return;}
    G.player.money-=80;G.bag.sweetberry=(G.bag.sweetberry||0)+2;rec.flowerDay=G.clock.day;
    SND.sfx('item');await say('Marnie: Fresh from the garden. Your rascals will love them! (Received 2 Sweet Berries.)');
    saveQuiet();
  });
  marketNpc('bram','Bram the Delivery Baker',berryStall,LOOKS.baker,async()=>{
    if(!G.flags.gotStarter){await say('Bram: Morning deliveries are what keep Burrowby well fed. You look like a future helper!');return;}
    const rec=dayRecord();
    if(rec.deliveryDay===G.clock.day){await say('Bram: Thanks for helping out today! The next delivery comes tomorrow morning.');return;}
    if((G.bag.berry||0)<1){await say('Bram: Grandma Juniper needs a fresh Berry for her cocoa biscuits. Bring me one from your bag and I can make the delivery.');return;}
    const choice=await ask('Bram: A Berry for Grandma Juniper! Could you spare one? I can pay you for the delivery.', ['Deliver 1 Berry','Keep it for now']);
    if(choice!==0)return;
    G.bag.berry--;G.player.money+=120;rec.deliveryDay=G.clock.day;
    SND.sfx('item');await say('Bram: Perfect! I will take it to Grandma. Here are 120 coins for helping our neighbors.');
    saveQuiet();
  });

  // A permanent noticeboard and gentle animated lamps/gardens that do not change tile collision geometry.
  const notice=(c,sx,sy)=>{
    pixel(c,sx+6,sy+4,4,11,'#715039');pixel(c,sx+2,sy-3,12,10,'#48362f');
    pixel(c,sx+3,sy-2,10,8,'#c79863');pixel(c,sx+4,sy-1,8,6,'#f1d5a4');
    pixel(c,sx+5,sy+1,4,1,'#ad7c53');pixel(c,sx+5,sy+3,6,1,'#ad7c53');
    pixel(c,sx+11,sy-1,1,1,'#d45b4f');pixel(c,sx+1,sy+14,14,1,'#604b35');
  };
  prop('notice','Burrowby Noticeboard',[[11,10],[9,11],[7,11]],notice,async()=>{
    const p=period(),hours=marketOpen()?'open now':'closed until morning';
    await say(`BURROWBY VILLAGE NOTICEBOARD\nThe garden and produce stalls are ${hours}. Market hours: 7:00 AM–6:30 PM.\nVillage life: ${p==='night'?'time for quiet homes and lanterns':p==='morning'?'early deliveries and fresh flowers':p==='day'?'visitors and neighbors in the square':'evening walks and closing shops'}.`);
    if(G.flags.badge1) await say('A hand-painted note reads: "Congratulations to our rising Tamer! Your next adventure awaits, but home will always welcome you."');
  });
  const garden=(c,sx,sy,now)=>{
    pixel(c,sx+1,sy+10,14,4,'#866045');pixel(c,sx+2,sy+10,12,1,'#bd895b');
    for(let i=0;i<3;i++){
      const x=sx+3+i*4,sway=Math.sin(now/750+i*1.7)>.75?1:0;
      pixel(c,x,sy+4,1,7,'#548a4b');pixel(c,x-1+sway,sy+6,3,2,'#78ae60');
      pixel(c,x-1+sway,sy+3,3,3,[seasonColor(),'#ffefad','#f6c1da'][i]);
      pixel(c,x+sway,sy+4,1,1,'#e1a847');
    }
  };
  prop('garden_near_pond','Village Flowerbed',[[14,16],[15,16],[13,16]],garden,async()=>{
    await say(`Fresh flowers from Marnie's garden. The townsfolk planted them together after the last ${typeof season==='function'?season().n:'spring'} festival.`);
  });
  const lantern=(c,sx,sy,now)=>{
    const lit=period()==='evening'||period()==='night';
    pixel(c,sx+7,sy-6,2,21,'#70533f');pixel(c,sx+3,sy-8,10,3,'#8d6848');
    pixel(c,sx+4,sy-5,8,7,lit?'#f7d580':'#c6ac88');
    pixel(c,sx+6,sy-3,4,4,lit?'#ffe7a4':'#b49c7e');
    pixel(c,sx+3,sy+2,10,2,'#6a503d');
    if(lit){c.fillStyle=`rgba(255,216,128,${.08+.05*Math.sin(now/400)})`;c.fillRect(sx-6,sy-12,28,24);}
  };
  prop('west_lantern','Village Lantern',[[5,15],[4,15],[3,15]],lantern,async()=>{
    await say('The village lamplighter makes sure this lantern glows every evening, even when it rains.');
  });
  prop('east_lantern','Ranchway Lantern',[[17,15],[16,15],[15,15]],lantern,async()=>{
    await say('A cozy lantern marks the path toward Grandpa Thistle’s ranch.');
  });

  // Named townsfolk choose a destination based on the existing in-game clock.
  // Movement is always along traversable tiles; no teleporting, overlapping people,
  // crossing blocked structures, or stepping into the player/doorway/warp tile.
  const ROUTES={
    kid1:{morning:[9,15],day:[12,16],evening:[6,15],night:[8,16]},
    girl1:{morning:[12,13],day:[16,15],evening:[12,16],night:[13,19]},
    old1:{morning:[22,8],day:[18,15],evening:[20,15],night:[22,16]}
  };
  const CHAT={
    kid1:{morning:'Tobin: I helped carry crates to the morning market!',day:'Tobin: Poppy and I have been looking for rascal tracks by the pond.',evening:'Tobin: Last one to the village square is a Snoozle!',night:'Tobin: Grandma says I need to head home before the lanterns go out.'},
    girl1:{morning:'Poppy: The flowers looked so pretty when the stalls opened.',day:'Poppy: Everyone stops to talk here at lunchtime. Even the Rascals get treats!',evening:'Poppy: The water looks pink as the sun goes down.',night:'Poppy: I should be home soon. Tomorrow is another big day at the ranch!'},
    old1:{morning:'Old Rowan: Ah, fresh bread and damp grass. Best time of day.',day:'Old Rowan: The square is busy, but a little chat never hurt anyone.',evening:'Old Rowan: I like watching the ranch creatures settle in.',night:'Old Rowan: My joints know when it is time for bed, young one.'}
  };
  for (const [id,lines] of Object.entries(CHAT)) {
    const n=town.npcs.find(q=>q.id===id);
    if(!n || !n.talk || n._livingTalk)continue;
    const original=n.talk;
    n._livingTalk=true;
    n.talk=async api=>{
      const rec=dayRecord();rec.chatter=rec.chatter||{};
      const key=G.clock.day+':'+period();
      if(rec.chatter[id]!==key){rec.chatter[id]=key;await say(lines[period()]);}
      await original(api);
    };
  }
  function canWalk(x,y,id) {
    // Moving residents may cross their original map-definition squares after leaving them.
    // Unlike prop placement, pathfinding checks live NPC positions, not stale n.x/n.y.
    if(x<1||y<1||x>=town.w-1||y>=town.h-1) return false;
    if(BLOCK.has(tileAt(town,x,y))||reserved.has(spotKey(x,y))) return false;
    if(town.warps.some(w=>w.x===x&&w.y===y) || town.triggers.some(t=>x>=t.x&&x<t.x+t.w&&y>=t.y&&y<t.y+(t.h||1)))return false;
    if(town.gates[spotKey(x,y)]||town.doors[spotKey(x,y)]||town.signs[spotKey(x,y)])return false;
    if(Object.keys(town.doors).some(k=>{const [dx,dy]=k.split(',').map(Number);return x===dx&&y===dy+1;}))return false;
    if(G.x===x&&G.y===y)return false;
    for(const n of visibleNpcs()){
      if(n.id===id)continue;
      const p=npcPos(n);
      if((p.x===x&&p.y===y) || (p.fx===x&&p.fy===y))return false;
    }
    return true;
  }
  function nextStep(n,target) {
    const from=npcPos(n),sx=from.x,sy=from.y;
    if(sx===target[0]&&sy===target[1])return null;
    if(!canWalk(target[0],target[1],n.id))return null;
    const start=spotKey(sx,sy),goal=spotKey(...target);
    const q=[[sx,sy]],came=new Map([[start,null]]);
    let end=null;
    for(let k=0;k<q.length&&k<town.w*town.h;k++){
      const [x,y]=q[k];if(spotKey(x,y)===goal){end=goal;break;}
      for(const [dx,dy] of [[0,1],[1,0],[-1,0],[0,-1]]){
        const xx=x+dx,yy=y+dy,key=spotKey(xx,yy);
        if(came.has(key)||!canWalk(xx,yy,n.id))continue;
        came.set(key,spotKey(x,y));q.push([xx,yy]);
      }
    }
    if(!end)return null;
    let step=end,prev=came.get(step);
    while(prev&&prev!==start){step=prev;prev=came.get(step);}
    const [nx,ny]=step.split(',').map(Number);
    return [nx-sx,ny-sy];
  }
  const moving=new Set();
  let nextTick=0;
  function routineTick() {
    if(!G||G.map!=='burrowby'||mode!=='world'||busy||P.moving||UI.active()||Dialog.active)return;
    const t=performance.now();if(t<nextTick)return;nextTick=t+2700;
    for(const [id,table] of Object.entries(ROUTES)){
      const n=town.npcs.find(x=>x.id===id),target=table[period()];
      if(!n||moving.has(id)||!(target&&Array.isArray(target)))continue;
      const p=npcPos(n);if(p.fx!==undefined)continue;
      // Keep villagers from stepping across the player's feet while they're close.
      if(Math.abs(p.x-G.x)+Math.abs(p.y-G.y)<=1)continue;
      const step=nextStep(n,target);if(!step)continue;
      const [dx,dy]=step;
      const dest=[p.x+dx,p.y+dy];
      if(!canWalk(dest[0],dest[1],id))continue;
      const dir=dx>0?'right':dx<0?'left':dy>0?'down':'up';
      npcState[n.id]={...p,dir};
      moving.add(id);
      animNpcStep(n,dx,dy).catch(e=>console.warn('Burrowby town movement:',e)).finally(()=>moving.delete(id));
    }
  }
  setInterval(routineTick,850);
  // Save compatibility: only a small optional town-life record is added after interacting.
  // The existing market, path, door, building, ranch and home coordinates are not modified.
})();