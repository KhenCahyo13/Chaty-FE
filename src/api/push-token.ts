import { authenticatedApi } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type {
    PushTokenDeviceResponse,
    RegisterPushTokenPayload,
} from '@/types/push-token';

export const registerPushToken = async (
    data: RegisterPushTokenPayload
): Promise<ApiResponse<PushTokenDeviceResponse>> => {
    const response = await authenticatedApi.post('/auth/push-token', data);

    return response.data as ApiResponse<PushTokenDeviceResponse>;
};
