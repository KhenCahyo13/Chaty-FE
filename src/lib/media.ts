export const formatDuration = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return '0:00';
    }

    const minute = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minute}:${remainingSeconds.toString().padStart(2, '0')}`;
};
