self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
    const data = event.data?.json() ?? { title: 'New Notification', body: 'You have a new message' };

    const options = {
        body: data.body,
        icon: '/vite.svg', // Placeholder
        badge: '/vite.svg',
        actions: data.actions || [],
        data: data.data || {},
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'view') {
        event.waitUntil(
            self.clients.matchAll({ type: 'window' }).then((clientList) => {
                for (const client of clientList) {
                    if (client.url === '/' && 'focus' in client) return client.focus();
                }
                if (self.clients.openWindow) return self.clients.openWindow('/');
            })
        );
    }
});
