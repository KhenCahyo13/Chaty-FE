import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface PrivateConversationStoreState {
    activePrivateConversationId: string | null;
    setActivePrivateConversationId: (id: string | null) => void;
}

export const usePrivateConversationStore =
    create<PrivateConversationStoreState>()(
        devtools(
            persist(
                (set) => ({
                    activePrivateConversationId: null,
                    setActivePrivateConversationId: (id: string | null) =>
                        set({ activePrivateConversationId: id }),
                }),
                {
                    name: import.meta.env.VITE_PRIVATE_CONVERSATION_STORAGE_KEY,
                }
            )
        )
    );
