export type DevicePlatform = 'android' | 'ios' | 'web';

export interface RegisterPushTokenPayload {
    device_id?: string;
    fcm_token: string;
    platform: DevicePlatform;
}

export interface PushTokenDeviceResponse {
    deviceId: null | string;
    id: string;
    isActive: boolean;
    lastSeenAt: string;
    platform: DevicePlatform;
}

export interface PushTokenDevice extends PushTokenDeviceResponse {
    fcmToken: string;
}
