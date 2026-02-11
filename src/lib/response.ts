import axios from 'axios';

export function resolveErrorMessage(error: unknown): string {
    const unknownErrorMessage = 'Terjadi kesalahan yang tidak diketahui';

    if (!axios.isAxiosError(error)) {
        return unknownErrorMessage;
    }

    return (error.response?.data?.message as string) || unknownErrorMessage;
}
