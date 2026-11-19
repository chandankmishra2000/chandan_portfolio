// Data Match: memory game (self-contained)
(function(){
  var bd=document.getElementById('board');if(!bd)return;
  var W=['Python','SQL','NumPy','Keras','Docker','AWS','Flask','Pandas'];
  var lv=6,first=null,lock=false,mv=0,t=0,ti=null,done=0,KEY='dm_best_';
  function $(id){return document.getElementById(id)}
  function best(){try{return localStorage.getItem(KEY+lv)}catch(e){return null}}
  function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),x=a[i];a[i]=a[j];a[j]=x}return a}
  function start(){
    clearInterval(ti);mv=0;t=0;done=0;first=null;lock=false;ti=null;
    $('mv').textContent=0;$('tm').textContent=0;$('bs').textContent=best()||'-';$('win').classList.remove('show');
    bd.style.gridTemplateColumns='repeat('+(lv===6?3:4)+',1fr)';
    var d=[];W.slice(0,lv).forEach(function(w){d.push(w,w)});shuffle(d);
    bd.innerHTML=d.map(function(w){return '<div class="tile" role="button" tabindex="0" aria-label="Hidden tile" data-w="'+w+'"><div class="in"><span class="face f">?</span><span class="face b">'+w+'</span></div></div>'}).join('');
  }
  function flip(el){
    if(!el||lock||el===first||el.classList.contains('ok')||el.classList.contains('up'))return;
    if(!ti)ti=setInterval(function(){t++;$('tm').textContent=t},1000);
    el.classList.add('up');
    if(!first){first=el;return}
    mv++;$('mv').textContent=mv;
    if(first.dataset.w===el.dataset.w){
      first.classList.add('ok');el.classList.add('ok');first=null;done++;
      if(done===lv){
        clearInterval(ti);var b=best();
        if(!b||mv<+b){try{localStorage.setItem(KEY+lv,mv)}catch(e){}}
        $('bs').textContent=best()||mv;
        $('wmsg').textContent='Done in '+mv+' moves and '+t+' seconds.';
        $('win').classList.add('show');
      }
    }else{
      lock=true;var a=first;first=null;
      setTimeout(function(){a.classList.remove('up');el.classList.remove('up');lock=false},750);
    }
  }
  bd.addEventListener('click',function(e){flip(e.target.closest('.tile'))});
  bd.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();flip(e.target.closest('.tile'))}});
  var lvb=document.querySelectorAll('[data-lv]');
  lvb.forEach(function(b){b.addEventListener('click',function(){lvb.forEach(function(x){x.classList.remove('on')});b.classList.add('on');lv=+b.dataset.lv;start()})});
  $('rs').addEventListener('click',start);
  start();
})();
