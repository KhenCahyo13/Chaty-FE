import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface PrivateConversationStoreState {
    activePrivateConversationId: null | string;
    setActivePrivateConversationId: (id: null | string) => void;
}

export const usePrivateConversationStore =
    create<PrivateConversationStoreState>()(
        devtools(
            persist(
                (set) => ({
                    activePrivateConversationId: null,
                    setActivePrivateConversationId: (id: null | string) =>
                        set({ activePrivateConversationId: id }),
                }),
                {
                    name: import.meta.env.VITE_PRIVATE_CONVERSATION_STORAGE_KEY,
                }
            )
        )
    );
