import { create } from 'zustand';

export interface ComponentsStateStore {
    openCallDialog: boolean;
    openProfileDialog: boolean;
    openUserListDialog: boolean;
    setOpenCallDialog: (open: boolean) => void;
    setOpenProfileDialog: (open: boolean) => void;
    setOpenUserListDialog: (open: boolean) => void;
}

export const useComponentsStore = create<ComponentsStateStore>((set) => ({
    openCallDialog: false,
    openProfileDialog: false,
    openUserListDialog: false,
    setOpenCallDialog: (open: boolean) => set({ openCallDialog: open }),
    setOpenProfileDialog: (open: boolean) => set({ openProfileDialog: open }),
    setOpenUserListDialog: (open: boolean) => set({ openUserListDialog: open }),
}));
