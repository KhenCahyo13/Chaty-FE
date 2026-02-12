import { getApp, getApps, initializeApp } from 'firebase/app';
import {
    deleteToken,
    getMessaging,
    getToken,
    isSupported,
    onMessage,
} from 'firebase/messaging';

const DEVICE_ID_STORAGE_KEY = 'chaty:web-device-id';
const FIREBASE_MESSAGING_SW_PATH = '/firebase-messaging-sw.js';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
    messagingSenderId: import.meta.env
        .VITE_FIREBASE_MESSAGING_SENDER_ID as string,
    appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};

const rawVapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY as
    | string
    | undefined;

const normalizeVapidKey = (value?: string): string | null => {
    if (!value) return null;

    const normalized = value.trim().replace(/^['"]|['"]$/g, '');
    const hasValidCharacters = /^[A-Za-z0-9_-]+$/.test(normalized);
    if (!hasValidCharacters) return null;

    // Web Push public VAPID key should decode to 65 bytes (uncompressed P-256 public key).
    const base64 = normalized.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');

    try {
        const decoded = atob(paddedBase64);
        if (decoded.length !== 65) return null;
    } catch {
        return null;
    }

    return normalized;
};

const vapidKey = normalizeVapidKey(rawVapidKey);

const firebaseApp =
    getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
let isForegroundListenerInitialized = false;

const getMessagingServiceWorkerPath = (): string => {
    const searchParams = new URLSearchParams({
        apiKey: firebaseConfig.apiKey,
        authDomain: firebaseConfig.authDomain,
        projectId: firebaseConfig.projectId,
        storageBucket: firebaseConfig.storageBucket,
        messagingSenderId: firebaseConfig.messagingSenderId,
        appId: firebaseConfig.appId,
    });

    return `${FIREBASE_MESSAGING_SW_PATH}?${searchParams.toString()}`;
};

const getFirebaseMessagingRegistration =
    async (): Promise<ServiceWorkerRegistration | null> => {
        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
            return null;
        }

        const registrations = await navigator.serviceWorker.getRegistrations();
        const registration =
            registrations.find((item) =>
                item.active?.scriptURL.includes(FIREBASE_MESSAGING_SW_PATH)
            ) ?? null;

        return registration;
    };

export const getOrCreateWebDeviceId = (): string | undefined => {
    if (typeof window === 'undefined' || !window.localStorage) return undefined;

    const existingDeviceId = window.localStorage.getItem(DEVICE_ID_STORAGE_KEY);
    if (existingDeviceId) return existingDeviceId;

    const nextDeviceId = crypto.randomUUID();
    window.localStorage.setItem(DEVICE_ID_STORAGE_KEY, nextDeviceId);

    return nextDeviceId;
};

export const getWebFcmToken = async (): Promise<string | null> => {
    if (typeof window === 'undefined') return null;
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
        return null;
    }
    if (!vapidKey) {
        return null;
    }

    const supported = await isSupported();
    if (!supported) return null;
    if (Notification.permission === 'denied') return null;

    let permission: NotificationPermission = Notification.permission;
    if (permission !== 'granted') {
        permission = await Notification.requestPermission();
    }
    if (permission !== 'granted') return null;

    try {
        const serviceWorkerRegistration =
            await navigator.serviceWorker.register(
                getMessagingServiceWorkerPath()
            );
        await navigator.serviceWorker.ready;
        const messaging = getMessaging(firebaseApp);

        // Recover from stale subscriptions/tokens (common after wrong VAPID key).
        try {
            await deleteToken(messaging);
            const staleSubscription =
                await serviceWorkerRegistration.pushManager.getSubscription();
            if (staleSubscription) {
                await staleSubscription.unsubscribe();
            }
        } catch {
            // Ignore stale cleanup failures and continue requesting a fresh token.
        }

        const token = await getToken(messaging, {
            vapidKey,
            serviceWorkerRegistration,
        });

        return token || null;
    } catch {
        return null;
    }
};

export const hasActiveWebPushSubscription = async (): Promise<boolean> => {
    try {
        const registration = await getFirebaseMessagingRegistration();
        if (!registration) return false;

        const subscription = await registration.pushManager.getSubscription();
        return Boolean(subscription);
    } catch {
        return false;
    }
};

export const initializeForegroundNotificationListener =
    async (): Promise<void> => {
        if (typeof window === 'undefined') return;
        if (!('Notification' in window)) return;
        if (Notification.permission !== 'granted') return;
        if (isForegroundListenerInitialized) return;

        const supported = await isSupported();
        if (!supported) return;

        const messaging = getMessaging(firebaseApp);
        onMessage(messaging, (payload) => {
            const title = payload.notification?.title ?? 'New message';
            const body = payload.notification?.body;
            const icon = payload.notification?.image;

            void navigator.serviceWorker.ready.then((registration) =>
                registration.showNotification(title, {
                    body,
                    icon,
                    data: payload.data,
                })
            );
        });

        isForegroundListenerInitialized = true;
    };
