// Pouch Rascalls — native-pixel character art (v2)
// All geometry is drawn directly to the game's 20x28 pixel character canvas.
// No 96px portrait sprites are reduced into tiny textures.
(() => {
  'use strict';
  const VERSION='pixel-people-v2';
  // Emergency opt-out: add ?classicPeople=1 to the game URL to use the previous renderer.
  if (typeof location !== 'undefined' && new URLSearchParams(location.search).get('classicPeople') === '1') {
    window.POUCH_PIXEL_PEOPLE_VERSION='classic-fallback';
    return;
  }
  const INK='#302737';
  const rgb = s => {
    if(typeof s!=='string'||!/^#[0-9a-f]{6}$/i.test(s))return [112,91,110];
    return [1,3,5].map(i=>parseInt(s.slice(i,i+2),16));
  };
  const tint=(s,k)=>{
    const c=rgb(s).map(v=>Math.max(0,Math.min(255,Math.round(k>=0?v+(255-v)*k:v*(1+k)))));
    return '#'+c.map(v=>v.toString(16).padStart(2,'0')).join('');
  };
  const oldPersonSprite=personSprite;
  const oldPersonCanvas=personCanvas;
  const tag=look => {
    if(!look || typeof LOOKS==='undefined')return '';
    for(const id of ['hazel','pip','fern','grandma','grunt'])if(look===LOOKS[id])return id;
    return '';
  };
  function nativePeopleSprite(look,dir,frame) {
    if(!look)return oldPersonSprite(look,dir,frame);
    const c=document.createElement('canvas');c.width=20;c.height=28;
    const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;
    const flip=dir==='left';const d=flip?'right':dir==='up'?'up':dir==='right'?'right':'down';
    if(flip){ctx.translate(20,0);ctx.scale(-1,1);}
    const P=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(x,y,w,h);};
    const cskin=look.skin||'#f1c27d',hair=look.hair||'#6b4226',coat=look.outfit||'#e2584f',accent=look.accent||'#4a90d9',pants=look.pants||'#4a3b5c',shoes=look.shoes||'#3a2a2a',eye=look.eyes||'#302737';
    const face=look.face||'blush',style=look.style||'short',top=look.top||'tee',h=look.hat||null;
    const who=tag(look),back=d==='up',side=d==='right',front=d==='down';
    const bob=(frame===1||frame===3)?1:0;
    const lstep=frame===1?-1:0,rstep=frame===3?-1:0;
    const hh=5+bob, chest=15+bob;
    const light=tint(coat,.24), dark=tint(coat,-.24),skinLight=tint(cskin,.17),skinDark=tint(cskin,-.18),hairLight=tint(hair,.26),hairDark=tint(hair,-.20);

    // Coat silhouette and hair behind shoulders, drawn before the head.
    if(['long','bob','braids','twintails','ponytail','curly'].includes(style)){
      if(side){P(5,9+bob,3,9,hairDark);if(style==='ponytail')P(3,10+bob,3,7,hair);}
      else if(style==='twintails'){P(2,9+bob,3,8,hairDark);P(15,9+bob,3,8,hairDark);}
      else if(style==='ponytail'){P(back?8:13,9+bob,3,9,hairDark);}
      else{P(4,9+bob,12,9,hairDark);}
    }
    // Paired separated legs and readable boots, with alternate stride frames.
    if(side){
      const a=frame===1?-2:0,b=frame===3?-2:0;
      P(8,20+a,3,4,pants);P(9,23+a,3,2,shoes);
      P(11,20+b,3,4,tint(pants,-.2));P(12,23+b,3,2,shoes);
      P(13,24+b,2,1,tint(shoes,.25));
    }else{
      P(5,19+lstep,4,5,pants);P(11,19+rstep,4,5,pants);
      P(5,23+lstep,4,2,shoes);P(11,23+rstep,4,2,shoes);
      P(6,23+lstep,2,1,tint(shoes,.22));P(12,23+rstep,2,1,tint(shoes,.22));
    }
    // Arms behind torso. A one-pixel arm swing is leg-specific.
    const as=frame===1?1:frame===3?-1:0;
    if(side){P(7,15+bob,3,6,dark);P(7,20+bob-as,3,2,cskin);}
    else{
      P(3,15+bob+as,3,6,coat);P(14,15+bob-as,3,6,coat);
      P(3,20+bob+as,3,2,cskin);P(14,20+bob-as,3,2,cskin);
    }
    // Chest area. Vary silhouette and costume details at 1px resolution.
    if(top==='dress'){
      P(5,15+bob,10,4,coat);P(4,19+bob,12,3,coat);P(5,21+bob,10,1,dark);
    } else {P(5,15+bob,10,7,coat);P(5,21+bob,10,1,dark);}
    P(6,15+bob,7,1,light);
    if(top==='hoodie'){
      P(6,15+bob,8,2,dark);if(front){P(8,17+bob,1,2,accent);P(11,17+bob,1,2,accent);P(8,20+bob,4,1,dark);}
    }else if(top==='jacket'){
      if(front){P(8,16+bob,4,6,accent);P(7,16+bob,1,5,light);P(12,16+bob,1,5,light);}
      else if(side)P(12,16+bob,2,5,accent);
    }else if(top==='vest'){
      P(8,16+bob,4,5,accent);if(front){P(6,16+bob,2,5,dark);P(12,16+bob,2,5,dark);}
    }else if(top==='overalls'){
      P(7,17+bob,6,4,pants);if(front){P(7,16+bob,2,2,pants);P(11,16+bob,2,2,pants);P(8,19+bob,4,1,accent);}
    }else if(top==='scarf'){
      P(6,15+bob,8,2,accent);P(side?11:12,17+bob,2,4,accent);
    }else if(front){P(9,16+bob,2,4,accent);}
    if(who==='fern'){
      // Ranger tunic, tan field strap and gold forest badge.
      if(front){P(6,16+bob,2,5,'#9a7042');P(11,18+bob,2,2,'#eed58c');}
      if(back)P(8,16+bob,4,3,'#8d7044');
    }else if(who==='hazel'){
      if(front){P(7,16+bob,6,2,'#5c8e4a');P(9,18+bob,2,2,'#e9d7a8');}
    }else if(who==='pip'){
      if(front||side){P(6,15+bob,8,2,'#467ac1');P(12,17+bob,2,3,'#467ac1');}
    }else if(who==='grandma'){
      P(5,16+bob,10,2,'#e5a3ba');if(front)P(7,20+bob,6,1,'#efd9cb');
    }else if(who==='grunt'){
      P(5,16+bob,10,2,'#46374e');if(front){P(9,17+bob,2,1,'#b26cb9');P(5,21+bob,10,1,'#8c5aa3');}
    }
    // Neck and head. Native head width 10px; never downsample from a portrait.
    P(side?7:8,14+bob,4,3,skinDark);
    if(side){
      P(5,8+bob,9,7,cskin);P(6,7+bob,8,2,skinLight);P(13,12+bob,2,2,cskin);
    }else{
      P(5,7+bob,10,8,cskin);P(6,7+bob,8,2,skinLight);P(5,10+bob,1,4,skinDark);P(14,10+bob,1,4,skinDark);
    }
    // Background hair line. Back of head has no eyes or face details.
    if(back){
      P(5,5+bob,10,10,hair);P(5,7+bob,2,7,hairDark);P(7,6+bob,5,2,hairLight);
      if(['long','bob','twintails'].includes(style))P(5,14+bob,10,4,hair);
      if(style==='braids'){P(4,12+bob,2,7,hairDark);P(14,12+bob,2,7,hairDark);P(4,19+bob,2,1,accent);P(14,19+bob,2,1,accent);}
      if(style==='bun'){P(8,3+bob,4,3,hair);P(9,3+bob,2,1,hairLight);}
      if(style==='ponytail'){P(9,11+bob,3,8,hair);P(9,11+bob,3,1,accent);}
      if(style==='spiky'||style==='mohawk'){P(5,4+bob,2,3,hair);P(9,3+bob,3,4,hair);P(14,5+bob,2,3,hair);}
      if(style==='cap')P(4,6+bob,12,4,accent);
    }else{
      // Eyes and facial expression; use 1–2 pixel irises, never huge ovals.
      if(side){
        P(11,11+bob,2,2,eye);P(12,11+bob,1,1,'#ffffff');P(14,13+bob,1,1,skinDark);
        if(face==='blush'||face==='freckles')P(12,13+bob,2,1,'#e9a19a');
        if(face==='freckles')P(11,13+bob,1,1,'#b37a65');
        P(12,15+bob,2,1,'#754b45');
      } else {
        P(7,11+bob,2,2,eye);P(11,11+bob,2,2,eye);
        P(8,11+bob,1,1,'#ffffff');P(12,11+bob,1,1,'#ffffff');
        P(9,14+bob,2,1,'#8f5651');
        if(face==='blush'||face==='freckles'){P(5,13+bob,2,1,'#ec9a9b');P(13,13+bob,2,1,'#ec9a9b');}
        if(face==='freckles'){P(7,13+bob,1,1,'#a46d55');P(12,13+bob,1,1,'#a46d55');}
      }
      if(face==='glasses'||face==='shades'){
        const fcol=face==='shades'?'#32394c':'#46353d';
        if(side){P(10,10+bob,4,1,fcol);P(10,11+bob,1,3,fcol);P(13,11+bob,1,3,fcol);P(10,14+bob,4,1,fcol);}
        else {P(6,10+bob,3,1,fcol);P(11,10+bob,3,1,fcol);P(6,13+bob,3,1,fcol);P(11,13+bob,3,1,fcol);P(6,11+bob,1,2,fcol);P(8,11+bob,1,2,fcol);P(11,11+bob,1,2,fcol);P(13,11+bob,1,2,fcol);P(9,11+bob,2,1,fcol);}
        if(face==='shades'){if(side)P(11,11+bob,2,2,fcol);else{P(7,11+bob,1,2,fcol);P(12,11+bob,1,2,fcol);}}
      }else if(face==='bandage'){P(side?12:11,9+bob,3,1,'#fff2cf');}
      if(who==='hazel'&&face!=='glasses'&&face!=='shades'){
        // Kindly professor's glasses, thin enough to keep her eyes visible.
        if(side)P(10,10+bob,4,1,'#715746');
        else{P(6,10+bob,3,1,'#715746');P(11,10+bob,3,1,'#715746');P(9,11+bob,2,1,'#715746');}
      }
      if(who==='grunt'&&front){P(7,13+bob,6,2,'#393344');P(8,13+bob,4,1,'#7e6c85');}
      // Hair and bangs: eyes remain fully exposed.
      if(style==='buzz'){P(5,5+bob,10,3,hair);P(5,8+bob,2,2,hairDark);}
      else if(style==='mohawk'){P(9,2+bob,3,5,hair);P(6,6+bob,7,2,hairDark);}
      else if(style==='cap'){P(5,5+bob,10,3,hair);P(5,8+bob,2,2,hairDark);}
      else{
        P(5,5+bob,10,3,hair);P(5,8+bob,3,2,hair);P(side?5:13,8+bob,2,3,hairDark);
        P(6,5+bob,6,1,hairLight);
        if(style==='spiky'){P(5,4+bob,2,2,hair);P(9,3+bob,2,3,hair);P(13,4+bob,2,2,hair);}
        if(style==='bun'){P(8,3+bob,4,3,hair);P(9,3+bob,2,1,hairLight);}
        if(style==='curly'){P(4,6+bob,3,3,hair);P(8,4+bob,3,3,hair);P(13,6+bob,3,3,hair);}
        if(style==='long'||style==='bob'){P(4,9+bob,2,6,hair);P(side?5:14,9+bob,2,6,hair);}
        if(style==='braids'){P(4,10+bob,2,8,hairDark);if(!side)P(14,10+bob,2,8,hairDark);P(4,18+bob,2,1,accent);if(!side)P(14,18+bob,2,1,accent);}
        if(style==='twintails'){P(3,8+bob,2,10,hair);if(!side)P(15,8+bob,2,10,hair);P(3,9+bob,2,1,accent);}
        if(style==='ponytail'){P(side?4:14,9+bob,2,9,hair);P(side?4:14,9+bob,2,1,accent);}
      }
    }
    // Headwear is deliberately small: each fits inside the 20x28 footprint.
    const hat=h||(who==='grunt'?'gruntcap':null);
    if(hat==='strawhat'){
      P(3,6+bob,14,2,'#b18446');P(6,2+bob,8,5,'#eed18a');P(7,6+bob,6,1,'#b18446');
    }else if(hat==='rangercap'){
      P(5,4+bob,10,4,'#3e7a2c');P(side?11:4,8+bob,side?7:12,1,'#264d27');P(9,5+bob,2,1,'#f2d16b');
    }else if(hat==='wizardhat'){
      P(9,0,3,2,'#7353b4');P(8,2,5,3,'#7353b4');P(7,5,7,2,'#7353b4');P(4,7,12,1,'#443171');P(9,5,1,1,'#ffe36b');
    }else if(hat==='flowercrown'){
      P(4,6+bob,12,1,'#5b9b58');for(const x of [5,8,11,14]){P(x,5+bob,2,2,['#ffb6d2','#fff39c','#d5bcff','#fff'][x%4]);P(x,6+bob,1,1,'#f3bb45');}
    }else if(hat==='captainhat'){
      P(5,3+bob,10,4,'#f6f3ec');P(4,7+bob,12,2,'#263147');P(9,5+bob,2,1,'#f6c64e');
    }else if(hat==='beanie'){
      P(5,3+bob,10,4,'#d7524a');P(4,7+bob,12,2,'#fff0ed');P(9,2+bob,2,1,'#fff0ed');
    }else if(hat==='gruntcap'){
      P(5,3+bob,10,4,'#343044');P(side?10:4,7+bob,side?7:12,2,'#282536');P(9,4+bob,2,2,'#b477bf');
    }
    // Pixel outline around external silhouette, not around eyes or interiors.
    const data=ctx.getImageData(0,0,20,28);
    const src=new Uint8ClampedArray(data.data);
    for(let y=1;y<27;y++)for(let x=1;x<19;x++){
      const i=(y*20+x)*4;
      if(src[i+3])continue;
      if([[0,-1],[0,1],[-1,0],[1,0]].some(([xx,yy])=>src[((y+yy)*20+x+xx)*4+3]>200)){
        data.data[i]=48;data.data[i+1]=39;data.data[i+2]=55;data.data[i+3]=255;
      }
    }
    ctx.putImageData(data,0,0);
    return c;
  }
  personSprite=function(look,dir,frame){
    const key=VERSION+'|'+JSON.stringify(look)+'|'+dir+'|'+frame+'|'+tag(look);
    if(personCache[key])return personCache[key];
    return personCache[key]=nativePeopleSprite(look,dir,frame||0);
  };
  personCanvas=function(look,scale,dir){
    const c=document.createElement('canvas');c.width=20;c.height=28;
    c.getContext('2d').drawImage(personSprite(look,dir||'down',0),0,0);
    c.style.width=16*scale+'px';c.style.height=22*scale+'px';
    c.className='pix';return c;
  };
  // A stable version tag is useful in isolated visual tests and for cache invalidation.
  window.POUCH_PIXEL_PEOPLE_VERSION=VERSION;
  window.pouchPeopleNativeSprite=nativePeopleSprite;
})();