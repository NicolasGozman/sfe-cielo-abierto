self.addEventListener('install', (e) => {
  console.log('Service Worker instalado');
});

self.addEventListener('fetch', (e) => {
  // Aquí podríamos cachear datos para verlos sin internet
  e.respondWith(fetch(e.request));
});