// 3D rotating neural-network sphere (no libraries)
(function(){
  const c=document.getElementById('scene');if(!c)return;
  const x=c.getContext('2d');let W,H,mx=0,my=0,ang=0;
  const N=window.innerWidth<700?70:130,pts=[];
  for(let i=0;i<N;i++){const y=1-2*(i+.5)/N,r=Math.sqrt(1-y*y),t=Math.PI*(1+Math.sqrt(5))*i;pts.push([Math.cos(t)*r,y,Math.sin(t)*r]);}
  function size(){W=c.width=innerWidth;H=c.height=innerHeight}
  size();addEventListener('resize',size);
  addEventListener('mousemove',e=>{mx=(e.clientX/W-.5);my=(e.clientY/H-.5)});
  function frame(){
    x.clearRect(0,0,W,H);ang+=.003;
    const R=Math.min(W,H)*(W<700?.42:.34),cx=W>900?W*.72:W/2,cy=H*.5;
    const ay=ang+mx*.8,ax=my*.6,P=[];
    for(const p of pts){
      const a=p[0],b=p[1],d=p[2];
      const x1=a*Math.cos(ay)-d*Math.sin(ay),z1=a*Math.sin(ay)+d*Math.cos(ay);
      const y1=b*Math.cos(ax)-z1*Math.sin(ax),z2=b*Math.sin(ax)+z1*Math.cos(ax);
      const s=1/(1.8-z2*.5);P.push([cx+x1*R*s*1.3,cy+y1*R*s*1.3,z2]);
    }
    x.lineWidth=.6;
    const lim=(R*.32)**2;
    for(let i=0;i<N;i++)for(let j=i+1;j<N;j++){
      const dx=P[i][0]-P[j][0],dy=P[i][1]-P[j][1],d=dx*dx+dy*dy;
      if(d<lim){x.strokeStyle=`rgba(47,184,201,${.28*(1-d/lim)})`;x.beginPath();x.moveTo(P[i][0],P[i][1]);x.lineTo(P[j][0],P[j][1]);x.stroke();}
    }
    for(const p of P){const a=.35+.65*(p[2]+1)/2;x.fillStyle=p[2]>0?`rgba(56,217,230,${a})`:`rgba(255,138,76,${a*.7})`;x.beginPath();x.arc(p[0],p[1],1.5+p[2]*1.6+1.2,0,7);x.fill();}
    requestAnimationFrame(frame);
  }
  if(!matchMedia('(prefers-reduced-motion:reduce)').matches)frame();
})();
