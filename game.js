const c=document.getElementById('screen'),x=c.getContext('2d');x.imageSmoothingEnabled=false;
const W=320,H=180,BIOMES=[
['TROPICAL','#16a4d8','#45b94e','#e33'],['DESERTO NEON','#d26a38','#c5aa38','#7d32d6'],
['ÁRTICO','#09265d','#a8e5ed','#f4f4ff'],['VULCÂNICO','#25101f','#9c3020','#ffb51b'],
['CIDADE FUTURA','#101748','#34349d','#18e9d2'],['ESPAÇO','#070712','#54209b','#ff3b9d']];
let keys={},score=0,lives=3,level=1,paused=false,over=false,spawn=0,cool=0;
let p={x:160,y:150,w:10,h:12,s:2.5},en=[],bul=[],eb=[],parts=[];
const hit=(a,b)=>Math.abs(a.x-b.x)<(a.w+b.w)/2&&Math.abs(a.y-b.y)<(a.h+b.h)/2;
const rand=(a,b)=>Math.random()*(b-a)+a;
function reset(){score=0;lives=3;level=1;paused=over=false;en=[];bul=[];eb=[];parts=[];p.x=160;p.y=150}
function boom(X,Y,col){for(let i=0;i<10;i++)parts.push({x:X,y:Y,vx:rand(-1.8,1.8),vy:rand(-1.8,1.8),life:18,col})}
function fire(){if(cool)return;bul.push({x:p.x,y:p.y-8,w:2,h:6,v:-5});cool=7}
function spawnEnemy(){let b=BIOMES[(level-1)%BIOMES.length];en.push({x:rand(10,310),y:-8,w:9,h:8,v:rand(.7,1.4)+level*.03,col:b[3]})}
function update(){
 if(paused||over)return;
 let dx=(keys.ArrowRight||keys.d?1:0)-(keys.ArrowLeft||keys.a?1:0),dy=(keys.ArrowDown||keys.s?1:0)-(keys.ArrowUp||keys.w?1:0);
 p.x=Math.max(7,Math.min(313,p.x+dx*p.s));p.y=Math.max(35,Math.min(172,p.y+dy*p.s));
 if(keys[' '])fire();if(cool)cool--;if(--spawn<=0){spawn=Math.max(9,28-level);spawnEnemy()}
 bul.forEach(b=>b.y+=b.v);eb.forEach(b=>b.y+=b.v);en.forEach(e=>e.y+=e.v);
 if(Math.random()<.012+level*.001&&en.length){let e=en[Math.floor(Math.random()*en.length)];eb.push({x:e.x,y:e.y,w:2,h:5,v:2.2+level*.04})}
 for(let i=bul.length-1;i>=0;i--)if(bul[i].y<0)bul.splice(i,1);
 for(let i=eb.length-1;i>=0;i--){if(eb[i].y>185)eb.splice(i,1);else if(hit(eb[i],p)){eb.splice(i,1);damage()}}
 for(let i=en.length-1;i>=0;i--){let e=en[i];if(e.y>190){en.splice(i,1);damage();continue}if(hit(e,p)){en.splice(i,1);damage()}}
 for(let i=bul.length-1;i>=0;i--){let done=false;for(let j=en.length-1;j>=0;j--)if(hit(bul[i],en[j])){let e=en[j];bul.splice(i,1);en.splice(j,1);score+=100+level*10;boom(e.x,e.y,e.col);done=true;break}if(done)continue}
 parts.forEach(q=>{q.x+=q.vx;q.y+=q.vy;q.life--});parts=parts.filter(q=>q.life>0);
 if(score>=level*1500){level++;en=[];eb=[]}
}
function damage(){lives--;boom(p.x,p.y,'#fff');p.x=160;p.y=150;if(lives<=0)over=true}
function draw(){
 let b=BIOMES[(level-1)%BIOMES.length],scroll=(Date.now()/30)%180;
 x.fillStyle=b[1];x.fillRect(0,0,W,H);x.fillStyle=b[2];
 for(let i=-1;i<4;i++)x.fillRect(0,i*55+130-scroll%55,W,50);
 x.fillStyle='rgba(255,255,255,.35)';for(let i=0;i<25;i++)x.fillRect((i*47)%320,(i*83+scroll)%180,1,1);
 x.fillStyle='#111';for(let i=0;i<7;i++){let xx=i*55+15;x.fillRect(xx,120,10,30);x.fillRect(xx+5,105,2,15)}
 bul.forEach(b=>{x.fillStyle='#fff';x.fillRect(b.x-1,b.y,b.w,b.h)});eb.forEach(b=>{x.fillStyle='#ffec38';x.fillRect(b.x-1,b.y,b.w,b.h)});
 en.forEach(e=>{x.fillStyle=e.col;x.fillRect(e.x-4,e.y-4,9,8);x.fillStyle='#111';x.fillRect(e.x-1,e.y-1,2,2)});
 x.fillStyle='#fff';x.fillRect(p.x-5,p.y-5,10,9);x.fillStyle='#1cf';x.fillRect(p.x-2,p.y-2,4,4);x.fillStyle='#f33';x.fillRect(p.x-8,p.y+3,5,3);x.fillRect(p.x+3,p.y+3,5,3);
 parts.forEach(q=>{x.fillStyle=q.col;x.fillRect(q.x|0,q.y|0,2,2)});
 document.getElementById('level').textContent=level;document.getElementById('score').textContent=score;document.getElementById('lives').textContent=lives;document.getElementById('biome').textContent=b[0];
 document.getElementById('message').innerHTML=over?'GAME OVER<br><small>ENTER = REINICIAR</small>':paused?'PAUSADO<br><small>P = CONTINUAR</small>':'';
}
function loop(){update();draw();requestAnimationFrame(loop)}loop();
addEventListener('keydown',e=>{keys[e.key]=true;if([' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))e.preventDefault();if(e.key.toLowerCase()==='p')paused=!paused;if(over&&e.key==='Enter')reset()});addEventListener('keyup',e=>keys[e.key]=false);

// Controles de toque para celular/tablet
const touchKeys={left:false,right:false,fire:false};
function bindTouch(id,key){
 const el=document.getElementById(id);
 if(!el)return;
 const down=e=>{e.preventDefault();touchKeys[key]=true;};
 const up=e=>{e.preventDefault();touchKeys[key]=false;};
 ['touchstart','pointerdown'].forEach(ev=>el.addEventListener(ev,down,{passive:false}));
 ['touchend','touchcancel','pointerup','pointercancel','pointerleave'].forEach(ev=>el.addEventListener(ev,up,{passive:false}));
}
bindTouch('left','left');bindTouch('right','right');bindTouch('fire','fire');
const oldUpdate=update;
update=function(){
 keys.ArrowLeft=keys.ArrowLeft||touchKeys.left;
 keys.ArrowRight=keys.ArrowRight||touchKeys.right;
 keys[' ']=keys[' ']||touchKeys.fire;
 oldUpdate();
 if(touchKeys.left)keys.ArrowLeft=false;
 if(touchKeys.right)keys.ArrowRight=false;
 if(touchKeys.fire)keys[' ']=false;
};
