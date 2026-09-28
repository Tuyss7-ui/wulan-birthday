const pinInput = document.getElementById('pin');
const loginForm = document.getElementById('loginForm');
const message = document.getElementById('message');
const loginCard = document.getElementById('loginCard');
const galleryScreen = document.getElementById('galleryScreen');
const app = document.getElementById('app');
const photoViewer = document.getElementById('photoViewer');
const viewerImage = document.getElementById('viewerImage');
const viewerCaption = document.getElementById('viewerCaption');
const loginHearts = document.getElementById('loginHearts');
const TOTAL_LOVES = 36;
const loveFragment = document.createDocumentFragment();
const loveWords = [];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

for (let i = 0; i < TOTAL_LOVES; i += 1) {
  const love = document.createElement('div');
  love.className = 'love';
  const word = document.createElement('span');
  word.className = 'love-word';
  word.textContent = 'I love you';

  love.appendChild(word);
  loveFragment.appendChild(love);
  loveWords.push(love);
}

loginHearts.appendChild(loveFragment);

function animateLovePath(timestamp) {
  const width = Math.min(window.innerWidth * 0.84, 850);
  const height = Math.min(window.innerHeight * 0.84, 750);
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const elapsed = reducedMotion.matches ? 0 : timestamp / 30000;

  loveWords.forEach((love, index) => {
    const angle = (index / TOTAL_LOVES + elapsed) * Math.PI * 2;
    const sin = Math.sin(angle);
    const heartX = 16 * sin * sin * sin;
    const heartY = 13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle);
    love.style.left = `${centerX + (heartX / 17) * (width / 2)}px`;
    love.style.top = `${centerY - (heartY / 17) * (height / 2)}px`;
  });

  window.requestAnimationFrame(animateLovePath);
}

window.requestAnimationFrame(animateLovePath);

const pinDots = [...document.querySelectorAll('#pinDots span')];

function updatePinDots() {
  pinDots.forEach((dot, index) => {
    dot.classList.toggle('is-filled', index < pinInput.value.length);
  });
}

pinInput.addEventListener('input', () => {
  pinInput.value = pinInput.value.replace(/\D/g, '').slice(0, 8);
  updatePinDots();
  if (pinInput.value.length === 8) loginForm.requestSubmit();
});

document.querySelectorAll('.number-pad button[data-key]').forEach((button) => {
  button.addEventListener('click', () => {
    if (pinInput.value.length < 8) {
      pinInput.value += button.dataset.key;
      updatePinDots();
      if (pinInput.value.length === 8) loginForm.requestSubmit();
    }
  });
});

document.querySelector('[data-action="clear"]').addEventListener('click', () => {
  pinInput.value = '';
  updatePinDots();
  message.textContent = '';
  message.classList.remove('error');
});

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  message.className = 'message';

  if (pinInput.value !== '00000000') {
    message.textContent = 'PIN salah. Coba lagi.';
    message.classList.add('error');
    pinInput.value = '';
    updatePinDots();
    return;
  }

  loginCard.hidden = true;
  galleryScreen.hidden = false;
  app.classList.add('gallery-mode');
  updatePhotoCarousel();
  resizeHeartCanvas();
  window.requestAnimationFrame(animateHeartParticles);
});

const photoOrbit = document.querySelector('.photo-orbit');
const photoCards = [...document.querySelectorAll('.photo-card')];
const heartCanvas = document.getElementById('heartCanvas');
const heartContext = heartCanvas.getContext('2d');
const heartParticles = Array.from({ length: 120 }, (_, index) => ({
  angle: (index / 120) * Math.PI * 2,
  size: 1 + Math.random() * 1.5,
  phase: Math.random() * Math.PI * 2,
  previousX: null,
  previousY: null,
}));
let heartCanvasWidth = 0;
let heartCanvasHeight = 0;
const surpriseSlider = document.getElementById('surpriseSlider');
const celebrationParty = document.getElementById('celebrationParty');
const partyParticles = document.getElementById('partyParticles');
const sliderHint = document.getElementById('sliderHint');
const lastHeart = document.getElementById('lastHeart');
const letterDialog = document.getElementById('letterDialog');
const envelopeStage = document.getElementById('envelopeStage');
const letterPaper = document.getElementById('letterPaper');
const bookCover = document.getElementById('bookCover');
const bookSpreads = [...document.querySelectorAll('.book-spread')];
const previousSpread = document.getElementById('previousSpread');
const nextSpread = document.getElementById('nextSpread');
const spreadCounter = document.getElementById('spreadCounter');
let activeSpread = 0;
let spreadSwipeStart = null;
let activePhoto = 0;
let renderedPhoto = 0;
let partyTimeout;
const CELEBRATION_DURATION = 5000;
let dragStartX = null;
let suppressPhotoClickUntil = 0;

function resizeHeartCanvas() {
  const bounds = galleryScreen.getBoundingClientRect();
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
  heartCanvasWidth = bounds.width;
  heartCanvasHeight = bounds.height;
  heartCanvas.width = Math.round(bounds.width * pixelRatio);
  heartCanvas.height = Math.round(bounds.height * pixelRatio);
  heartContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function animateHeartParticles(timestamp) {
  heartContext.clearRect(0, 0, heartCanvasWidth, heartCanvasHeight);
  const time = reducedMotion.matches ? 0 : timestamp;
  const pulse = 1 + Math.sin(time / 700) * 0.035;
  const centerX = heartCanvasWidth / 2;
  const centerY = heartCanvasHeight * 0.51;
  const scaleX = Math.min(heartCanvasWidth * 0.39, heartCanvasHeight * 0.48) * pulse;
  const scaleY = heartCanvasHeight * 0.32 * pulse;
  const flow = time * 0.000035;

  heartParticles.forEach((particle) => {
    const angle = particle.angle + flow;
    const sin = Math.sin(angle);
    const x = centerX + 16 * sin ** 3 / 17 * scaleX;
    const curveY = 13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle);
    const y = centerY - curveY / 19 * scaleY;
    const twinkle = 0.45 + (Math.sin(time / 450 + particle.phase) + 1) * 0.25;

    if (particle.previousX !== null) {
      heartContext.beginPath();
      heartContext.moveTo(particle.previousX, particle.previousY);
      heartContext.lineTo(x, y);
      heartContext.strokeStyle = `rgba(255, 130, 184, ${twinkle * 0.28})`;
      heartContext.lineWidth = particle.size * 0.7;
      heartContext.stroke();
    }

    heartContext.beginPath();
    heartContext.arc(x, y, particle.size * (0.8 + twinkle * 0.45), 0, Math.PI * 2);
    heartContext.fillStyle = `rgba(255, 205, 228, ${twinkle})`;
    heartContext.shadowColor = 'rgba(255, 105, 170, 0.9)';
    heartContext.shadowBlur = 9;
    heartContext.fill();
    particle.previousX = x;
    particle.previousY = y;
  });

  heartContext.shadowBlur = 0;
  window.requestAnimationFrame(animateHeartParticles);
}

function setBookSpread(index) {
  activeSpread = Math.max(0, Math.min(index, bookSpreads.length - 1));
  bookSpreads.forEach((spread, spreadIndex) => {
    const isActive = spreadIndex === activeSpread;
    spread.classList.toggle('is-active', isActive);
    spread.setAttribute('aria-hidden', String(!isActive));
    if (isActive) spread.scrollTop = 0;
  });
  previousSpread.disabled = activeSpread === 0;
  nextSpread.disabled = activeSpread === bookSpreads.length - 1;
  spreadCounter.textContent = `${activeSpread + 1} / ${bookSpreads.length}`;
}

previousSpread.addEventListener('click', () => setBookSpread(activeSpread - 1));
nextSpread.addEventListener('click', () => setBookSpread(activeSpread + 1));

letterPaper.addEventListener('pointerdown', (event) => {
  if (event.target.closest('button')) return;
  spreadSwipeStart = { x: event.clientX, y: event.clientY };
  letterPaper.setPointerCapture(event.pointerId);
});

letterPaper.addEventListener('pointerup', (event) => {
  if (!spreadSwipeStart) return;
  const deltaX = event.clientX - spreadSwipeStart.x;
  const deltaY = event.clientY - spreadSwipeStart.y;
  spreadSwipeStart = null;

  if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
    setBookSpread(activeSpread + (deltaX < 0 ? 1 : -1));
  }
});

letterPaper.addEventListener('pointercancel', () => {
  spreadSwipeStart = null;
});

letterPaper.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') setBookSpread(activeSpread + 1);
  if (event.key === 'ArrowLeft') setBookSpread(activeSpread - 1);
});

surpriseSlider.addEventListener('input', () => {
  activePhoto = Number(surpriseSlider.value);
  updatePhotoCarousel();
});

function showCelebration() {
  const partyEmojis = ['🌸', '🌷', '🌼', '💐', '💖', '💕', '❤️', '🎂', '🧁'];
  partyParticles.replaceChildren();

  for (let i = 0; i < 50; i += 1) {
    const item = document.createElement('span');
    item.className = 'party-item';
    item.textContent = partyEmojis[Math.floor(Math.random() * partyEmojis.length)];
    item.style.setProperty('--x', `${Math.random() * 96 + 2}%`);
    item.style.setProperty('--y', `${Math.random() * 92 + 4}%`);
    item.style.setProperty('--size', `${Math.round(20 + Math.random() * 18)}px`);
    item.style.setProperty('--drift', `${Math.round((Math.random() - 0.5) * 150)}px`);
    partyParticles.appendChild(item);
  }

  window.clearTimeout(partyTimeout);
  lastHeart.hidden = true;
  celebrationParty.style.setProperty('--party-duration', `${CELEBRATION_DURATION}ms`);
  celebrationParty.hidden = false;
  celebrationParty.setAttribute('aria-hidden', 'false');
  partyTimeout = window.setTimeout(() => {
    celebrationParty.hidden = true;
    celebrationParty.setAttribute('aria-hidden', 'true');
    lastHeart.hidden = false;
  }, CELEBRATION_DURATION);
}

lastHeart.addEventListener('click', () => {
  lastHeart.hidden = true;
  envelopeStage.hidden = false;
  letterPaper.hidden = true;
  letterDialog.showModal();
});

document.getElementById('openLetter').addEventListener('click', () => {
  envelopeStage.hidden = true;
  letterPaper.hidden = false;
  letterPaper.classList.remove('is-open');
  bookCover.setAttribute('aria-expanded', 'false');
  setBookSpread(0);

  const particles = document.getElementById('bookParticles');
  const loveEmojis = ['♡', '♥', '💕', '✨', '🌸'];
  particles.replaceChildren();

  for (let i = 0; i < 34; i += 1) {
    const particle = document.createElement('span');
    particle.className = 'book-particle';
    particle.textContent = loveEmojis[Math.floor(Math.random() * loveEmojis.length)];
    particle.style.setProperty('--x', `${Math.random() * 100}%`);
    particle.style.setProperty('--y', `${Math.random() * 100}%`);
    particle.style.setProperty('--size', `${15 + Math.random() * 13}px`);
    particle.style.setProperty('--delay', `${Math.random() * -7}s`);
    particle.style.setProperty('--duration', `${5 + Math.random() * 5}s`);
    particles.appendChild(particle);
  }
});

bookCover.addEventListener('click', () => {
  letterPaper.classList.add('is-open');
  bookCover.setAttribute('aria-expanded', 'true');
});

document.querySelectorAll('.memory-photo img').forEach((image) => {
  const markMissingPhoto = () => image.closest('.memory-photo').classList.add('is-empty');
  image.addEventListener('error', markMissingPhoto);
  if (image.complete && image.naturalWidth === 0) markMissingPhoto();
});

document.getElementById('letterClose').addEventListener('click', () => {
  letterDialog.close();
});

function updatePhotoCarousel() {
  const step = Math.min(photoOrbit.clientWidth * 0.4, 300);
  const finalPhotoIndex = photoCards.length - 1;
  const reachedFinalPhoto = activePhoto === finalPhotoIndex && renderedPhoto !== finalPhotoIndex;
  renderedPhoto = activePhoto;
  const surpriseUnlocked = activePhoto === finalPhotoIndex;
  surpriseSlider.value = String(activePhoto);
  sliderHint.textContent = surpriseUnlocked
    ? 'Kejutan terbuka! Selamat ulang tahun! 🎉'
    : `Foto ${activePhoto + 1} dari ${photoCards.length}`;

  if (reachedFinalPhoto) showCelebration();

  photoCards.forEach((card, index) => {
    let offset = index - activePhoto;
    if (offset > photoCards.length / 2) offset -= photoCards.length;
    if (offset < -photoCards.length / 2) offset += photoCards.length;

    const distance = Math.abs(offset);
    const scale = Math.max(0.58, 1 - distance * 0.12);
    card.style.transform = `translate(-50%, -50%) translate3d(${offset * step}px, 0, ${-distance * 90}px) rotateY(${-offset * 32}deg) scale(${scale})`;
    card.style.zIndex = String(10 - distance);
    card.style.opacity = distance > 3 ? '0' : distance === 0 ? '1' : String(Math.max(0.28, 0.52 - distance * 0.07));
    card.style.pointerEvents = distance > 3 ? 'none' : 'auto';
    card.classList.toggle('is-active', offset === 0);
    card.setAttribute('aria-current', offset === 0 ? 'true' : 'false');
  });
}

photoOrbit.addEventListener('pointerdown', (event) => {
  if (event.button !== undefined && event.button !== 0) return;
  dragStartX = event.clientX;
});

window.addEventListener('pointerup', (event) => {
  if (dragStartX === null) return;
  const distance = event.clientX - dragStartX;
  dragStartX = null;

  if (Math.abs(distance) > 8) suppressPhotoClickUntil = Date.now() + 400;
  if (Math.abs(distance) < 40) return;

  const steps = Math.max(1, Math.round(Math.abs(distance) / 100));
  activePhoto = (activePhoto + (distance < 0 ? steps : -steps) + photoCards.length * 10) % photoCards.length;
  updatePhotoCarousel();
});

window.addEventListener('pointercancel', () => {
  dragStartX = null;
});

window.addEventListener('resize', () => {
  updatePhotoCarousel();
  if (!galleryScreen.hidden) resizeHeartCanvas();
});

photoCards.forEach((card, index) => {
  const image = card.querySelector('img');
  image.addEventListener('load', () => card.classList.add('has-photo'));
  image.addEventListener('error', () => card.classList.remove('has-photo'));

  card.addEventListener('click', () => {
    if (Date.now() < suppressPhotoClickUntil) return;

    if (index !== activePhoto) {
      activePhoto = index;
      updatePhotoCarousel();
      return;
    }

    const hasPhoto = image.complete && image.naturalWidth > 0;
    viewerImage.hidden = !hasPhoto;

    if (hasPhoto) {
      viewerImage.src = image.src;
      viewerCaption.textContent = image.alt;
    } else {
      viewerCaption.textContent = `Tambahkan ${image.getAttribute('src')} ke project untuk mengisi foto ini.`;
    }

    photoViewer.showModal();
  });
});

updatePhotoCarousel();

document.querySelector('.viewer-close').addEventListener('click', () => {
  photoViewer.close();
});

photoViewer.addEventListener('click', (event) => {
  if (event.target === photoViewer) photoViewer.close();
});
