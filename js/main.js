(function () {
  'use strict';

  /* --- 1. UI Toggles & Intersection Observers --- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => io.observe(el));
  }

  /* --- 2. INTERACTIVE FLOWING CANVAS (GLOBAL) --- */
  const canvas = document.getElementById('flowCanvas');
  const ctx = canvas.getContext('2d');
  let w, h;
  let mouse = { x: -1000, y: -1000 };
  let scrollY = window.scrollY;

  // Mengatur ukuran canvas agar pas dengan layar penuh
  function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Mendengarkan scroll untuk efek parallax gelombang
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  // Mendengarkan pergerakan mouse di seluruh halaman
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  let time = 0;
  // Warna redup agar elegan dan tidak mengganggu konten
  const colors = [
    'rgba(93, 189, 119, 0.15)', // Hijau Muda
    'rgba(76, 165, 71, 0.10)',  // Hijau Tua
    'rgba(133, 214, 154, 0.20)', // Hijau Terang
    'rgba(57, 138, 53, 0.08)',  // Hijau Emerald
    'rgba(212, 244, 217, 0.25)'  // Hijau Soft
  ];

  // Fungsi Loop Animasi (Pelan dan Elegan)
  function animateFlow() {
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(249, 250, 251, 0.02)';
    ctx.fillRect(0, 0, w, h);

    // Membuat efek gelombang yang memenuhi layar vertikal
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.lineWidth = 1 + i * 0.8;
      ctx.strokeStyle = colors[i];
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Posisi dasar garis disebar merata secara vertikal
      let yBase = (h / 6) * (i + 1);

      for (let x = -50; x < w + 50; x += 40) {
        let scrollEffect = scrollY * 0.0015;
        let y = yBase
          + Math.sin(x * 0.002 + time + i + scrollEffect) * (70 + i * 15)
          + Math.cos(x * 0.004 - time * 0.8 + i - scrollEffect) * 40;

        let dx = mouse.x - x;
        let dy = mouse.y - y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 300) {
          let force = Math.pow((300 - distance) / 300, 2);
          y += force * 80 * (dy > 0 ? -1 : 1);
        }

        if (x === -50) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    for (let p = 0; p < 20; p++) {
      let px = (Math.sin(p * 15 + time * 0.5 + scrollY * 0.001) * w / 1.5) + w / 2;
      let py = (Math.cos(p * 25 - time * 0.3 + scrollY * 0.001) * h / 1.5) + h / 2;

      px = ((px % w) + w) % w;
      py = ((py % h) + h) % h;

      ctx.beginPath();
      ctx.arc(px, py, (p % 3) + 1, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(93, 189, 119, 0.4)';
      ctx.fill();
    }

    time += 0.0015;
    requestAnimationFrame(animateFlow);
  }

  animateFlow();
})();