// splash (once per session)
const sp=document.getElementById('splash');
if(sp){
  if(sessionStorage.getItem('splash')){sp.remove()}
  else{setTimeout(()=>{sp.classList.add('done');sessionStorage.setItem('splash','1');setTimeout(()=>sp.remove(),900)},3200)}
}
// mobile nav
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{const u=document.querySelector('nav ul');u&&u.classList.remove('open');const b=document.querySelector('.burger');b&&b.setAttribute('aria-expanded','false')}));
const bg=document.querySelector('.burger'),ul=document.querySelector('nav ul');
if(bg)bg.addEventListener('click',()=>{const o=ul.classList.toggle('open');bg.setAttribute('aria-expanded',o)});
// 3D tilt
document.querySelectorAll('.card,.frame').forEach(el=>{
  el.addEventListener('mousemove',e=>{
    const r=el.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;
    el.style.transform=`perspective(900px) rotateY(${px*14}deg) rotateX(${-py*14}deg) translateZ(10px)`;
  });
  el.addEventListener('mouseleave',()=>{el.style.transform=''});
});
// reveal + skill bars + counters
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  e.target.classList.add('in');
  e.target.querySelectorAll('.skill i b').forEach(b=>{b.style.width=b.dataset.w+'%'});
  e.target.querySelectorAll('[data-n]').forEach(n=>{
    const t=+n.dataset.n;let i=0;
    const s=setInterval(()=>{i++;n.textContent=i+(n.dataset.s||'');if(i>=t)clearInterval(s)},900/t);
  });
  io.unobserve(e.target);
}),{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
// typing role
const role=document.getElementById('role');
if(role){
  const R=['Data Scientist','Machine Learning Engineer','Data Analyst','Full Stack Developer'];
  let a=0,b=0,del=false;
  (function t(){
    const w=R[a];role.textContent=w.slice(0,b)+'▍';
    if(!del&&b===w.length){del=true;return setTimeout(t,1400)}
    if(del&&b===0){del=false;a=(a+1)%R.length}
    b+=del?-1:1;setTimeout(t,del?40:80);
  })();
}
// project filters
const fb=document.querySelectorAll('#projects .filters button');
fb.forEach(b=>b.addEventListener('click',()=>{
  fb.forEach(x=>x.classList.remove('on'));b.classList.add('on');
  document.querySelectorAll('[data-cat]').forEach(c=>c.classList.toggle('hide',b.dataset.f!=='all'&&c.dataset.cat!==b.dataset.f));
}));
// contact form -> opens the visitor's email app
const f=document.getElementById('cform');
if(f)f.addEventListener('submit',e=>{
  e.preventDefault();const d=new FormData(f);
  location.href='mailto:chandankmishra567@gmail.com?subject='+encodeURIComponent(d.get('subject'))+'&body='+encodeURIComponent(d.get('message')+'\n\n- '+d.get('name')+' ('+d.get('email')+')');
});

// theme toggle (remembered)
const root=document.documentElement,tb=document.querySelector('.theme');
try{if(localStorage.getItem('theme')==='light')root.dataset.theme='light'}catch(e){}
if(tb)tb.addEventListener('click',()=>{const l=root.dataset.theme!=='light';root.dataset.theme=l?'light':'dark';try{localStorage.setItem('theme',root.dataset.theme)}catch(e){}});
// scroll progress + back to top
const pg=document.getElementById('progress'),tp=document.querySelector('.top');
addEventListener('scroll',()=>{const h=document.documentElement.scrollHeight-innerHeight;if(pg)pg.style.width=(h>0?scrollY/h*100:0)+'%';if(tp)tp.classList.toggle('show',scrollY>500)},{passive:true});
if(tp)tp.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
// live GitHub repos
const rp=document.getElementById('repos');
if(rp){
  const esc=s=>String(s||'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
  let all=[];
  const draw=q=>{const l=all.filter(r=>(r.name+' '+(r.description||'')+' '+(r.language||'')).toLowerCase().includes(q));
    rp.innerHTML=l.length?l.map(r=>`<a class="card repo" href="${esc(r.html_url)}" target="_blank" rel="noopener"><h3>${esc(r.name)}</h3><p>${esc(r.description)||'No description yet.'}</p><div class="meta"><span>${esc(r.language)||'-'}</span><span>&#9733; ${r.stargazers_count}</span><span>Updated ${new Date(r.pushed_at).toLocaleDateString()}</span></div></a>`).join(''):'<p class="note">No matching repositories.</p>'};
  fetch('https://api.github.com/users/chandankmishra2000/repos?sort=pushed&per_page=30').then(r=>{if(!r.ok)throw 0;return r.json()}).then(d=>{all=d.filter(r=>!r.fork);draw('')})
   .catch(()=>{rp.innerHTML='<p class="note">Could not load repositories right now. <a style="color:var(--aqua)" href="https://github.com/chandankmishra2000?tab=repositories" target="_blank" rel="noopener">Open GitHub</a></p>'});
  const rs=document.getElementById('rsearch');if(rs)rs.addEventListener('input',()=>draw(rs.value.toLowerCase()));
}
// scrollspy: highlight the nav link of the section in view
(function(){
  const links=[...document.querySelectorAll('nav a[href^="#"]')];if(!links.length)return;
  const secs=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  function spy(){
    const y=scrollY+120;let cur=secs[0];
    for(const s of secs){if(s.offsetTop<=y)cur=s}
    if(innerHeight+scrollY>=document.documentElement.scrollHeight-4)cur=secs[secs.length-1];
    links.forEach(a=>{const on=a.getAttribute('href')==='#'+cur.id;a.classList.toggle('on',on);on?a.setAttribute('aria-current','true'):a.removeAttribute('aria-current')});
  }
  addEventListener('scroll',spy,{passive:true});addEventListener('resize',spy);spy();
  // keep the address bar in sync without jumping
  let t;addEventListener('scroll',()=>{clearTimeout(t);t=setTimeout(()=>{const a=document.querySelector('nav a.on');if(a&&history.replaceState)history.replaceState(null,'',a.getAttribute('href')==='#home'?location.pathname:a.getAttribute('href'))},150)},{passive:true});
})();
addEventListener('keydown',e=>{if(e.key==='Escape'){const u=document.querySelector('nav ul');u&&u.classList.remove('open')}});
