/* Dashboard: count-up numbers, charts that draw in when scrolled to, and hover or focus tooltips. */
(function () {
  'use strict';
  var root = document.getElementById('dv');
  if (!root) return;
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Tooltips */
  var tip = document.getElementById('dv-tip');
  function show(el, x, y) {
    tip.textContent = el.getAttribute('data-tip'); tip.hidden = false;
    var r = root.getBoundingClientRect();
    tip.style.left = Math.min(Math.max(x - r.left, 60), r.width - 60) + 'px';
    tip.style.top = (y - r.top - 14) + 'px';
  }
  root.addEventListener('mousemove', function (e) { var t = e.target.closest('[data-tip]'); if (t) show(t, e.clientX, e.clientY); else tip.hidden = true; });
  root.addEventListener('mouseleave', function () { tip.hidden = true; });
  root.addEventListener('focusin', function (e) { var t = e.target.closest('[data-tip]'); if (t) { var b = t.getBoundingClientRect(); show(t, b.left + b.width / 2, b.top); } });
  root.addEventListener('focusout', function () { tip.hidden = true; });

  /* Count-up */
  var counters = Array.prototype.slice.call(root.querySelectorAll('[data-count]'));
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count')), dec = parseInt(el.getAttribute('data-decimals') || '0', 10), suf = el.getAttribute('data-suffix') || '', t0 = null;
    function step(now) { if (t0 === null) t0 = now; var t = Math.min((now - t0) / 1400, 1); el.textContent = (target * (1 - Math.pow(1 - t, 3))).toFixed(dec) + suf; if (t < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }

  if (still || !('IntersectionObserver' in window)) { root.classList.add('is-in', 'is-static'); return; }
  root.classList.add('is-ready');
  counters.forEach(function (el) { el.textContent = (0).toFixed(parseInt(el.getAttribute('data-decimals') || '0', 10)) + (el.getAttribute('data-suffix') || ''); });
  new IntersectionObserver(function (e, o) {
    if (!e[0].isIntersecting) return;
    o.disconnect(); root.classList.add('is-in'); counters.forEach(countUp);
  }, { threshold: 0.15 }).observe(root);
})();
