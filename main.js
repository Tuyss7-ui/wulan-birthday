const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const pre=$('#preloader');
addEventListener('load',()=>setTimeout(()=>pre.classList.add('hide'),650));

const audio=$('#audio'), music=$('#music');
let musicOn=false;
async function startMusic(){
  try{await audio.play();musicOn=true;music.classList.add('on')}
  catch{alert('Kalau ingin musik, tambahkan file yang boleh kamu gunakan sebagai assets/music/betty.mp3')}
}
music.addEventListener('click',()=>musicOn?(audio.pause(),musicOn=false,music.classList.remove('on')):startMusic());
$('#begin').addEventListener('click',()=>{startMusic();$('#s1').scrollIntoView({behavior:'smooth'})});

const gift=$('#gift'), reveal=$('#giftReveal');
let opened=false;
gift.addEventListener('click',()=>{
  if(opened)return; opened=true; gift.classList.add('open');
  setTimeout(()=>reveal.classList.add('show'),450);
  fireworks(innerWidth/2,innerHeight*.42);
  heartBurst();
  setTimeout(()=>$('#s2').scrollIntoView({behavior:'smooth'}),1700);
});

// Real particle trail along the SVG heart silhouette.
const path=$('#heartPath'), dots=$('#heartParticles');
function buildHeart(){
  if(!path)return;
  const len=path.getTotalLength();
  dots.innerHTML='';
  const n=innerWidth<600?90:150;
  for(let i=0;i<n;i++){
    const pt=path.getPointAtLength((i/n)*len);
    const d=document.createElement('span'); d.className='heart-dot';
    const scale=Math.min(innerWidth,innerHeight)/1000;
    d.style.left=`calc(50% + ${((pt.x/100)-.5)*Math.min(innerWidth*.9,850)}px)`;
    d.style.top=`calc(50% + ${((pt.y/90)-.5)*Math.min(innerWidth*.9,765)}px)`;
    d.style.animationDelay=`${(i/n)*2}s`;
    d.style.animation=`heartPulse ${1.5+Math.random()*1.5}s ease-in-out infinite alternate`;
    dots.appendChild(d);
  }
}
buildHeart(); addEventListener('resize',buildHeart);

// Scroll reveal + progress
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show')}),{threshold:.15});
$$('.reveal').forEach(e=>obs.observe(e));
addEventListener('scroll',()=>{
  const max=document.documentElement.scrollHeight-innerHeight;
  $('#progressBar').style.width=(scrollY/Math.max(1,max)*100)+'%';
});

// Countdown to the next Oct 13.
function countdown(){
  const now=new Date();
  let t=new Date(now.getFullYear(),9,13,0,0,0);
  if(now>=t)t=new Date(now.getFullYear()+1,9,13,0,0,0);
  let x=t-now;
  const day=Math.floor(x/86400000); x%=86400000;
  const hr=Math.floor(x/3600000); x%=3600000;
  const mi=Math.floor(x/60000); x%=60000;
  const se=Math.floor(x/1000);
  $('#d').textContent=String(day).padStart(2,'0');
  $('#h').textContent=String(hr).padStart(2,'0');
  $('#m').textContent=String(mi).padStart(2,'0');
  $('#s').textContent=String(se).padStart(2,'0');
}
countdown();setInterval(countdown,1000);

// Envelope opens like a real letter.
$('#envelope').addEventListener('click',function(){
  this.classList.toggle('open');
  if(this.classList.contains('open')){fireworks(innerWidth/2,innerHeight*.4);heartBurst()}
});
$('#again').addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

// Heart burst DOM
function heartBurst(){
  const wrap=document.createElement('div');
  wrap.style.cssText='position:fixed;inset:0;z-index:70;pointer-events:none;overflow:hidden';
  for(let i=0;i<40;i++){
    const e=document.createElement('i');
    e.textContent=Math.random()>.2?'♥':'✦';
    e.style.cssText=`position:absolute;left:50%;top:45%;font-style:normal;font-size:${10+Math.random()*22}px;color:${Math.random()>.4?'#ff8fab':'#ffd98a'};--x:${(Math.random()-.5)*95}vw;--y:${(Math.random()-.5)*80}vh;animation:heartOut 1.6s cubic-bezier(.1,.8,.2,1) forwards;animation-delay:${Math.random()*.2}s`;
    wrap.appendChild(e);
  }
  document.body.appendChild(wrap);setTimeout(()=>wrap.remove(),1900);
}

// Canvas fireworks and ambient stars.
const c=$('#fx'),ctx=c.getContext('2d');let W,H,D,ambient=[],shots=[];
function size(){W=innerWidth;H=innerHeight;D=Math.min(devicePixelRatio||1,2);c.width=W*D;c.height=H*D;c.style.width=W+'px';c.style.height=H+'px';ctx.setTransform(D,0,0,D,0,0)}
size();addEventListener('resize',size);
function fireworks(x,y){
  const n=innerWidth<600?90:150;
  for(let i=0;i<n;i++){const a=i/n*Math.PI*2+Math.random()*.1,s=2+Math.random()*5;shots.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:80+Math.random()*30,max:110,r:1+Math.random()*2,col:Math.random()>.5?'#ff8fab':'#ffd98a'})}
}
function loop(){
  ctx.clearRect(0,0,W,H);
  if(ambient.length<(innerWidth<600?35:70))ambient.push({x:Math.random()*W,y:Math.random()*H,r:.5+Math.random()*1.3,a:.15+Math.random()*.3,vx:(Math.random()-.5)*.1,vy:(Math.random()-.5)*.1});
  ambient.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=W;if(p.x>W)p.x=0;ctx.globalAlpha=p.a;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fill()});
  shots=shots.filter(p=>p.life>0);
  shots.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vx*=.985;p.vy=p.vy*.985+.035;p.life--;ctx.globalAlpha=Math.max(0,p.life/p.max);ctx.fillStyle=p.col;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fill()});
  ctx.globalAlpha=1;requestAnimationFrame(loop)
}
loop();

const st=document.createElement('style');
st.textContent='@keyframes heartOut{to{transform:translate(var(--x),var(--y)) rotate(300deg) scale(.1);opacity:0}}@keyframes heartPulse{to{transform:scale(1.7);opacity:.35}}';
document.head.appendChild(st);
