/* ===== fx.js : 3D + futuristic effects. Loaded after script.js. ===== */
(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const fine=matchMedia('(pointer:fine)').matches, reduce=matchMedia('(prefers-reduced-motion:reduce)').matches, small=innerWidth<700;

/* scroll progress bar */
const bar=document.createElement('div');bar.id='progress';document.body.appendChild(bar);
addEventListener('scroll',()=>{bar.style.transform=`scaleX(${scrollY/(document.documentElement.scrollHeight-innerHeight||1)})`},{passive:true});

/* cursor ring that trails the dot + magnetic buttons */
if(fine&&!reduce){
 const r=document.createElement('div');r.id='cursor-ring';document.body.appendChild(r);let x=0,y=0,tx=0,ty=0;
 addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY});
 (function f(){x+=(tx-x)*.16;y+=(ty-y)*.16;r.style.transform=`translate(${x}px,${y}px)`;requestAnimationFrame(f)})();
 document.addEventListener('pointerover',e=>r.classList.toggle('big',!!e.target.closest('a,button,.skill-card,.pcard,.cert-card')));
 $$('.button,.pbtn').forEach(b=>{b.addEventListener('pointermove',e=>{const q=b.getBoundingClientRect();b.style.translate=`${(e.clientX-q.left-q.width/2)*.2}px ${(e.clientY-q.top-q.height/2)*.3}px`});b.addEventListener('pointerleave',()=>b.style.translate='')});
}

/* 3D tilt + glare on cards */
if(fine&&!reduce)$$('.pcard,.cert-card,.skill-card,.journey-node,.edu-item,.timeline-card').forEach(c=>{
 const g=document.createElement('span');g.className='fx-glare';c.appendChild(g);
 c.addEventListener('pointermove',e=>{const q=c.getBoundingClientRect(),px=(e.clientX-q.left)/q.width,py=(e.clientY-q.top)/q.height;
  c.classList.add('tilting');c.style.setProperty('--mx',px*100+'%');c.style.setProperty('--my',py*100+'%');
  c.style.transform=`perspective(800px) rotateY(${(px-.5)*14}deg) rotateX(${(.5-py)*14}deg) translateZ(14px)`});
 c.addEventListener('pointerleave',()=>{c.classList.remove('tilting');c.style.transform=''});
});
$$('.skill-card').forEach((c,i)=>c.style.setProperty('--i',i));

/* scan line over the photo */
const pf=$('.photo-frame');if(pf&&!reduce){const s=document.createElement('div');s.className='scan';pf.appendChild(s)}

/* text scramble (decode) for role line and section titles */
const CH='01<>/{}[]#$%&*';
function scramble(el){if(reduce)return;const t=el.textContent;let n=0;const id=setInterval(()=>{el.textContent=t.split('').map((c,i)=>c===' '||i<n?c:CH[Math.random()*CH.length|0]).join('');n+=Math.max(1,t.length/22);if(n>=t.length+1){el.textContent=t;clearInterval(id)}},35)}
const role=$('.role');if(role)setTimeout(()=>scramble(role),500);
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const h=e.target.querySelector('h2');if(h&&!h.querySelector('*'))scramble(h);io.unobserve(e.target)}}),{threshold:.6});
$$('.section-heading').forEach(h=>io.observe(h));

/* hero 3D scene: wireframe core, rings and orbiting shards behind the photo */
const hv=$('.hero-visual');
if(window.THREE&&hv&&!reduce){
 const cv=document.createElement('canvas');cv.id='heroFx';hv.prepend(cv);
 const R=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:!small});R.setPixelRatio(Math.min(devicePixelRatio,small?1:1.5));
 const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(45,1,.1,50);cam.position.z=11.5;
 const mat=(c,o)=>new THREE.MeshBasicMaterial({color:c,wireframe:true,transparent:true,opacity:o});
 const core=new THREE.Mesh(new THREE.IcosahedronGeometry(3.1,small?1:2),mat(0x55e5ff,.22));sc.add(core);
 const inner=new THREE.Mesh(new THREE.OctahedronGeometry(2,0),mat(0xa978ff,.35));sc.add(inner);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(4.3,.012,8,120),new THREE.MeshBasicMaterial({color:0x6f8cff,transparent:true,opacity:.7}));ring.rotation.x=1.2;sc.add(ring);
 const ring2=ring.clone();ring2.scale.setScalar(.8);ring2.rotation.set(.4,.9,0);ring2.material=ring.material.clone();ring2.material.color.set(0xa978ff);sc.add(ring2);
 const shards=[];for(let i=0;i<(small?5:9);i++){const m=new THREE.Mesh(new THREE.TetrahedronGeometry(.18+Math.random()*.12),mat(i%2?0x55e5ff:0xa978ff,.9));m.userData={a:Math.random()*6.28,r:4+Math.random()*1.4,s:.004+Math.random()*.006,y:(Math.random()-.5)*3};sc.add(m);shards.push(m)}
 let mx=0,my=0;addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
 const size=()=>{const w=cv.clientWidth,h=cv.clientHeight;R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()};size();addEventListener('resize',size);
 let vis=true;new IntersectionObserver(([e])=>vis=e.isIntersecting).observe(hv);let t=0;
 (function loop(){requestAnimationFrame(loop);if(!vis||document.hidden)return;t+=.01;
  core.rotation.y+=.003;core.rotation.x+=.0015;inner.rotation.y-=.008;inner.rotation.z+=.004;
  ring.rotation.z+=.004;ring2.rotation.y+=.006;
  shards.forEach(s=>{const d=s.userData;d.a+=d.s;s.position.set(Math.cos(d.a)*d.r,d.y+Math.sin(t+d.a)*.3,Math.sin(d.a)*d.r*.5);s.rotation.x+=.03;s.rotation.y+=.02});
  sc.rotation.y+=(mx*.8-sc.rotation.y)*.05;sc.rotation.x+=(my*.5-sc.rotation.x)*.05;
  R.render(sc,cam)})();
}
})();
