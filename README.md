# Kelvin Apau, Portfolio Website

Personal portfolio of Kelvin Kwabena Apau, a BSc Data Science and Analytics student at GCTU, Ghana.

Live site: https://kelvinapau.vercel.app

## Pages

- Home (`index.html`)
- About (`about.html`)
- Projects (`projects.html`)
- Skills (`skills.html`)
- Experience (`experience.html`)
- Awards (`awards.html`)
- Contact (`contact.html`)
- 404 (`404.html`)

## Built with

Plain HTML, CSS and JavaScript. There is no build step and no framework.

- `styles.css` holds all the styling.
- `script.js` runs the menu, back-to-top button and page transitions.
- `fx.js` draws the animated background (WebGL).
- `intro.js` and `intro-guard.js` run the welcome animation on the home page.
- `fonts/` holds the self-hosted Inter font.
- `vercel.json` sets the security headers, caching and redirects.

## Run it locally

Open the folder with any simple web server, for example:

```
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Deploy

The site is hosted on Vercel. Merging a pull request into `master` publishes it.

## Notes

- No analytics or tracking is used.
- Fonts are licensed under the SIL Open Font License (see `fonts/Inter-OFL-LICENSE.txt`).
- The text, projects and images belong to Kelvin Apau.
