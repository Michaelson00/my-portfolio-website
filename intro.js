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
    // remove from the page once the slide-up has played
    later(function () { root.classList.remove('has-intro', 'intro-done'); intro.remove(); }, 1500);
  }

  // type the greeting
  var i = 0;
  function type() {
    if (done) return;
    text.textContent = phrase.slice(0, ++i);
    if (i < phrase.length) later(type, 55);
  }
  later(type, 1000);

  // finish automatically
  later(finish, 2600);

  skip.addEventListener('click', finish);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') finish(); });
  intro.addEventListener('click', finish);
  skip.focus({ preventScroll: true });
})();
