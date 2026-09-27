(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const pre = $('#preloader');
  const audio = $('#audio');
  const music = $('#music');
  const musicLabel = $('#musicLabel');
  const begin = $('#begin');
  const gift = $('#gift');
  const giftReveal = $('#giftReveal');
  const envelope = $('#envelope');
  const again = $('#again');

  let musicOn = false;
  let giftOpened = false;
  let audioErrorShown = false;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Startup ---
  window.addEventListener('load', () => {
    setTimeout(() => pre?.classList.add('hide'), 450);
  }, { once: true });

  // --- Music: never throw or spam alerts ---
  async function startMusic() {
    if (!audio) return false;
    try {
      await audio.play();
      musicOn = true;
      music?.classList.add('on');
      music?.setAttribute('aria-pressed', 'true');
      music?.setAttribute('aria-label', 'Matikan musik');
      if (musicLabel) musicLabel.textContent = 'pause';
      return true;
    } catch (error) {
      musicOn = false;
      music?.classList.remove('on');
      music?.setAttribute('aria-pressed', 'false');
      if (musicLabel) musicLabel.textContent = 'musik';
      if (!audioErrorShown) {
        audioErrorShown = true;
        console.info('Audio belum dapat diputar. Pastikan assets/music/betty.mp3 tersedia dan browser mengizinkan audio.');
      }
      return false;
    }
  }

  function stopMusic() {
    if (!audio) return;
    audio.pause();
    musicOn = false;
    music?.classList.remove('on');
    music?.setAttribute('aria-pressed', 'false');
    music?.setAttribute('aria-label', 'Nyalakan musik');
    if (musicLabel) musicLabel.textContent = 'musik';
  }

  music?.addEventListener('click', () => musicOn ? stopMusic() : startMusic());

  begin?.addEventListener('click', () => {
    startMusic();
    scrollToSection('#s1');
  });

  audio?.addEventListener('error', () => {
    music?.classList.remove('on');
    musicOn = false;
    if (musicLabel) musicLabel.textContent = 'musik';
  });

  // --- Smooth section navigation ---
  function scrollToSection(selector) {
    const target = $(selector);
    if (!target) return;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  // --- Gift ---
  gift?.addEventListener('click', () => {
    if (giftOpened) return;
    giftOpened = true;
    gift.classList.add('open');
    giftReveal?.classList.add('show');

    fireworks(innerWidth * 0.5, innerHeight * 0.42, 2);
    heartBurst(34);

    if (!reduceMotion) {
      setTimeout(() => scrollToSection('#s2'), 1550);
    }
  });

  // --- Scroll reveal for every animated section ---
  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('show');
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    revealItems.forEach(el => observer.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add('show'));
  }

  // --- Progress ---
  function updateProgress() {
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - innerHeight);
    const pct = Math.min(100, Math.max(0, (scrollY / max) * 100));
    const bar = $('#progressBar');
    if (bar) bar.style.width = `${pct}%`;
  }
  addEventListener('scroll', updateProgress, { passive: true });
  addEventListener('resize', updateProgress);
  updateProgress();

  // --- Heart silhouette particles ---
  const path = $('#heartPath');
  const dots = $('#heartParticles');

  function buildHeart() {
    if (!path || !dots || typeof path.getTotalLength !== 'function') return;
    const len = path.getTotalLength();
    dots.replaceChildren();

    const width = Math.min(innerWidth * 0.9, 850);
    const height = width * 0.9;
    const count = innerWidth < 600 ? 78 : 140;

    for (let i = 0; i < count; i++) {
      const point = path.getPointAtLength((i / count) * len);
      const dot = document.createElement('span');
      dot.className = 'heart-dot';

      dot.style.left = `calc(50% + ${((point.x / 100) - 0.5) * width}px)`;
      dot.style.top = `calc(50% + ${((point.y / 90) - 0.5) * height}px)`;
      dot.style.animationDelay = `${(i / count) * 2.2}s`;

      dots.appendChild(dot);
    }
  }

  buildHeart();
  addEventListener('resize', buildHeart);

  // --- Birthday countdown ---
  const countdownEls = {
    d: $('#d'), h: $('#h'), m: $('#m'), s: $('#s')
  };
  const status = $('#birthdayStatus');

  function nextBirthdayTarget(now) {
    const year = now.getFullYear();
    const birthday = new Date(year, 9, 13, 0, 0, 0, 0);
    return now < birthday ? birthday : new Date(year + 1, 9, 13, 0, 0, 0, 0);
  }

  function countdown() {
    const now = new Date();
    const thisYear = new Date(now.getFullYear(), 9, 13, 0, 0, 0, 0);
    const next = nextBirthdayTarget(now);

    // On October 13, show the birthday state for the whole calendar day.
    if (
      now.getMonth() === 9 &&
      now.getDate() === 13
    ) {
      ['d','h','m','s'].forEach(key => {
        if (countdownEls[key]) countdownEls[key].textContent = '00';
      });
      if (status) status.textContent = 'HARI INI ADALAH HARIMU ♡';
      return;
    }

    const diff = Math.max(0, next - now);
    let x = diff;

    const days = Math.floor(x / 86400000); x %= 86400000;
    const hours = Math.floor(x / 3600000); x %= 3600000;
    const mins = Math.floor(x / 60000); x %= 60000;
    const secs = Math.floor(x / 1000);

    if (countdownEls.d) countdownEls.d.textContent = String(days).padStart(2, '0');
    if (countdownEls.h) countdownEls.h.textContent = String(hours).padStart(2, '0');
    if (countdownEls.m) countdownEls.m.textContent = String(mins).padStart(2, '0');
    if (countdownEls.s) countdownEls.s.textContent = String(secs).padStart(2, '0');
    if (status) status.textContent = `menuju 13 Oktober ${next.getFullYear()} ♡`;
  }

  countdown();
  setInterval(countdown, 1000);

  // --- Envelope ---
  envelope?.addEventListener('click', () => {
    const open = envelope.classList.toggle('open');
    envelope.setAttribute('aria-expanded', String(open));

    if (open) {
      fireworks(innerWidth * 0.5, innerHeight * 0.42, 2);
      heartBurst(28);
    }
  });

  // --- Restart ---
  again?.addEventListener('click', () => {
    stopMusic();
    if (gift) gift.classList.remove('open');
    if (giftReveal) giftReveal.classList.remove('show');
    if (envelope) {
      envelope.classList.remove('open');
      envelope.setAttribute('aria-expanded', 'false');
    }
    giftOpened = false;
    scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  // --- Heart burst ---
  function heartBurst(amount = 30) {
    if (reduceMotion) return;

    const wrap = document.createElement('div');
    Object.assign(wrap.style, {
      position: 'fixed', inset: '0', zIndex: '75',
      pointerEvents: 'none', overflow: 'hidden'
    });

    for (let i = 0; i < amount; i++) {
      const particle = document.createElement('i');
      particle.textContent = Math.random() > 0.18 ? '♥' : '✦';

      const x = (Math.random() - 0.5) * 95;
      const y = (Math.random() - 0.5) * 80;
      const size = 10 + Math.random() * 22;
      const color = Math.random() > 0.45 ? '#ff8fab' : '#ffd98a';

      particle.style.cssText = `
        position:absolute;left:50%;top:45%;
        font-style:normal;font-size:${size}px;color:${color};
        --x:${x}vw;--y:${y}vh;
        animation:heartOut 1.6s cubic-bezier(.1,.8,.2,1) forwards;
        animation-delay:${Math.random() * .2}s;
      `;
      wrap.appendChild(particle);
    }

    document.body.appendChild(wrap);
    setTimeout(() => wrap.remove(), 1900);
  }

  // --- Canvas particles + fireworks ---
  const canvas = $('#fx');
  const ctx = canvas?.getContext('2d', { alpha: true });

  let W = 0, H = 0, DPR = 1;
  let ambient = [];
  let shots = [];

  function sizeCanvas() {
    if (!canvas || !ctx) return;
    W = innerWidth;
    H = innerHeight;
    DPR = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function fireworks(x, y, bursts = 1) {
    if (!ctx || reduceMotion) return;

    for (let b = 0; b < bursts; b++) {
      const ox = x + (Math.random() - 0.5) * 100;
      const oy = y + (Math.random() - 0.5) * 70;
      const count = innerWidth < 600 ? 70 : 120;

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.12;
        const speed = 2 + Math.random() * 5.2;

        shots.push({
          x: ox, y: oy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 75 + Math.random() * 45,
          max: 120,
          r: 1 + Math.random() * 1.8,
          color: Math.random() > 0.5 ? '#ff8fab' : '#ffd98a'
        });
      }
    }
  }

  function drawLoop() {
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);

    const ambientTarget = innerWidth < 600 ? 35 : 70;
    while (ambient.length < ambientTarget) {
      ambient.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 0.5 + Math.random() * 1.3,
        a: 0.12 + Math.random() * 0.3,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1
      });
    }

    ambient.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.globalAlpha = p.a;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    shots = shots.filter(p => p.life > 0);

    shots.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.985;
      p.vy = p.vy * 0.985 + 0.035;
      p.life--;

      ctx.globalAlpha = Math.max(0, p.life / p.max);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(drawLoop);
  }

  sizeCanvas();
  addEventListener('resize', sizeCanvas);
  drawLoop();

  // Animation-only keyframes for burst particles.
  const dynamicStyle = document.createElement('style');
  dynamicStyle.textContent = `
    @keyframes heartOut{
      to{transform:translate(var(--x),var(--y)) rotate(300deg) scale(.1);opacity:0}
    }
  `;
  document.head.appendChild(dynamicStyle);
})();
