export const getFileExtensionFromUrl = (fileUrl: string) => {
    const pathname = fileUrl.split('?')[0] ?? '';
    const dotIndex = pathname.lastIndexOf('.');

    if (dotIndex < 0) {
        return '';
    }

    return pathname.slice(dotIndex).toLowerCase();
};

export const getFileNameFromUrl = (
    fileUrl: string,
    fallbackName = 'Attachment'
) => {
    const pathname = fileUrl.split('?')[0] ?? '';
    const segments = pathname.split('/');
    const fileName = segments[segments.length - 1];

    return decodeURIComponent(fileName || fallbackName);
};

export const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    const kb = bytes / 1024;
    if (kb < 1024) {
        return `${kb.toFixed(1)} KB`;
    }

    return `${(kb / 1024).toFixed(1)} MB`;
};
