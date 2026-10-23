document.addEventListener('DOMContentLoaded', () => {
 const intro=document.getElementById('final-intro'), surprise=document.getElementById('final-surprise');
 const yes=document.getElementById('final-yes'), no=document.getElementById('final-no'), fireworks=document.getElementById('photo-fireworks');
 no.addEventListener('click',()=>{window.location.href='index.html';});
 yes.addEventListener('click',()=>{intro.hidden=true;surprise.hidden=false;makePhotoFireworks();surprise.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});});
 function makePhotoFireworks(){
  const paths=['assets/images/photo-5.jpeg','assets/images/photo-6.jpeg','assets/images/photo-7.jpeg','assets/images/photo-8.jpeg'];let valid=[],pending=paths.length;
  paths.forEach(path=>{const im=new Image();im.onload=()=>{valid.push(path);if(--pending===0)launch(valid)};im.onerror=()=>{if(--pending===0)launch(valid)};im.src=path;});
  function launch(images){const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches,total=reduced?12:34;
   for(let i=0;i<total;i++){const item=document.createElement(images.length?'img':'span');item.className='firework-photo';if(images.length){item.src=images[i%images.length];item.alt='';}else{item.textContent=['♥','♡','💗','✦','🌸'][i%5];item.classList.add('firework-heart');}
    const angle=Math.random()*Math.PI*2,distance=120+Math.random()*Math.min(window.innerWidth*.42,330);item.style.setProperty('--x',Math.cos(angle)*distance+'px');item.style.setProperty('--y',Math.sin(angle)*distance+'px');item.style.setProperty('--rot',(Math.random()*60-30)+'deg');item.style.setProperty('--delay',(Math.random()*.8)+'s');item.style.left=(8+Math.random()*84)+'%';item.style.top=(12+Math.random()*76)+'%';fireworks.appendChild(item);
   }
   if(window.LoveEffects)window.LoveEffects.burst(yes,30);
  }
 }
});