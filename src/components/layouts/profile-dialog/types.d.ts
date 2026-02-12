import type { useForm } from '@tanstack/react-form';
import type z from 'zod';

import type { UserList } from '@/types/user';

import type { updateProfileSchema } from './schema';

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

export interface ProfileDialogViewProps {
    avatarPreviewUrl?: string;
    form: ReturnType<typeof useForm<UpdateProfileFormValues>>;
    isProfileError: boolean;
    isProfileLoading: boolean;
    isUpdateProfileLoading: boolean;
    onAvatarFileChange: (file?: File) => void;
    openProfileDialog: boolean;
    profile: undefined | UserList;
    setOpenProfileDialog: (open: boolean) => void;
}
