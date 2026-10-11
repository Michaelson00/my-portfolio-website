/* Runs before the page paints: show the welcome intro only on the first visit of a session, and never with reduced motion. */
try { if (!sessionStorage.getItem('intro-seen') && !matchMedia('(prefers-reduced-motion: reduce)').matches) document.documentElement.classList.add('has-intro'); } catch (e) {}
