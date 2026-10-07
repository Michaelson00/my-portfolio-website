/* ============================================================
   MEMPHIS PORTFOLIO — script.js
   Copy email, footer year, and the scroll-drawn timeline line.
   Confetti motion is pure CSS keyframes.
   ============================================================ */

(function () {
  'use strict';

  /* ---- Theme toggle (sun / moon) ---- */
  var themeBtn = document.getElementById('theme-toggle');
  var rootEl = document.documentElement;
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var showTheme = function (t) {
    rootEl.setAttribute('data-theme', t);
    if (themeMeta) themeMeta.setAttribute('content', t === 'dark' ? '#0b0b0c' : '#f7f7f5');
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
      themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
  };

  var savedTheme = null;
  try { savedTheme = localStorage.getItem('theme'); } catch (e) {}
  showTheme(rootEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = rootEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      if (!reducedMotion) {
        rootEl.classList.add('theme-fade');
        setTimeout(function () { rootEl.classList.remove('theme-fade'); }, 500);
      }
      showTheme(next);
      savedTheme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* ---- Footer year ---- */
  var yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Mobile menu ---- */
  var navEl = document.querySelector('.nav');
  var navToggle = document.querySelector('.nav__toggle');

  if (navEl && navToggle) {
    var setMenu = function (open) {
      navEl.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    navToggle.addEventListener('click', function () {
      setMenu(!navEl.classList.contains('is-open'));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
    document.addEventListener('click', function (e) {
      if (!navEl.contains(e.target)) setMenu(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 720) setMenu(false);
    });
  }

  /* ---- Copy email ---- */
  var copyBtn = document.getElementById('copy-btn');
  var copyStatus = document.getElementById('copy-status');
  var copyTimer = null;

  if (copyBtn && copyStatus) {
    copyBtn.addEventListener('click', function () {
      var email = 'kelvinapau00@gmail.com';
      if (copyTimer) clearTimeout(copyTimer);

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () {
          copyStatus.textContent = 'Email address copied';
          copyTimer = setTimeout(function () { copyStatus.textContent = ''; }, 3500);
        }).catch(function () {
          copyStatus.textContent = 'Could not copy. Select the address and copy it by hand.';
          copyTimer = setTimeout(function () { copyStatus.textContent = ''; }, 3500);
        });
      } else {
        copyStatus.textContent = 'Could not copy. Select the address and copy it by hand.';
        copyTimer = setTimeout(function () { copyStatus.textContent = ''; }, 3500);
      }
    });
  }

  /* ---- Analysis dashboard: staged entrance + count-up numbers ---- */
  var dash = document.getElementById('dash');

  if (dash && 'IntersectionObserver' in window &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var counters = Array.prototype.slice.call(dash.querySelectorAll('[data-count]'));

    var countUp = function (el, delay) {
      var target = parseFloat(el.getAttribute('data-count'));
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1400;
      var start = null;

      var step = function (now) {
        if (start === null) start = now;
        var t = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (t < 1) requestAnimationFrame(step);
      };

      el.textContent = (0).toFixed(decimals) + suffix;
      setTimeout(function () { requestAnimationFrame(step); }, delay);
    };

    // Hide first, so the content is only visible if JS can reveal it
    dash.classList.add('anim-ready');
    counters.forEach(function (el) {
      var suffix = el.getAttribute('data-suffix') || '';
      el.textContent = (0).toFixed(parseInt(el.getAttribute('data-decimals') || '0', 10)) + suffix;
    });

    var dashObserver = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      dashObserver.disconnect();
      dash.classList.add('is-visible');
      counters.forEach(function (el) {
        var panel = el.closest('.dash__panel');
        var i = panel ? parseInt(panel.style.getPropertyValue('--i'), 10) || 0 : 0;
        countUp(el, 350 + i * 150);
      });
    }, { threshold: 0.2 });
    dashObserver.observe(dash);
  }

  /* ---- "Where next?" cards: timeline-style line + zoom in/out with scroll ---- */
  var exGrid = document.getElementById('explore-grid');
  var exSvg = exGrid && exGrid.querySelector('.explore__svg');

  if (exGrid && exSvg) {
    var SVG_NS = 'http://www.w3.org/2000/svg';
    var exTrack = exSvg.querySelector('.explore__track');
    var exProgress = exSvg.querySelector('.explore__progress');
    var exHead = exSvg.querySelector('.explore__head');
    var exCards = Array.prototype.slice.call(exGrid.querySelectorAll('.explore__card'));
    var exReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var EX_X = 14;      // line position, from the grid's left edge
    var EX_WAVE = 12;   // sideways swing of the squiggle
    var EX_DOT_Y = 34;  // dot height, from the top of its card
    var exDots = [], exYs = [], exTotal = 0, exTicking = false;

    // one dot per card, created once; the head is moved to the end so it sits on top
    exCards.forEach(function () {
      var dot = document.createElementNS(SVG_NS, 'circle');
      dot.setAttribute('class', 'explore__dot');
      dot.setAttribute('r', 9);
      exSvg.insertBefore(dot, exHead);
      exDots.push(dot);
    });

    var exLengthAtY = function (y) {
      var lo = 0, hi = exTotal;
      for (var i = 0; i < 14; i++) {
        var mid = (lo + hi) / 2;
        if (exProgress.getPointAtLength(mid).y < y) lo = mid; else hi = mid;
      }
      return hi;
    };

    var exBuild = function () {
      exYs = exCards.map(function (c) { return c.offsetTop + EX_DOT_Y; });

      // One S-curve between each pair of dots, alternating direction (same as the timeline)
      var d = 'M' + EX_X + ' ' + exYs[0];
      for (var i = 0; i < exYs.length - 1; i++) {
        var s = i % 2 === 0 ? 1 : -1;
        var y0 = exYs[i], h = exYs[i + 1] - y0;
        d += ' C' + (EX_X + s * EX_WAVE) + ' ' + (y0 + h * 0.3) + ' ' +
                    (EX_X + s * EX_WAVE) + ' ' + (y0 + h * 0.7) + ' ' + EX_X + ' ' + exYs[i + 1];
      }
      exTrack.setAttribute('d', d);
      exProgress.setAttribute('d', d);
      exSvg.setAttribute('width', EX_X * 2);
      exSvg.setAttribute('height', exGrid.offsetHeight);
      exDots.forEach(function (dot, i) {
        dot.setAttribute('cx', EX_X);
        dot.setAttribute('cy', exYs[i]);
      });

      exTotal = exProgress.getTotalLength();
      exProgress.style.strokeDasharray = exTotal;
      exGrid.classList.add('is-live');
      exUpdate();
    };

    var exUpdate = function () {
      exTicking = false;
      if (!exTotal) return;
      var vh = window.innerHeight;

      // Line: drawn down to wherever 60% of the viewport sits in the list
      var y = exReduce ? Infinity : vh * 0.6 - exGrid.getBoundingClientRect().top;
      var len = y <= exYs[0] ? 0 : exLengthAtY(Math.min(y, exYs[exYs.length - 1]));
      exProgress.style.strokeDashoffset = exTotal - len;
      exProgress.style.opacity = len > 0 ? 1 : 0;
      var tip = exProgress.getPointAtLength(len);
      exHead.setAttribute('cx', tip.x);
      exHead.setAttribute('cy', tip.y);
      exHead.style.opacity = len > 0 && !exReduce ? 1 : 0;

      exCards.forEach(function (card, i) {
        var reached = y >= exYs[i];
        card.classList.toggle('is-reached', reached);
        exDots[i].classList.toggle('is-reached', reached);

        // Zoom in towards the middle of the screen, back out as it leaves
        var r = card.getBoundingClientRect();
        var off = Math.abs(r.top + r.height / 2 - vh / 2) / (vh / 2);
        var f = Math.max(0, Math.min(1, 1 - off));
        var e = f * f * (3 - 2 * f);
        card.style.setProperty('--zoom', exReduce ? 1 : (0.9 + 0.14 * e).toFixed(3));
      });
    };

    var exOnScroll = function () {
      if (!exTicking) { exTicking = true; requestAnimationFrame(exUpdate); }
    };

    exBuild();
    window.addEventListener('scroll', exOnScroll, { passive: true });
    window.addEventListener('resize', exBuild);
    window.addEventListener('load', exBuild);
    if (window.ResizeObserver) new ResizeObserver(exBuild).observe(exGrid);
  }
  /* ---- "Built with" ticker: repeat the tools to fill the bar, then loop ---- */
  var logos = document.getElementById('logostrip-logos');
  var logoTrack = logos && logos.querySelector('.logostrip__track');
  var logoGroup = logoTrack && logoTrack.querySelector('.logostrip__group');

  if (logoGroup && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var logoSpans = Array.prototype.slice.call(logoGroup.children);
    var SPEED = 50; // pixels per second

    var buildTicker = function () {
      // Reset to the original set, then add copies until one group spans the bar
      logos.classList.add('is-marquee');
      while (logoTrack.children.length > 1) logoTrack.removeChild(logoTrack.lastChild);
      while (logoGroup.children.length > logoSpans.length) logoGroup.removeChild(logoGroup.lastChild);

      var guard = 0;
      while (logoGroup.offsetWidth < logos.clientWidth && guard++ < 20) {
        logoSpans.forEach(function (s) {
          var copy = s.cloneNode(true);
          copy.setAttribute('aria-hidden', 'true');
          logoGroup.appendChild(copy);
        });
      }

      // Second identical group makes translateX(-50%) a seamless loop
      var twin = logoGroup.cloneNode(true);
      twin.setAttribute('aria-hidden', 'true');
      logoTrack.appendChild(twin);

      logos.style.setProperty('--marquee-time', (logoGroup.offsetWidth / SPEED) + 's');
    };

    var tickerTimer = null;
    buildTicker();
    window.addEventListener('load', buildTicker); // fonts change widths
    window.addEventListener('resize', function () {
      clearTimeout(tickerTimer);
      tickerTimer = setTimeout(buildTicker, 150);
    });
  }

  /* ---- Timeline: journey line draws itself with scroll ---- */
  var list = document.getElementById('timeline-list');
  var svg = list && list.querySelector('.timeline__svg');

  if (list && svg && svg.getElementsByTagName('path')[1].getTotalLength) {
    var track = svg.querySelector('.timeline__track');
    var progress = svg.querySelector('.timeline__progress');
    var head = svg.querySelector('.timeline__head');
    var items = Array.prototype.slice.call(list.querySelectorAll('.timeline__item'));
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var X = 11;          // centre of the dots, from the list's left edge
    var WAVE = 12;       // sideways swing of the squiggle
    var DOT_CENTRE = 13; // dot centre, from the top of its item
    var TRIGGER = 0.6;   // line "draws" where this fraction of the viewport is
    var ys = [], total = 0, ticking = false;

    // Length along the (top-to-bottom) path at which it reaches height y
    var lengthAtY = function (y) {
      var lo = 0, hi = total;
      for (var i = 0; i < 14; i++) {
        var mid = (lo + hi) / 2;
        if (progress.getPointAtLength(mid).y < y) lo = mid; else hi = mid;
      }
      return hi;
    };

    var build = function () {
      ys = items.map(function (it) { return it.offsetTop + DOT_CENTRE; });
      if (ys.length < 2) return;

      // One S-curve between each pair of dots, alternating direction
      var d = 'M' + X + ' ' + ys[0];
      for (var i = 0; i < ys.length - 1; i++) {
        var s = i % 2 === 0 ? 1 : -1;
        var y0 = ys[i], h = ys[i + 1] - y0;
        d += ' C' + (X + s * WAVE) + ' ' + (y0 + h * 0.3) + ' ' +
                    (X + s * WAVE) + ' ' + (y0 + h * 0.7) + ' ' + X + ' ' + ys[i + 1];
      }
      track.setAttribute('d', d);
      progress.setAttribute('d', d);
      svg.setAttribute('width', X * 2);
      svg.setAttribute('height', list.offsetHeight);

      total = progress.getTotalLength();
      progress.style.strokeDasharray = total;
      list.classList.add('is-drawn');
      update();
    };

    var update = function () {
      ticking = false;
      if (!total) return;

      // Where the draw line sits, in list coordinates
      var y = reduceMotion
        ? Infinity
        : window.innerHeight * TRIGGER - list.getBoundingClientRect().top;
      var len = y <= ys[0] ? 0 : lengthAtY(Math.min(y, ys[ys.length - 1]));

      progress.style.strokeDashoffset = total - len;
      progress.style.opacity = len > 0 ? 1 : 0;

      var tip = progress.getPointAtLength(len);
      head.setAttribute('cx', tip.x);
      head.setAttribute('cy', tip.y);
      head.style.opacity = len > 0 && !reduceMotion ? 1 : 0;

      items.forEach(function (it, i) {
        it.classList.toggle('is-reached', y >= ys[i]);
      });
    };

    var onScroll = function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };

    build();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', build);
    window.addEventListener('load', build); // web fonts can change item heights
    if (window.ResizeObserver) new ResizeObserver(build).observe(list);
  }

})();
