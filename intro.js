/* Welcome intro: name rises in, then the curtain opens. Shown once per browser session. */
(function () {
  var root = document.documentElement;
  var intro = document.getElementById('intro');
  if (!intro || !root.classList.contains('has-intro')) return;

  var skip = document.getElementById('intro-skip');

  // 15 gradient bars, tallest at the edges and shortest in the middle (same shape as the call-to-action band)
  var N = 15;
  intro.querySelectorAll('.intro__bars').forEach(function (box) {
    var html = '';
    for (var i = 0; i < N; i++) {
      var d = Math.abs(i / (N - 1) - 0.5) * 2;
      var s = (0.3 + 0.7 * Math.pow(d, 1.2)) * 0.8; // 0.8 keeps the bars clear of the name
      html += '<span style="--s:' + s.toFixed(3) + ';--in:' + (0.05 + Math.abs(i - (N - 1) / 2) * 0.03).toFixed(2) + 's"></span>';
    }
    box.innerHTML = html;
  });
  var done = false;
  var timers = [];

  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

  function finish() {
    if (done) return;
    done = true;
    timers.forEach(clearTimeout);
    try { sessionStorage.setItem('intro-seen', '1'); } catch (e) {}
    root.classList.add('intro-done');
    window.dispatchEvent(new Event('intro:done'));
    // remove from the page once the slide-up has played
    later(function () { root.classList.remove('has-intro', 'intro-done'); intro.remove(); }, 2400);
  }

  // finish automatically
  later(finish, 2300);

  skip.addEventListener('click', finish);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') finish(); });
  intro.addEventListener('click', finish);
})();
