/* Portrait: the picture follows the pointer a little, like it is looking out of its frame. */
(function () {
  'use strict';
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  Array.prototype.forEach.call(document.querySelectorAll('[data-portrait]'), function (el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      el.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    });
    el.addEventListener('pointerleave', function () { el.style.setProperty('--px', 0); el.style.setProperty('--py', 0); });
  });
})();
