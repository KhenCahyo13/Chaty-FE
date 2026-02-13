export const getInitials = (name: string) => {
    const segments = name.trim().split(/\s+/).filter(Boolean);
    if (!segments.length) return 'U';
    if (segments.length === 1) return segments[0].slice(0, 2).toUpperCase();
    return `${segments[0][0]}${segments[1][0]}`.toUpperCase();
};