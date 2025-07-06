// src/js/main.js

// 1) Confetti burst when homeBtn is clicked
const homeBtn = document.getElementById('homeBtn');
homeBtn.addEventListener('click', () => {
  for (let i = 0; i < 20; i++) {
    const conf = document.createElement('div');
    conf.className = 'confetti';
    conf.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;

    const angle = Math.random() * Math.PI * 2;
    const dist  = 40 + Math.random() * 60;
    conf.style.setProperty('--dx',  `${Math.cos(angle) * dist}px`);
    conf.style.setProperty('--dy',  `${Math.sin(angle) * dist}px`);
    conf.style.setProperty('--rot', `${Math.random() * 360}deg`);

    const { width, height, left, top } = homeBtn.getBoundingClientRect();
    conf.style.left = `${left + width / 2}px`;
    conf.style.top  = `${top  + height / 2}px`;

    document.body.appendChild(conf);
    conf.addEventListener('animationend', () => conf.remove());
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const menuBtn    = document.getElementById('menuBtn');
  const sideNav    = document.getElementById('sideNav');
  const scrollCont = document.querySelector('.scroll-container');
  const gradient   = document.getElementById('gradientOverlay');
  const homeBtn    = document.getElementById('homeBtn');

  function openNav() {
    sideNav.classList.add('open');
    scrollCont.classList.add('blurred');
    gradient.classList.add('open');
    homeBtn.classList.add('hidden');
  }

  function closeNav() {
    sideNav.classList.remove('open');
    scrollCont.classList.remove('blurred');
    gradient.classList.remove('open');
    homeBtn.classList.remove('hidden');
  }

  // toggle on menu button
  menuBtn.addEventListener('click', () =>
    sideNav.classList.contains('open') ? closeNav() : openNav()
  );

  // close on backdrop click
  sideNav.addEventListener('click', e => {
    if (e.target === sideNav) closeNav();
  });

  // ↓ AUTO-CLOSE WHEN SECTION LINKS ARE CLICKED ↓
  document
    .querySelectorAll('#sideNav nav ul li a[href^="#section"]')
    .forEach(link =>
      link.addEventListener('click', () => {
        closeNav();
      })
    );
});


document.addEventListener('DOMContentLoaded', () => {
  const carousel   = document.querySelector('.carousel');
  const track      = carousel.querySelector('.carousel__track');
  const THRESHOLD  = 0.3;   // 40% zones on either edge
  const SPEED      = 8;     // px per frame
  let mousePos     = 0;
  let frameId;
  let activeItem   = null;
  let isSnapped    = false; // <-- track whether we've snapped

  // 1. Measure one item’s total width (incl. margins)
  const firstItem  = track.querySelector('.carousel__item');
  const itemRect   = firstItem.getBoundingClientRect();
  const style      = getComputedStyle(firstItem);
  const gap        = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
  const itemWidth  = itemRect.width + gap;

  // 2. Insert invisible padding items before & after
  const blankStart = document.createElement('div');
  blankStart.className        = 'carousel__item blank';
  blankStart.style.width      = `${itemWidth}px`;
  blankStart.style.background = 'transparent';
  track.insertBefore(blankStart, track.firstChild);

  const blankEnd = blankStart.cloneNode();
  track.appendChild(blankEnd);

  // 3. Map mouse X to [0,1]
  carousel.addEventListener('mousemove', e => {
    const { left, width } = carousel.getBoundingClientRect();
    mousePos = (e.clientX - left) / width;
  });

  // 4. On hover, loop-scroll left/right and snap in the center zone
  carousel.addEventListener('mouseenter', () => {
    function loop() {
      if (mousePos < THRESHOLD) {
        track.scrollLeft -= SPEED;
        isSnapped = false;
      }
      else if (mousePos > 1 - THRESHOLD) {
        track.scrollLeft += SPEED;
        isSnapped = false;
      }
      else if (!isSnapped) {
        snapToNearest();
        isSnapped = true;
      }
      frameId = requestAnimationFrame(loop);
    }
    loop();
  });

  // 5. On leave, stop & force a final snap
  carousel.addEventListener('mouseleave', () => {
    cancelAnimationFrame(frameId);
    snapToNearest();
    isSnapped = false;
  });

  // 6. Snap-to-nearest helper
  function snapToNearest() {
    const items       = Array.from(track.querySelectorAll('.carousel__item:not(.blank)'));
    const { left, width } = carousel.getBoundingClientRect();
    const carouselCtr = left + width / 2;

    let closestEl, minDist = Infinity;
    items.forEach(item => {
      const r   = item.getBoundingClientRect();
      const ctr = r.left + r.width / 2;
      const dist = Math.abs(ctr - carouselCtr);
      if (dist < minDist) {
        minDist   = dist;
        closestEl = item;
      }
    });
    if (!closestEl) return;

    // smooth horizontal scroll so this item centers
    const r     = closestEl.getBoundingClientRect();
    const ctr   = r.left + r.width / 2;
    const delta = ctr - carouselCtr;
    track.scrollTo({ left: track.scrollLeft + delta, behavior: 'smooth' });

    // toggle active class for golden glow
    if (activeItem && activeItem !== closestEl) {
      activeItem.classList.remove('active');
    }
    closestEl.classList.add('active');
    activeItem = closestEl;
  }
});
