/* Welcome intro: types a greeting, then lifts away. Shown once per browser session. */
(function () {
  var root = document.documentElement;
  var intro = document.getElementById('intro');
  if (!intro || !root.classList.contains('has-intro')) return;

  var text = document.getElementById('intro-text');
  var skip = document.getElementById('intro-skip');
  var phrase = 'Hi, I’m Kelvin.';
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

  // type the greeting, driven by the animation clock so it never stutters
  var start = null, typeFrom = 1000, perChar = 60;
  function type(now) {
    if (done) return;
    if (start === null) start = now;
    var n = Math.min(phrase.length, Math.max(0, Math.floor((now - start - typeFrom) / perChar)));
    if (text.textContent.length !== n) text.textContent = phrase.slice(0, n);
    if (n < phrase.length) requestAnimationFrame(type);
  }
  requestAnimationFrame(type);

  // finish automatically
  later(finish, 2700);

  skip.addEventListener('click', finish);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') finish(); });
  intro.addEventListener('click', finish);
  skip.focus({ preventScroll: true });
})();
