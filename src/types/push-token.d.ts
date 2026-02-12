export type DevicePlatform = 'ios' | 'android' | 'web';

export interface RegisterPushTokenPayload {
    fcm_token: string;
    platform: DevicePlatform;
    device_id?: string;
}

export interface PushTokenDeviceResponse {
    id: string;
    platform: DevicePlatform;
    deviceId: string | null;
    isActive: boolean;
    lastSeenAt: string;
}

export interface PushTokenDevice extends PushTokenDeviceResponse {
    fcmToken: string;
}
