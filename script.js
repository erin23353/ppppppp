/* ===================================
   BIRTHDAY — INTERACTIVE JS
   Slang Copy, Trail FX, Nav, Modals
   =================================== */

(function () {
  'use strict';

  // ─── CONFIG ───
  const BIRTH_DATE = '2008-10-14'; // 18 years old in 2026
  const MESSAGE = [
    ' .',
    '',
    'Halowww i think its been a year since i tried to approach you \'but its okay, aku cuma mau lu itu happy\'',
    '',
    'it turns out i am still undecided between have moved on and still being stuck somewhere in the past.somedays i tell myself that im finally okay,that your name bo longer echoes through my mind the way it used to.',
    '',
    'but then i catch myself looking back again,searching for traces of u,making sure u still exist somewhere beyond the distance between us.',
    '','lil message malah yapping hehehehehe.soo yeah happy level up audreyyyy.'
    
  ].join('\n');

  // ─── AGE (hardcoded to avoid timezone issues) ───
  const AGE = 18;
  const ageEl = document.getElementById('age-num');
  if (ageEl) ageEl.textContent = AGE;

  // ─── MOUSE TRAIL FX ───
  const tCanvas = document.getElementById('trail-canvas');
  const tCtx = tCanvas ? tCanvas.getContext('2d') : null;
  let trailParticles = [];
  function resizeTrail() {
    if (!tCanvas) return;
    tCanvas.width = window.innerWidth;
    tCanvas.height = window.innerHeight;
  }
  resizeTrail();
  window.addEventListener('resize', resizeTrail);

  function createSparkle(x, y) {
    if(trailParticles.length > 40) trailParticles.shift();
    trailParticles.push({
      x: x, y: y,
      size: Math.random() * 3 + 1,
      alpha: 1,
      vy: (Math.random() - 0.5) * 2 - 1,
      vx: (Math.random() - 0.5) * 2
    });
  }
  
  function drawTrail() {
    if(!tCtx) return;
    tCtx.clearRect(0, 0, tCanvas.width, tCanvas.height);
    for (let i = trailParticles.length - 1; i >= 0; i--) {
      let p = trailParticles[i];
      p.x += p.vx; p.y += p.vy;
      p.alpha -= 0.02;
      if (p.alpha <= 0) { trailParticles.splice(i, 1); continue; }
      tCtx.globalAlpha = p.alpha;
      tCtx.fillStyle = '#f4a0b5';
      tCtx.beginPath();
      tCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      tCtx.fill();
    }
    requestAnimationFrame(drawTrail);
  }
  drawTrail();

  document.addEventListener('mousemove', (e) => {
    if(Math.random() > 0.3) createSparkle(e.clientX, e.clientY);
  }, { passive: true });
  document.addEventListener('touchmove', (e) => {
    if(Math.random() > 0.3) createSparkle(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  // ─── SURPRISE LOADING START ───
  const sStart = document.getElementById('surprise-start');
  const sText = document.getElementById('loading-text');
  const funFact = document.getElementById('fun-fact');
  const factOkBtn = document.getElementById('fact-ok');
  const landing = document.getElementById('landing');
  const deck = document.getElementById('deck');
  
  // Fake terminal sequence
  const fakeLogs = [
    "intercepting secure connection...",
    "bypassing firewalls...",
    "downloading memories...",
    "decrypting vibes...",
    "access granted."
  ];
  
  let logIdx = 0;
  if(sStart) {
    const logInterval = setInterval(() => {
      logIdx++;
      if(logIdx < fakeLogs.length) {
        sText.textContent = fakeLogs[logIdx];
      } else {
        clearInterval(logInterval);
        setTimeout(() => {
          sStart.classList.add('gone');
          setTimeout(() => {
            sStart.style.display = 'none';
            // Show fun fact first instead of landing
            funFact.classList.remove('hidden');
          }, 1000);
        }, 500);
      }
    }, 800);
  }

  // ─── MUSIC SETUP ───
  const musicBtn = document.getElementById('music-btn');
const bgMusic = document.getElementById('bg-music');
let playing = false;

function setMusicState(nextState) {
  if (musicBtn && bgMusic) {
    musicBtn.addEventListener('click', () => {
      if (!bgMusic.src && bgMusic.querySelectorAll('source').length === 0) return;
      if (playing) { bgMusic.pause(); musicBtn.classList.remove('on'); }
      else { bgMusic.play().catch(()=>{}); musicBtn.classList.add('on'); }
      playing = !playing;
    });
  }
}

  // Dismiss Fun Fact -> Show Landing & Play Music
  if (factOkBtn) {
    factOkBtn.addEventListener('click', () => {
      
      // Auto-play music upon first interaction to bypass browser restrictions
      if (bgMusic && !playing) {
        bgMusic.play().catch(e => console.log('Autoplay blocked:', e));
        musicBtn.classList.add('on');
        playing = true;
      }

      funFact.classList.add('hidden');
      setTimeout(() => {
        funFact.style.display = 'none';
        landing.classList.remove('hidden');
      }, 800);
    });
  }

  // ─── LANDING -> DECK ───
  let landingDismissed = false;
  function openDeck() {
    if (landingDismissed) return;
    landingDismissed = true;
    landing.classList.add('gone');
    setTimeout(() => {
      landing.style.display = 'none';
      deck.classList.remove('hidden');
      document.getElementById('music-btn').classList.add('vis');
      initDeck();
    }, 800);
  }

  window.addEventListener('wheel', openDeck, { once: true, passive: true });
  window.addEventListener('keydown', (e) => { if (!landingDismissed && (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter')) openDeck(); });
  let touchStartY = 0;
  landing.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; }, { passive: true });
  landing.addEventListener('touchend', (e) => { if (e.changedTouches[0].clientY < touchStartY - 30) openDeck(); });
  landing.addEventListener('click', openDeck);

  // ─── DECK & NAV ───
  const cards = document.querySelectorAll('.card');
  const total = cards.length;
  let cur = 0;

  const dotsContainer = document.getElementById('dots');
  const counterEl = document.getElementById('nav-counter');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');

  for (let i = 0; i < total; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    dotsContainer.appendChild(dot);
  }
  const dotEls = dotsContainer.querySelectorAll('.dot');

  function updateUI() {
    cards.forEach((c, i) => {
      c.classList.remove('active', 'left', 'right');
      if (i === cur) c.classList.add('active');
      else if (i < cur) c.classList.add('left');
      else c.classList.add('right');
    });
    dotEls.forEach((d, i) => { d.classList.toggle('active', i === cur); });
    counterEl.textContent = (cur + 1) + ' / ' + total;
    
    btnPrev.disabled = cur === 0;
    btnNext.disabled = cur === total - 1;
    btnNext.style.opacity = cur === total - 1 ? '0' : '1';
  }

  function goTo(idx) {
    if (idx < 0 || idx >= total) return;
    cur = idx; updateUI(); triggerFx(cur);
  }
  function initDeck() { updateUI(); triggerFx(0); }

  btnPrev.addEventListener('click', () => goTo(cur - 1));
  btnNext.addEventListener('click', () => goTo(cur + 1));

  // ─── SWIPE DRAG (3D PAGE FLIP) ───
  let dragStart = null, dragCard = null, dragging = false;
  function pointerDown(e) {
    if(e.target.tagName.toLowerCase() === 'button' || e.target.closest('button') || e.target.closest('.bottomnav') || e.target.closest('.flip') || e.target.closest('.track')) return;
    dragStart = e.clientX || (e.touches && e.touches[0].clientX);
    dragCard = cards[cur]; dragging = true; dragCard.classList.add('dragging');
  }
  function pointerMove(e) {
    if (!dragging || !dragCard) return;
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const diff = x - dragStart;
    
    let rotateDeg = (diff / window.innerWidth) * 90;
    if(rotateDeg > 60) rotateDeg = 60;
    if(rotateDeg < -60) rotateDeg = -60;
    
    dragCard.style.transform = `rotateY(${rotateDeg}deg) translateZ(${Math.abs(rotateDeg)}px)`;
  }
  function pointerUp(e) {
    if (!dragging || !dragCard) return;
    dragging = false; dragCard.classList.remove('dragging');
    const x = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
    const diff = x - dragStart;
    dragCard.style.transform = '';
    
    if (diff < -60) goTo(cur + 1);
    else if (diff > 60) goTo(cur - 1);
    dragStart = null; dragCard = null;
  }
  
  const cardContainer = document.getElementById('cards-container');
  cardContainer.addEventListener('mousedown', pointerDown);
  cardContainer.addEventListener('mousemove', pointerMove);
  window.addEventListener('mouseup', pointerUp);
  cardContainer.addEventListener('touchstart', (e) => pointerDown(e.touches[0]), { passive: true });
  cardContainer.addEventListener('touchmove', (e) => pointerMove(e.touches[0]), { passive: true });
  window.addEventListener('touchend', (e) => pointerUp(e.changedTouches[0]));

  // ─── FX TRIGGERS ───
  let typed = false;
  function triggerFx(idx) {
    if (idx === 0) confetti();
    if (idx === 2 && !typed) { typed = true; typewriter(); } 
    if (idx === 7) startKesan();
    if (idx === 8) revealWishes();
  }

  // PHOTO TAP -> CONFETTI BURST
  const photoTap = document.getElementById('photo-tap');
  const tapMe = document.getElementById('tap-me');
  if (photoTap) {
    photoTap.addEventListener('click', () => {
      confetti();
      if (tapMe) tapMe.classList.add('gone');
    });
  }

  // CONFETTI + FIREWORKS (MASSIVE)
  function confetti() {
    const c = document.querySelector('[data-fx="confetti"]');
    if (!c) return;
    const ctx = c.getContext('2d');
    // Use full viewport for bigger fireworks
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    c.style.position = 'fixed';
    c.style.inset = '0';
    c.style.zIndex = '999';
    c.style.pointerEvents = 'none';
    const ps = [];
    const cols = ['#f4a0b5', '#fde4ec', '#e87da0', '#ffffff', '#ffd6e7', '#ffb6c1', '#ff69b4'];
    
    // Create multiple burst waves
    function createBurst(cx, cy, count) {
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const speed = 3 + Math.random() * 8;
        const shape = Math.random(); // 0-0.5 = rect, 0.5-0.8 = circle, 0.8-1 = star
        ps.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          s: Math.random() * 6 + 2,
          col: cols[~~(Math.random() * cols.length)],
          rot: Math.random() * 360,
          rs: (Math.random() - 0.5) * 12,
          a: 1,
          shape: shape,
          gravity: 0.08 + Math.random() * 0.12,
          friction: 0.98 + Math.random() * 0.01
        });
      }
    }
    
    // Initial big burst from center
    createBurst(c.width / 2, c.height * 0.4, 80);
    
    // Delayed side bursts
    setTimeout(() => createBurst(c.width * 0.25, c.height * 0.3, 40), 200);
    setTimeout(() => createBurst(c.width * 0.75, c.height * 0.3, 40), 350);
    setTimeout(() => createBurst(c.width * 0.5, c.height * 0.25, 30), 500);
    
    function draw() {
      ctx.clearRect(0, 0, c.width, c.height);
      let alive = false;
      ps.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= p.friction;
        p.rot += p.rs;
        p.a -= 0.005;
        if (p.a <= 0) return;
        alive = true;
        ctx.save();
        ctx.globalAlpha = p.a;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * 0.0174);
        ctx.fillStyle = p.col;
        
        if (p.shape < 0.5) {
          // Rectangle confetti
          ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.5);
        } else if (p.shape < 0.8) {
          // Circle confetti
          ctx.beginPath();
          ctx.arc(0, 0, p.s / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Star sparkle
          const spikes = 4; const outerR = p.s / 2; const innerR = outerR * 0.4;
          ctx.beginPath();
          for (let j = 0; j < spikes * 2; j++) {
            const r = j % 2 === 0 ? outerR : innerR;
            const a = (j * Math.PI) / spikes;
            ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
          }
          ctx.closePath(); ctx.fill();
        }
        ctx.restore();
      });
      if (alive) requestAnimationFrame(draw);
    }
    draw();
  }

  // TYPEWRITER
  function typewriter() {
    const el = document.getElementById('typed-text');
    const sign = document.getElementById('msg-sign');
    el.textContent = '';
    let i = 0;
    function next() {
      if (i < MESSAGE.length) {
        el.textContent += MESSAGE[i]; i++;
        setTimeout(next, 30 + Math.random() * 20);
      } else {
        setTimeout(() => sign.classList.add('show'), 500);
      }
    }
    setTimeout(next, 400);
  }

  // SCRATCH
  const sc = document.getElementById('scratch-canvas');
  if (sc) {
    const ctx = sc.getContext('2d');
    ctx.fillStyle = 'rgba(238, 233, 227, 0.9)';
    ctx.fillRect(0, 0, sc.width, sc.height);
    ctx.fillStyle = '#8b7d7b';
    ctx.font = 'italic 14px "Lora"';
    ctx.textAlign = 'center';
    ctx.fillText('scratch to reveal ♡', sc.width / 2, sc.height / 2);
    ctx.globalCompositeOperation = 'destination-out';
    let drawing = false;
    function scratchDraw(e) {
      if (!drawing) return;
      const r = sc.getBoundingClientRect();
      const sx = sc.width / r.width, sy = sc.height / r.height;
      const cx = ((e.clientX || e.pageX) - r.left) * sx;
      const cy = ((e.clientY || e.pageY) - r.top) * sy;
      ctx.beginPath(); ctx.arc(cx, cy, 24, 0, 6.28); ctx.fill();
    }
    sc.addEventListener('mousedown', () => drawing = true);
    sc.addEventListener('mouseup', () => drawing = false);
    sc.addEventListener('mouseleave', () => drawing = false);
    sc.addEventListener('mousemove', scratchDraw);
    sc.addEventListener('touchstart', (e) => { drawing = true; scratchDraw(e.touches[0]); }, { passive: true });
    sc.addEventListener('touchend', () => drawing = false);
    sc.addEventListener('touchmove', (e) => scratchDraw(e.touches[0]), { passive: true });
  }

  // KESAN CAROUSEL
  let kesanTimer;
  function startKesan() {
    const items = document.querySelectorAll('.kesan');
    const nav = document.getElementById('kesan-dots');
    if (nav.children.length === 0) {
      items.forEach((_, i) => {
        const d = document.createElement('div');
        d.className = 'kdot' + (i === 0 ? ' active' : '');
        d.addEventListener('click', () => { kesanGo(i); clearInterval(kesanTimer); });
        nav.appendChild(d);
      });
    }
    const dots = nav.querySelectorAll('.kdot');
    let ci = 0;
    function kesanGo(idx) {
      ci = idx;
      items.forEach((it, j) => it.classList.toggle('active', j === ci));
      dots.forEach((d, j) => d.classList.toggle('active', j === ci));
    }
    clearInterval(kesanTimer);
    kesanTimer = setInterval(() => kesanGo((ci + 1) % items.length), 3500);
  }

  // WISHES
  function revealWishes() {
    const ws = document.querySelectorAll('.wish');
    ws.forEach(w => w.classList.remove('show'));
    ws.forEach((w, i) => setTimeout(() => w.classList.add('show'), 200 + i * 400));
  }

  // HOLD
  const holdBtn = document.getElementById('hold-btn');
  const ringFill = document.getElementById('ring-fill');
  const holdMsg = document.getElementById('hold-msg');
  const holdLabel = document.getElementById('hold-label');
  const circumference = 2 * Math.PI * 46; 
  let holdInterval, holdPct = 0;

  if (ringFill) {
    ringFill.style.strokeDasharray = circumference;
    ringFill.style.strokeDashoffset = circumference;
  }
  function holdStart(e) {
    e.preventDefault();
    clearInterval(holdInterval);
    holdInterval = setInterval(() => {
      holdPct = Math.min(holdPct + 1.5, 100);
      ringFill.style.strokeDashoffset = circumference - (holdPct / 100) * circumference;
      holdLabel.textContent = Math.round(holdPct) + '%';
      if (holdPct >= 100) {
        clearInterval(holdInterval);
        holdBtn.classList.add('done');
        holdMsg.classList.add('show');
      }
    }, 20);
  }
  function holdEnd() {
    clearInterval(holdInterval);
    if (holdPct < 100) {
      holdPct = 0;
      ringFill.style.strokeDashoffset = circumference;
      holdLabel.textContent = 'hold';
    }
  }
  if (holdBtn) {
    holdBtn.addEventListener('mousedown', holdStart);
    holdBtn.addEventListener('touchstart', holdStart);
    window.addEventListener('mouseup', holdEnd);
    window.addEventListener('touchend', holdEnd);
  }

  // FINAL SURPRISE MODAL
  const magicBtn = document.getElementById('btn-magic');
  const modal = document.getElementById('surprise-modal');
  const modalClose = document.getElementById('modal-close');
  
  if (magicBtn) {
    magicBtn.addEventListener('click', () => {
      // Small fake flash effect
      const flash = document.createElement('div');
      flash.style.position = 'fixed'; flash.style.inset = '0';
      flash.style.background = '#fff'; flash.style.zIndex = '9999';
      flash.style.transition = 'opacity 0.5s';
      document.body.appendChild(flash);
      setTimeout(() => { flash.style.opacity = '0'; modal.classList.remove('hidden'); }, 100);
      setTimeout(() => flash.remove(), 600);
    });
  }
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.classList.add('hidden');
    });   
  }   
})();   
