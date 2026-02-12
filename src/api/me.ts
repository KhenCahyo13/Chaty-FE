import type { UpdateProfileFormValues } from '@/components/layouts/profile-dialog/types';
import { authenticatedApi } from '@/lib/axios';
import { createFormData } from '@/lib/form';
import type { ApiResponse } from '@/types/api';
import type { UserList } from '@/types/user';

export const fetchProfile = async (): Promise<ApiResponse<UserList>> => {
    const response = await authenticatedApi.get('/me');

    return response.data as ApiResponse<UserList>;
};

export const updateProfile = async (
    data: UpdateProfileFormValues
): Promise<ApiResponse<UserList>> => {
    const formData = createFormData({
        about: data.about ?? '',
        avatar: data.avatar,
        fullName: data.fullName,
    });

    const response = await authenticatedApi.patch('/me', formData);

    return response.data as ApiResponse<UserList>;
};
