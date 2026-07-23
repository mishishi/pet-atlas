/**
 * public/sw.js · PWA Service Worker
 *
 * 策略:
 * - 静态资源(JS / CSS / font):CacheFirst(7 天)
 * - Atlas/portrait 图(同域 + TCB):StaleWhileRevalidate(30 天)
 * - HTML 页面:NetworkFirst(2s timeout),fallback 离线页
 */

const CACHE_VERSION = "pet-atlas-v1";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
const PAGE_CACHE = `${CACHE_VERSION}-pages`;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      cache.addAll(["/", "/offline", "/favicon.ico", "/manifest.webmanifest"])
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => !name.startsWith(CACHE_VERSION))
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET") return;

  if (url.hostname.endsWith(".tcb.qcloud.la") || url.hostname.includes("tcb.qcloud.la")) {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
    return;
  }

  if (url.origin === self.location.origin) {
    if (request.destination === "font" || url.pathname.includes("/_next/static/media/")) {
      event.respondWith(cacheFirst(request, STATIC_CACHE));
      return;
    }
    if (request.destination === "image") {
      event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
      return;
    }
    if (url.pathname.startsWith("/_next/static/")) {
      event.respondWith(cacheFirst(request, STATIC_CACHE));
      return;
    }
    if (request.destination === "document" || request.mode === "navigate") {
      event.respondWith(networkFirst(request, PAGE_CACHE));
      return;
    }
  }
});

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    return cached || new Response("offline", { status: 503 });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkFetch = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);
  return cached || networkFetch;
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await Promise.race([
      fetch(request),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 2000)),
    ]);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    return cached || (await cache.match("/offline")) || new Response("offline", { status: 503 });
  }
}
