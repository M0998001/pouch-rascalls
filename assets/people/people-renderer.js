// ===== Pouch Rascalls: illustrated people, customizable player =====
// This is additive: the original person renderer is still available for legacy looks.
const POUCH_PERSON_ART = Object.freeze({
  hazel: 'assets/people/hazel',
  pip: 'assets/people/pip',
  fern: 'assets/people/fern',
  grandma: 'assets/people/grandma',
  grunt: 'assets/people/grunt'
});
const _pouchHumanImg = Object.create(null);
const _pouchHumanPortraitCache = Object.create(null);
const _pouchOldPersonSprite = personSprite;
const _pouchOldPersonCanvas = personCanvas;
function pouchHumanKey(look) {
  if (!look || !LOOKS) return null;
  for (const k of Object.keys(POUCH_PERSON_ART)) if (look === LOOKS[k]) return k;
  return null;
}
function pouchHumanImage(id, view) {
  const key = id + '|' + view;
  if (_pouchHumanImg[key]) return _pouchHumanImg[key];
  const img = new Image();
  img.decoding = 'async';
  img.onload = () => {
    // Invalidate any procedural image cached while the PNG was loading.
    for (const key of Object.keys(personCache)) delete personCache[key];
    for (const key of Object.keys(_pouchHumanPortraitCache)) delete _pouchHumanPortraitCache[key];
  };
  img.onerror = () => console.warn('Human sprite failed to load:', id, view);
  img.src = POUCH_PERSON_ART[id] + '_' + view + '.png';
  _pouchHumanImg[key] = img;
  return img;
}
function pouchPersonColor(v, fallback) {
  return typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v) ? v : fallback;
}
// A higher-resolution, palette-driven avatar with all existing wardrobe options.
// Unlike static PNGs, this renderer reflects arbitrary player skin/hair/eyes/clothes.
function pouchCustomAvatar(look, dir, frame) {
  const W = 96, H = 128;
  const cvs = document.createElement('canvas'); cvs.width = W; cvs.height = H;
  const p = cvs.getContext('2d');
  const skin = pouchPersonColor(look.skin, '#f1c27d');
  const hair = pouchPersonColor(look.hair, '#6b4226');
  const out = pouchPersonColor(look.outfit, '#4a90d9');
  const acc = pouchPersonColor(look.accent, '#f2b53a');
  const pants = pouchPersonColor(look.pants, '#4a3b5c');
  const shoes = pouchPersonColor(look.shoes, '#3a2a2a');
  const eye = pouchPersonColor(look.eyes, '#3b6fb0');
  const style = look.style || 'short', top = look.top || 'tee', face = look.face || 'blush';
  const back = dir === 'up';
  const side = dir === 'right' || dir === 'left';
  const walking = frame === 1 || frame === 3;
  const step = frame === 1 ? 5 : frame === 3 ? -5 : 0;
  const ink = '#342837';
  if (dir === 'left') { p.translate(W, 0); p.scale(-1, 1); }
  p.lineJoin = 'round';
  p.lineCap = 'round';
  const ell = (x,y,rx,ry,color,outline=ink,width=3) => {
    p.beginPath(); p.ellipse(x,y,rx,ry,0,0,Math.PI*2);
    p.fillStyle=color; p.fill();
    if (outline){p.lineWidth=width;p.strokeStyle=outline;p.stroke();}
  };
  const shape = (points,col,outline=ink,width=3) => {
    p.beginPath();p.moveTo(points[0][0],points[0][1]);
    for(let i=1;i<points.length;i++)p.lineTo(points[i][0],points[i][1]);
    p.closePath();p.fillStyle=col;p.fill();
    if(outline){p.strokeStyle=outline;p.lineWidth=width;p.stroke();}
  };
  const line=(x,y,u,v,col,width=3)=>{p.beginPath();p.moveTo(x,y);p.lineTo(u,v);p.lineWidth=width;p.strokeStyle=col;p.stroke();};
  const hairShade=shade(hair,-.20), hairLight=shade(hair,.25);
  const skinShade=shade(skin,-.16), clothShade=shade(out,-.20);
  // Rear hair / ponytails / braids, behind neck and garments.
  if (['long','bob','ponytail','twintails','braids','curly'].includes(style)) {
    if(style==='twintails'){ell(19,60,9,28,hair);ell(77,60,9,28,hair);}
    else if(style==='ponytail'){ell(side?26:70,56,15,26,hairShade);ell(side?26:70,72,9,13,hair);}
    else {ell(48,58,29,32,hairShade);}
    if(style==='braids'){
      for(let i=0;i<3;i++){ell(20,64+i*9,7-i,7,hair);ell(76,64+i*9,7-i,7,hair);}
      ell(20,95,6,5,acc);ell(76,95,6,5,acc);
    }
  }
  // Boots and walking leg poses; the feet alternate for the two original walk frames.
  for(const [i,xx] of [33,62].entries()) {
    const dy=(i===0?-step:step);
    ell(xx,106+dy,10,18,pants);
    ell(xx+(side?3:0),120+dy*.55,12,6,shoes);
    ell(xx-3,118+dy*.55,5,2,shade(shoes,.30),null);
  }
  // Outfit silhouette, varied by selected top type.
  const tunic = top==='dress';
  if(tunic){
    shape([[34,74],[64,74],[73,107],[22,107]],out);
    line(28,101,68,101,clothShade,3);
  }else{
    shape([[30,75],[66,75],[69,107],[27,107]],out);
    shape([[32,100],[66,100],[66,107],[31,107]],clothShade,null);
  }
  if(top==='hoodie'){
    ell(48,79,19,10,clothShade);line(45,82,43,95,acc,3);line(53,82,55,95,acc,3);
    line(34,98,62,98,clothShade,3);
  }else if(top==='jacket'){
    shape([[45,79],[53,79],[58,107],[40,107]],acc,null);
    line(43,78,41,104,shade(out,.23),3);line(55,78,57,104,shade(out,.23),3);
  }else if(top==='vest'){
    shape([[37,82],[59,82],[57,103],[39,103]],acc,null);
    line(34,83,39,106,shade(out,.28),3);line(62,83,57,106,shade(out,.28),3);
  }else if(top==='overalls'){
    shape([[35,86],[61,86],[61,105],[34,105]],pants,null);
    line(38,80,39,95,pants,5);line(58,80,57,95,pants,5);
    ell(39,92,2,2,acc,null);ell(57,92,2,2,acc,null);
  }else if(top==='scarf'){
    ell(48,79,20,7,acc);shape([[56,81],[65,82],[62,103],[55,100]],acc);
  }else if(!back){
    shape([[45,79],[51,79],[53,97],[43,97]],acc,null);
  }
  // Sleeves, hands and modest alternating arm swing.
  const handSkin=(top==='vest'||top==='overalls');
  if(side){
    ell(60,84+(walking?1:0),9,16,out);
    ell(63,101+(walking?1:0),7,7,skin);
  }else{
    ell(25,85+(walking?step*.35:0),9,15,handSkin?skin:out);
    ell(71,85-(walking?step*.35:0),9,15,handSkin?skin:out);
    ell(25,101+(walking?step*.35:0),7,7,skin);
    ell(71,101-(walking?step*.35:0),7,7,skin);
  }
  // Neck and head; a larger chibi face reads at 20x28 in the overworld.
  ell(48,72,11,10,skinShade);
  if(!back){
    ell(side?49:48,51,side?27:29,32,skin);
    ell(48,74,13,5,skinShade,null);
    if(style==='buzz')ell(48,26,27,12,hairShade);
    else if(style==='mohawk'){
      ell(48,30,26,13,hairShade);shape([[38,29],[41,8],[48,17],[56,6],[61,31]],hair);
    }else if(style==='cap'){
      ell(48,26,28,14,hairShade);
      shape([[19,27],[77,27],[76,34],[19,34]],acc);
      if(side)shape([[55,30],[89,32],[83,39],[53,37]],shade(acc,-.12));
    }else{
      ell(48,27,30,15,hair);
      if(style==='spiky'){
        for(const [px,yy] of [[24,23],[41,10],[55,9],[70,23]])shape([[px-8,32],[px,yy],[px+8,32]],hair);
      }else if(style==='curly'){
        for(const [px,yy] of [[26,24],[37,15],[51,15],[66,19],[75,30]])ell(px,yy,10,10,hair);
      }else if(style==='bun')ell(51,12,15,9,hair);
      else if(style==='twintails'){
        ell(16,33,9,17,hair);ell(80,33,9,17,hair);
        ell(18,26,5,3,acc,null);ell(78,26,5,3,acc,null);
      }
      else if(style==='bob'||style==='long'){
        ell(24,49,10,27,hair);ell(72,49,10,27,hair);
      }else if(style==='ponytail'){
        ell(side?22:75,48,9,19,hair);ell(side?22:75,30,4,5,acc,null);
      }
      else if(style==='braids'){
        ell(22,46,7,16,hair);ell(74,46,7,16,hair);
      }
      // Thin hair fringe, trimmed so the eyes stay readable.
      shape([[22,33],[34,26],[42,32],[51,25],[61,29],[74,33],[65,37],[57,35],[48,40],[39,35],[30,40]],hair,null);
    }
    // Hair / face lighting and readable large eyes.
    if(side){
      ell(57,54,7,11,eye);
      ell(59,50,2.6,4,'#fff',null);
      ell(72,65,4,2.2,shade(skin,-.24),null);
      if(face==='blush'||face==='freckles')ell(67,64,5,3,'#e79b9d',null);
      line(64,72,70,71,ink,2);
    }else{
      ell(36,54,7,11,eye);ell(60,54,7,11,eye);
      ell(39,50,2.8,4,'#fff',null);ell(63,50,2.8,4,'#fff',null);
      ell(48,67,3,2,shade(skin,-.3),null);
      if(face==='blush'||face==='freckles'){
        ell(25,65,6,3,'#eda1a1',null);ell(71,65,6,3,'#eda1a1',null);
      }
      if(face==='freckles')for(const ex of [27,31,65,69])ell(ex,65,1.1,1.2,'#b47f66',null);
      line(44,73,48,75,ink,2);line(48,75,52,73,ink,2);
    }
    if(face==='glasses'||face==='shades'){
      const gcol=face==='shades'?'#25283c':'#3a2a32';
      if(side){ell(57,54,10,11,'rgba(45,44,62,.1)',gcol,3);line(64,53,74,51,gcol,3);}
      else {ell(36,54,10,11,face==='shades'?'#28283a':'rgba(255,255,255,.08)',gcol,3);ell(60,54,10,11,face==='shades'?'#28283a':'rgba(255,255,255,.08)',gcol,3);line(46,53,50,53,gcol,3);}
    }
    if(face==='bandage'){shape([[56,36],[70,35],[72,42],[57,43]],'#f5ead4',null);line(63,38,67,40,'#c6b79e',1);}
  } else {
    // Back of head with hairstyle-specific silhouette.
    ell(48,49,31,33,hair);
    ell(48,27,27,13,hairLight,null);
    if(style==='buzz')ell(48,49,29,30,shade(hair,.12));
    if(style==='mohawk')shape([[41,47],[44,9],[49,14],[54,7],[58,47]],hairLight);
    if(style==='braids'){
      for(const hx of [21,75])for(let i=0;i<4;i++)ell(hx,56+i*11,6,7,hairShade);
    }
    if(style==='ponytail'){
      ell(48,68,12,20,hairShade);ell(48,88,8,11,hair);ell(48,56,10,4,acc,null);
    }
    if(style==='twintails'){ell(17,58,10,26,hairShade);ell(79,58,10,26,hairShade);}
    if(style==='long'||style==='bob')ell(48,74,27,25,hair);
    if(style==='bun')ell(48,18,17,14,hairLight);
    if(style==='cap'){shape([[20,29],[76,29],[76,42],[20,42]],acc);ell(48,25,29,13,acc);}
  }
  // Equipment hats are layered on top of any selected hairstyle.
  if(look.hat){
    if(look.hat==='strawhat'){
      ell(48,24,44,8,'#d9af64');ell(48,15,26,13,'#f5d886');line(24,23,72,23,'#ad8648',4);
    }else if(look.hat==='rangercap'){
      ell(48,19,29,14,'#3e7a2c');if(!back)shape([[18,25],[78,25],[78,31],[18,31]],'#305e27');ell(48,17,4,4,'#f2d16b',null);
    }else if(look.hat==='wizardhat'){
      shape([[47,0],[59,7],[64,24],[74,30],[23,30],[30,24]],'#7652b6');
      ell(48,29,39,6,'#493082');ell(48,15,4,4,'#ffe36b',null);
    }else if(look.hat==='flowercrown'){
      for(const hx of [23,34,48,61,74]){
        ell(hx,24-(hx%3)*2,6,6,['#ff9fb3','#fff07a','#fff','#b48cf0'][hx%4],null);ell(hx,24-(hx%3)*2,2,2,'#f2b53a',null);
      }
    }else if(look.hat==='captainhat'){
      ell(48,18,30,14,'#f7f7f2');shape([[19,25],[78,25],[78,31],[19,31]],'#263146');ell(48,20,4,4,'#dfbc51',null);
    }else if(look.hat==='beanie'){
      ell(48,24,30,17,'#e2584f');shape([[20,29],[77,29],[77,37],[20,37]],'#f2f2f2');ell(48,8,7,7,'#f2f2f2');
    }
  }
  return cvs;
}
// A single draw path is used by overworld, cutscenes, 2.5-D views and character previews.
personSprite = function(look, dir, frame) {
  const key = 'illustrated|' + JSON.stringify(look) + '|' + dir + '|' + frame;
  if (personCache[key]) return personCache[key];
  const npc = pouchHumanKey(look);
  const view = dir==='up'?'up':dir==='down'?'down':'side';
  let source = null;
  if (npc) {
    const img=pouchHumanImage(npc,view);
    if (img.complete && img.naturalWidth) source=img;
  }
  if (!source) source=pouchCustomAvatar(look,dir,frame);
  const c = document.createElement('canvas'); c.width=20;c.height=28;
  const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  const y=(npc && (frame===1||frame===3))?-1:0;
  // The supplied NPC profile faces left; mirror only when walking to the right.
  if (npc && dir==='right') {ctx.translate(20,0);ctx.scale(-1,1);}
  ctx.drawImage(source,0,y,20,28);
  return personCache[key]=c;
};
personCanvas = function(look,scale,dir) {
  dir=dir||'down';
  const npc=pouchHumanKey(look);
  const view=dir==='up'?'up':dir==='down'?'down':'side';
  let image=npc?pouchHumanImage(npc,view):null;
  if (!(image && image.complete && image.naturalWidth)) image=pouchCustomAvatar(look,dir,0);
  const c=document.createElement('canvas');c.width=96;c.height=128;
  const x=c.getContext('2d');x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';
  if(npc && dir==='right'){x.translate(96,0);x.scale(-1,1);}
  x.drawImage(image,0,0,96,128);
  c.style.width=16*scale+'px';c.style.height=22*scale+'px';c.className='pix';
  return c;
};
for(const id of Object.keys(POUCH_PERSON_ART)) for(const view of ['down','side','up']) pouchHumanImage(id,view);
// ===== End illustrated people =====
