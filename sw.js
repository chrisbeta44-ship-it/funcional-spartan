const CACHE_NAME = 'funcional-spartan-shell-v21-v22-v23-v24-v25-v28-v29-v30-v31-v32-v33';
const APP_SHELL = [
  '/',
  '/admin/index.html',
  '/aluno/index.html',
  '/cadastro/index.html',
  '/styles.css',
  '/assets/file_00000000e6ec820ebe3595590444cd78.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Área do aluno: sempre buscar HTML novo; nunca servir uma tela de login/painel antiga do cache.
  if (request.mode === 'navigate' && (url.pathname === '/aluno' || url.pathname === '/aluno/' || url.pathname === '/aluno/index.html')) {
    event.respondWith(fetch(new Request(request, {cache: 'no-store'})));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      }).catch(() => caches.match(request).then(cached => {
        if (cached) return cached;
        if (url.pathname === '/' || url.pathname === '/index.html') return caches.match('/');
        return new Response(
          '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sem conexão</title><body style="background:#080808;color:#fff;font:16px Arial;padding:32px"><h1>Sem conexão</h1><p>Não foi possível abrir esta tela agora. Verifique sua internet e tente novamente.</p><a style="color:#ff7900" href="/">Voltar ao início</a></body></html>',
          {headers:{'Content-Type':'text/html; charset=utf-8'}}
        );
      }))
    );
    return;
  }

  if (['style', 'script', 'image', 'font'].includes(request.destination)) {
    event.respondWith(
      fetch(request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      }).catch(() => caches.match(request))
    );
  }
});
