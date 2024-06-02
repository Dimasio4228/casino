self.addEventListener('fetch', event => {
    if (event.request.url.match(/\.(jpg|gif)$/)) {
        event.respondWith(
            caches.open('my-cache').then(cache => {
                return cache.match(event.request).then(response => {
                    return response || fetch(event.request).then(response => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                });
            })
        );
    }
});