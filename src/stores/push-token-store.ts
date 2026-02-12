import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import type { DevicePlatform, PushTokenDevice } from '@/types/push-token';

interface PushTokenStoreState {
    devices: PushTokenDevice[];
    setOrUpdateDevice: (device: PushTokenDevice) => void;
    getByPlatform: (platform: DevicePlatform) => PushTokenDevice | null;
    clearDevices: () => void;
}

export const usePushTokenStore = create<PushTokenStoreState>()(
    devtools(
        persist(
            (set, get) => ({
                devices: [],
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
                getByPlatform: (platform: DevicePlatform) =>
                    get().devices.find(
                        (device) => device.platform === platform
                    ) ?? null,
                clearDevices: () => set({ devices: [] }),
            }),
            {
                name: import.meta.env.VITE_PUSH_TOKEN_STORAGE_KEY,
            }
        )
    )
);
