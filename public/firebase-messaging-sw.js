 
importScripts('https://www.gstatic.com/firebasejs/12.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.9.0/firebase-messaging-compat.js');

const swUrl = new URL(self.location.href);
const firebaseConfig = {
    apiKey: swUrl.searchParams.get('apiKey') ?? '',
    authDomain: swUrl.searchParams.get('authDomain') ?? '',
    projectId: swUrl.searchParams.get('projectId') ?? '',
    storageBucket: swUrl.searchParams.get('storageBucket') ?? '',
    messagingSenderId: swUrl.searchParams.get('messagingSenderId') ?? '',
    appId: swUrl.searchParams.get('appId') ?? '',
};

if (Object.values(firebaseConfig).every(Boolean)) {
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
        const title = payload.notification?.title || 'New message';
        const notificationOptions = {
            body: payload.notification?.body,
            icon: payload.notification?.image || '/vite.svg',
            data: payload.data,
        };

        self.registration.showNotification(title, notificationOptions);
    });
}

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
});
