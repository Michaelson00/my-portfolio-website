/* Welcome intro: name rises in, then the curtain opens. Shown once per browser session. */
(function () {
  var root = document.documentElement;
  var intro = document.getElementById('intro');
  if (!intro || !root.classList.contains('has-intro')) return;

  var skip = document.getElementById('intro-skip');
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
  later(finish, 1900);

  skip.addEventListener('click', finish);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') finish(); });
  intro.addEventListener('click', finish);
})();
