const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];
// Mobile navigation
const toggle=$('.menu-toggle'),nav=$('.nav');toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',open)});$$('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
// Reveal-on-scroll
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});$$('.reveal').forEach(el=>observer.observe(el));
// Skill micro-interaction
const tip=$('#skill-tip');$$('.skill-card').forEach(card=>{const show=()=>{tip.textContent='↳ '+card.dataset.skill};card.addEventListener('mouseenter',show);card.addEventListener('focus',show)});
// Lightweight tilt — disabled for touch devices
if(!matchMedia('(pointer: coarse)').matches){$$('[data-tilt]').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`rotateX(${(-y*7).toFixed(2)}deg) rotateY(${(x*7).toFixed(2)}deg)`});el.addEventListener('pointerleave',()=>el.style.transform='')})}
// Certificate modal
const modal=$('#cert-modal'),frame=$('#cert-frame'),openPdf=$('#open-pdf'),modalTitle=$('#modal-title');function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');frame.src=''}function openCert(card){const src=card.dataset.cert;modalTitle.textContent=card.dataset.title||'Certificate';frame.src=src;openPdf.href=src;modal.classList.add('open');modal.setAttribute('aria-hidden','false')}$$('.cert-card[data-cert]').forEach(c=>c.addEventListener('click',e=>{if(!e.target.closest('button')||e.target.closest('.view-cert'))openCert(c)}));$('#close-modal').addEventListener('click',closeModal);$('#close-modal-bottom').addEventListener('click',closeModal);$('.modal-backdrop').addEventListener('click',closeModal);document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
// Contact: mailto, no backend required
$('#contact-form').addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.currentTarget);const subject=encodeURIComponent('Portfolio contact from '+d.get('name'));const body=encodeURIComponent(`Name: ${d.get('name')}\nEmail: ${d.get('email')}\n\n${d.get('message')}`);window.location.href=`mailto:mahasri9871@gmail.com?subject=${subject}&body=${body}`});
// Custom cursor dot
const dot=$('#cursor-dot');if(matchMedia('(pointer:fine)').matches){window.addEventListener('pointermove',e=>{dot.style.transform=`translate(${e.clientX}px,${e.clientY}px)`})}else dot.remove();
// Subtle Three.js particle field — one scene, kept intentionally quiet.
(function(){if(!window.THREE)return;const canvas=$('#space'),scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,.1,100);camera.position.z=7;const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);const count=matchMedia('(max-width:700px)').matches?550:950;const pos=new Float32Array(count*3);for(let i=0;i<count;i++){const i3=i*3;pos[i3]=(Math.random()-.5)*13;pos[i3+1]=(Math.random()-.5)*8;pos[i3+2]=(Math.random()-.5)*7}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));const mat=new THREE.PointsMaterial({color:0x7edfff,size:.018,transparent:true,opacity:.55});const points=new THREE.Points(geo,mat);scene.add(points);let mx=0,my=0,tx=0,ty=0;addEventListener('pointermove',e=>{tx=(e.clientX/innerWidth-.5)*.25;ty=(e.clientY/innerHeight-.5)*.15});function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)}addEventListener('resize',resize);function loop(){mx+=(tx-mx)*.02;my+=(ty-my)*.02;points.rotation.y+=.00022;points.rotation.x=.05+my;camera.position.x=mx;renderer.render(scene,camera);requestAnimationFrame(loop)}loop()})();

/* ===== v2: projects ===== */
// Put each real repository URL here. While it still says YOUR_GITHUB_REPOSITORY_URL the button opens your GitHub profile instead.
const REPOS={careergap:'YOUR_GITHUB_REPOSITORY_URL',apart:'YOUR_GITHUB_REPOSITORY_URL',upi:'YOUR_GITHUB_REPOSITORY_URL'};
$$('.pcard').forEach(c=>{const u=REPOS[c.dataset.id];const a=c.querySelector('.pbtn.git');if(u&&/^https:\/\/github\.com\/.+\/.+/.test(u)){a.href=u}else{a.title='Repository link not added yet – opens my GitHub profile'}});
const DETAILS={
 careergap:{t:'CareerGap AI — Mini Skill Gap Analyzer',d:'An AI-assisted career skill gap analysis platform that identifies missing skills for a selected career and generates a personalized learning roadmap.',f:['Career role selection','Skill gap detection','Skill proficiency analysis','Readiness score','Personalized learning roadmap','Recommended next skill','Recommended project','Skill assessment'],s:'Python, Flask, HTML, CSS, JavaScript, NLP'},
 apart:{t:'APART — Animal Product & Antibiotic Residue Tracking System',d:'Backend APIs for managing animal, treatment, drug and compliance data.',f:['Animal records','Treatment records','Drug data','Compliance data'],s:'Node.js, Express.js, PostgreSQL, Prisma'},
 upi:{t:'UPI Fraud Detection',d:'A mini project to detect potentially fraudulent UPI transactions using machine learning techniques and transaction data analysis.',f:['Transaction data analysis','Machine learning based detection of potentially fraudulent transactions'],s:'Python, Machine Learning'}};
const pm=$('#proj-modal');
function closePm(){pm.classList.remove('open');pm.setAttribute('aria-hidden','true')}
$$('[data-details]').forEach(b=>b.addEventListener('click',()=>{const p=DETAILS[b.dataset.details];$('#pm-title').textContent=p.t;
 $('#pm-body').innerHTML=`<p>${p.d}</p><h4>Features</h4><ul>${p.f.map(x=>`<li>${x}</li>`).join('')}</ul><h4>Technologies</h4><p>${p.s}</p><h4>About the live demo</h4><p>The Live Demo is a sample frontend preview with made-up data. It is not the deployed project.</p>`;
 pm.classList.add('open');pm.setAttribute('aria-hidden','false')}));
$('#pm-close').addEventListener('click',closePm);pm.querySelector('.modal-backdrop').addEventListener('click',closePm);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePm()});
