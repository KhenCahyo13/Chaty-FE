export const formatLastSendTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();

    const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    const startOfDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );

    const diffTime = startOfToday.getTime() - startOfDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Today
    if (diffDays === 0) {
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    }

    // Yesterday
    if (diffDays === 1) {
        return 'Yesterday';
    }

    // 2 days ago and above
    return `${diffDays} days ago`;
};
