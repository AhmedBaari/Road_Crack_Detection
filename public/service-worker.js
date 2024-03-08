importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js"
);

// ...

workbox.core.setCacheNameDetails({ prefix: "my-pwa" });

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

workbox.routing.registerRoute(
    new RegExp("/*"),
    new workbox.strategies.NetworkOnly() // Use NetworkOnly strategy to bypass cache
);
