import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import type { DevicePlatform, PushTokenDevice } from '@/types/push-token';

interface PushTokenStoreState {
    clearDevices: () => void;
    devices: PushTokenDevice[];
    getByPlatform: (platform: DevicePlatform) => null | PushTokenDevice;
    setOrUpdateDevice: (device: PushTokenDevice) => void;
}

export const usePushTokenStore = create<PushTokenStoreState>()(
    devtools(
        persist(
            (set, get) => ({
                clearDevices: () => set({ devices: [] }),
                devices: [],
                getByPlatform: (platform: DevicePlatform) =>
                    get().devices.find(
                        (device) => device.platform === platform
                    ) ?? null,
                setOrUpdateDevice: (device: PushTokenDevice) =>
                    set((state) => {
                        const nextDevices = state.devices.filter(
                            (item) =>
                                item.id !== device.id &&
                                item.platform !== device.platform &&
                                item.fcmToken !== device.fcmToken
                        );

                        return { devices: [...nextDevices, device] };
                    }),
            }),
            {
                name: import.meta.env.VITE_PUSH_TOKEN_STORAGE_KEY,
            }
        )
    )
);
