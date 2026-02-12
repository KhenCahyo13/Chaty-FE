import axios from 'axios';

export function resolveErrorMessage(error: unknown): string {
    const unknownErrorMessage = 'An unknown error occurred';

    if (!axios.isAxiosError(error)) {
        return unknownErrorMessage;
    }

    return (error.response?.data?.message as string) || unknownErrorMessage;
}
