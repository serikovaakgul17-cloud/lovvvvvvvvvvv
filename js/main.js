document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '×' : '☰';
  });

  // Store editable diary entries locally in this browser.
  document.querySelectorAll('[data-save]').forEach(field => {
    const key = 'love-site-' + field.dataset.save;
    try { field.value = localStorage.getItem(key) || ''; } catch (_) {}
    field.addEventListener('input', () => { try { localStorage.setItem(key, field.value); } catch (_) {} });
  });

  const yes = document.getElementById('yes-button');
  const no = document.getElementById('no-button');
  const response = document.getElementById('yes-response');
  const message = document.getElementById('playful-message');
  if (yes && no && response) {
    const jokes = ['А может, всё-таки да? 🥹','Не-не-не, неправильный ответ! 💗','Я знаю, что ты хочешь нажать «Да» 😏','Жаным, не мучай меня 😂','Попробуй ещё раз… хотя не получится ❤️'];
    let attempts = 0;
    const moveNo = () => {
      attempts++;
      const rect = no.getBoundingClientRect();
      const pad = 12;
      const maxX = Math.max(pad, window.innerWidth - rect.width - pad);
      const maxY = Math.max(pad, window.innerHeight - rect.height - pad);
      no.style.position = 'fixed';
      no.style.left = (pad + Math.random() * Math.max(0, maxX - pad)) + 'px';
      no.style.top = (pad + Math.random() * Math.max(0, maxY - pad)) + 'px';
      no.style.zIndex = '50';
      if (message) message.textContent = jokes[(attempts - 1) % jokes.length];
    };
    no.addEventListener('pointerenter', moveNo);
    no.addEventListener('pointerdown', e => { e.preventDefault(); moveNo(); });
    no.addEventListener('click', e => { e.preventDefault(); moveNo(); });
    no.addEventListener('focus', moveNo);
    yes.addEventListener('click', () => {
      response.hidden = false;
      yes.disabled = true;
      yes.textContent = '💗 Ты сказала «Да»!';
      no.hidden = true;
      if (message) message.hidden = true;
      if (window.LoveEffects) window.LoveEffects.burst(yes, 36);
      response.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'center'});
    });
  }
  const hug = document.getElementById('hug-button');
  const hugMessage = document.getElementById('hug-message');
  if (hug && hugMessage) hug.addEventListener('click', () => {
    hugMessage.hidden = false;
    if (window.LoveEffects) window.LoveEffects.burst(hug, 28);
  });
});
