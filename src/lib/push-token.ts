import { registerPushToken } from '@/api/push-token';
import {
    getOrCreateWebDeviceId,
    getWebFcmToken,
    hasActiveWebPushSubscription,
    initializeForegroundNotificationListener,
} from '@/lib/firebase-messaging';
import { usePushTokenStore } from '@/stores/push-token-store';

let registerWebPushTokenPromise: Promise<void> | null = null;

const runRegisterCurrentWebPushToken = async (): Promise<void> => {
    try {
        const existingDevice = usePushTokenStore
            .getState()
            .getByPlatform('web');
        const hasActiveSubscription = await hasActiveWebPushSubscription();

        if (existingDevice?.fcmToken && hasActiveSubscription) {
            await initializeForegroundNotificationListener();
            return;
        }

        const fcmToken = await getWebFcmToken();
        if (!fcmToken) return;

        const pushTokenResponse = await registerPushToken({
            fcm_token: fcmToken,
            platform: 'web',
            device_id: getOrCreateWebDeviceId(),
        });

        usePushTokenStore.getState().setOrUpdateDevice({
            ...pushTokenResponse.data,
            fcmToken,
        });
        await initializeForegroundNotificationListener();
    } catch {
        // Ignore push-token errors to keep login/session flow unaffected.
    }
};

export const registerCurrentWebPushToken = async (): Promise<void> => {
    if (!registerWebPushTokenPromise) {
        registerWebPushTokenPromise = runRegisterCurrentWebPushToken().finally(
            () => {
                registerWebPushTokenPromise = null;
            }
        );
    }

    return registerWebPushTokenPromise;
};
