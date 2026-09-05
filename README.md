# CrossCountry Staff App — Offline PWA

This version is a Progressive Web App (PWA).

## What it does
- Can be installed on compatible Android and iPhone/iPad devices.
- Runs in a standalone app-style window.
- Caches the app shell for offline use after it has been loaded once.
- Includes all requested Staff App pages except “Design instructions”.

## Important
PWAs require the app to be served from a web server using HTTPS (or from localhost during development). Opening `index.html` directly from the phone's file manager will not enable reliable service-worker installation or offline caching.

## Android
1. Host the files on an HTTPS website.
2. Open the app in Chrome.
3. Choose **Install app** or **Add to Home screen**.
4. Open it once while online so the offline files are cached.

## iPhone / iPad
1. Host the files on an HTTPS website.
2. Open the app in Safari.
3. Tap **Share**.
4. Choose **Add to Home Screen**.
5. Open it from the Home Screen.

## Included files
- index.html
- styles.css
- app.js
- manifest.webmanifest
- service-worker.js
- icons/
