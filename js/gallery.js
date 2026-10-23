document.addEventListener('DOMContentLoaded',()=>{
  const cards=[...document.querySelectorAll('.photo-card')];
  const box=document.getElementById('lightbox'), img=document.getElementById('lightbox-image'), caption=document.getElementById('lightbox-caption');
  if(!cards.length||!box)return;
  let index=0;
  cards.forEach((card,i)=>{
    const path=card.dataset.photo;
    const image=new Image();
    image.onload=()=>{card.querySelector('.photo-placeholder')?.remove();image.alt=card.dataset.caption;card.prepend(image);};
    image.onerror=()=>{}; // Keep a clear placeholder when no personal photo has been added.
    image.src=path;
    card.addEventListener('click',()=>open(i));
  });
  function open(i){index=i;const card=cards[index];img.src=card.dataset.photo;img.alt=card.dataset.caption;caption.textContent=card.dataset.caption;box.hidden=false;document.body.style.overflow='hidden';}
  function close(){box.hidden=true;document.body.style.overflow='';img.src='';}
  function step(n){index=(index+n+cards.length)%cards.length;open(index)}
  box.querySelector('.lightbox-close').addEventListener('click',close);
  box.querySelector('.lightbox-prev').addEventListener('click',()=>step(-1));
  box.querySelector('.lightbox-next').addEventListener('click',()=>step(1));
  box.addEventListener('click',e=>{if(e.target===box)close()});
  document.addEventListener('keydown',e=>{if(box.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowRight')step(1);if(e.key==='ArrowLeft')step(-1)});
});
