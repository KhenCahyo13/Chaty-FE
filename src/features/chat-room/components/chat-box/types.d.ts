import type { ChangeEvent, FormEvent, RefObject } from 'react';

import type { ChatBoxProps } from '../../types';

export interface ChatBoxViewFilePreview {
    file: File;
    previewUrl: null | string;
}

export interface ChatBoxViewProps extends ChatBoxProps {
    accept: string;
    fileInputRef: RefObject<HTMLInputElement | null>;
    filePreviews: ChatBoxViewFilePreview[];
    isRecording: boolean;
    onCancelRecording: () => void;
    onOpenFilePicker: () => void;
    onPickFiles: (event: ChangeEvent<HTMLInputElement>) => void;
    onRemoveFile: (fileIndex: number) => void;
    onStartRecording: () => void;
    onStopRecording: () => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}
