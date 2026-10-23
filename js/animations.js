(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), {threshold: 0.12});
    revealEls.forEach(el => observer.observe(el));
  }
  window.LoveEffects = {
    burst(origin, count = 24) {
      if (reduced) return;
      const rect = origin.getBoundingClientRect();
      const symbols = ['♥','♡','✦','💗','✿'];
      for (let i=0;i<count;i++) {
        const el = document.createElement('span');
        el.className = 'heart-particle';
        el.textContent = symbols[Math.floor(Math.random()*symbols.length)];
        el.style.left = (rect.left + rect.width/2) + 'px';
        el.style.top = (rect.top + rect.height/2) + 'px';
        el.style.setProperty('--dx', (Math.random()*360-180)+'px');
        el.style.setProperty('--dy', (Math.random()*-300-30)+'px');
        el.style.animationDelay = (Math.random()*.25)+'s';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 2200);
      }
    }
  };
})();
