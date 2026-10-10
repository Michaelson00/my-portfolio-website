# Kelvin Apau, portfolio website

Live at **https://kelvinapau.vercel.app**. A plain HTML, CSS and JavaScript site with no build step, hosted on Vercel.

## Pages

| Page | File |
| --- | --- |
| Home | `index.html` |
| Projects (with the numbers dashboard) | `projects.html` |
| About Me | `about.html` |
| Skills | `skills.html` |
| Experience | `experience.html` |
| Awards | `awards.html` |
| Contact | `contact.html` |
| Not found | `404.html` |

## Files

- `styles.css`: all styling. Dark glass theme, orange accent, Inter font.
- `fx.js`: plasma background and the pulsing gradient bars.
- `intro.js`: the welcome intro on the home page (once per browser session).
- `script.js`: mobile menu, copy-email button, footer year, back-to-top button.
- `dash.js`: tooltips and count-up numbers on the Projects dashboard.
- `portrait.js`, `contact.js`: portrait parallax and the contact message builder.
- `vercel.json`: redirects, security headers, Content Security Policy and caching.
- `sitemap.xml`, `robots.txt`, `site.webmanifest`, icons and `og-image.png`: search and sharing.

## Run it on your computer

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

then visit http://localhost:8000.

## Working on it

- Never commit straight to `master`. Make a branch, push it, and open a pull request.
- Vercel builds a preview for every branch and deploys `master` to production.
- The Content Security Policy in `vercel.json` allows one inline script, the intro flag in the `<head>` of `index.html`, by its hash. If you change that script, update the hash (a browser console message shows the new one).
- If you add a new external service (fonts, analytics), add its address to the Content Security Policy too.

## Credits

Built by Kelvin Apau. Fonts: Inter (SIL Open Font License). Icons: Lucide and Simple Icons.
