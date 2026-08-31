const CACHE="xc_train_manager_app_v119";const ASSETS=[
"./","./index.html","./tir-builder.html","./commission-calculator.html","./notepad.html","./delay-repay.html",
"./delay-repay-qr.png","./report-defects.html","./help.html","./help-guide.png","./report-defects.png","./btp-61016.png",
"./reservations.png","./incident-notes.png","./passenger-counts.png","./book-off-late.png","./delay.png","./delay-report.html",
"./book-off-late.html","./passenger-counts.html","./incident-notes.html","./reservations.html","./btp-61016.html",
"./xc-staff-app-icon.jpg","./crosscountry-logo-white.png","./crosscountry-logo-transparent.png","./crosscountry-logo-white.png",
"./xc-staff-app-splash.jpg","./btp-logo.png","./manifest.json","./xc.css","./xc-common.js","./xc-staff-app-mark.svg","./xc-logo.svg"
];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET")return;
 e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{if(r.ok){let x=r.clone();caches.open(CACHE).then(c=>c.put(e.request,x))}return r}).catch(()=>caches.match("./index.html"))))
});