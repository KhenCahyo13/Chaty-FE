import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import type { ActivePrivateCall } from '@/types/realtime';

interface PrivateCallStoreState {
    activePrivateCall: ActivePrivateCall | null;
    clearActivePrivateCall: () => void;
    setActivePrivateCall: (call: ActivePrivateCall) => void;
}

export const usePrivateCallStore = create<PrivateCallStoreState>()(
    devtools(
        persist(
            (set) => ({
                activePrivateCall: null,
                clearActivePrivateCall: () => set({ activePrivateCall: null }),
                setActivePrivateCall: (call: ActivePrivateCall) =>
                    set({ activePrivateCall: call }),
            }),
            {
                name: import.meta.env.VITE_PRIVATE_CALL_STORAGE_KEY!,
            }
        )
    )
);
