import { useForm } from '@tanstack/react-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { fetchProfile, updateProfile } from '@/api/me';
import { queryKeys } from '@/lib/query-keys';
import { resolveErrorMessage } from '@/lib/response';
import { useComponentsStore } from '@/stores/components';

import { updateProfileSchema, updateProfileSchemaDefaultValues } from './schema';
import type { UpdateProfileFormValues } from './types';
import ProfileDialogView from './view';

const ProfileDialog = () => {
    const { openProfileDialog, setOpenProfileDialog } = useComponentsStore();
    const queryClient = useQueryClient();
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | undefined>(undefined);

    const { data: profile, isLoading: isProfileLoading, isError: isProfileError } = useQuery({
        queryKey: queryKeys.me.profile(),
        queryFn: () => fetchProfile(),
        enabled: openProfileDialog,
    });

    const updateProfileMutation = useMutation({
        mutationFn: (data: UpdateProfileFormValues) => updateProfile(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: queryKeys.me.profile(),
            });

            form.setFieldValue('avatar', undefined);
            setAvatarPreviewUrl((prev) => {
                if (prev) {
                    URL.revokeObjectURL(prev);
                }

                return undefined;
            });
            toast.success('Profile updated successfully.');
        },
        onError: (error) => {
            toast.error(resolveErrorMessage(error));
        },
    });

    const form = useForm({
        defaultValues: updateProfileSchemaDefaultValues,
        validators: {
            onSubmit: updateProfileSchema,
        },
        onSubmit: ({ value }) => {
            updateProfileMutation.mutate(value);
        },
    });

    const handleOpenProfileDialogChange = (open: boolean) => {
        setOpenProfileDialog(open);

        if (!open) {
            form.reset();
            setAvatarPreviewUrl((prev) => {
                if (prev) {
                    URL.revokeObjectURL(prev);
                }

                return undefined;
            });
        }
    };

    const handleAvatarFileChange = (file?: File) => {
        setAvatarPreviewUrl((prev) => {
            if (prev) {
                URL.revokeObjectURL(prev);
            }

            return file ? URL.createObjectURL(file) : undefined;
        });
    };

    useEffect(() => {
        if (openProfileDialog && profile?.data) {
            form.setFieldValue('fullName', profile.data.profile?.fullName || '');
            form.setFieldValue('about', profile.data.profile?.about || '');
            form.setFieldValue('avatar', undefined);
        }
    }, [openProfileDialog, profile, form]);

    useEffect(() => {
        return () => {
            if (avatarPreviewUrl) {
                URL.revokeObjectURL(avatarPreviewUrl);
            }
        };
    }, [avatarPreviewUrl]);

    return <ProfileDialogView
        form={form}
        openProfileDialog={openProfileDialog}
        setOpenProfileDialog={handleOpenProfileDialogChange}
        avatarPreviewUrl={avatarPreviewUrl}
        onAvatarFileChange={handleAvatarFileChange}
        profile={profile?.data}
        isProfileLoading={isProfileLoading}
        isProfileError={isProfileError}
        isUpdateProfileLoading={updateProfileMutation.isPending}
    />;
};

export default ProfileDialog;
