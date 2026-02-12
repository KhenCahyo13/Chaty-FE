import {
    type ChangeEvent,
    type FC,
    type FormEvent,
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { toast } from 'sonner';

import { ALLOWED_CHAT_FILE_EXTENSIONS } from '@/constants/file';
import { useAudioRecorder } from '@/hooks/use-audio-recorder';

import type { ChatBoxProps } from '../../types';
import type { ChatBoxViewFilePreview } from './types';
import ChatBoxView from './view';

const CHAT_FILE_ACCEPT = Array.from(ALLOWED_CHAT_FILE_EXTENSIONS).join(',');

const ChatBox: FC<ChatBoxProps> = ({ form, isCreateMessageLoading }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>(
        form.state.values.files ?? []
    );

    const handleRecorded = useCallback(
        (audioFile: File) => {
            if (selectedFiles.length) {
                toast.error('Remove files first before recording audio.');
                return;
            }

            form.setFieldValue('audio', audioFile);
            form.handleSubmit();
        },
        [form, selectedFiles.length]
    );

    const {
        cancelRecording,
        isRecording,
        startRecording,
        stopRecording,
    } = useAudioRecorder({
        disabled: isCreateMessageLoading,
        onRecorded: handleRecorded,
    });

    const handleCancelRecording = useCallback(() => {
        form.setFieldValue('audio', undefined);
        cancelRecording();
    }, [cancelRecording, form]);

    const handleOpenFilePicker = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handlePickFiles = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(event.target.files ?? []);
            if (!files.length) {
                return;
            }

            const nextFiles = [...selectedFiles, ...files];
            setSelectedFiles(nextFiles);
            form.setFieldValue('audio', undefined);
            form.setFieldValue('files', nextFiles);
            event.target.value = '';
        },
        [form, selectedFiles]
    );

    const handleRemoveFile = useCallback(
        (fileIndex: number) => {
            const nextFiles = selectedFiles.filter(
                (_, index) => index !== fileIndex
            );

            setSelectedFiles(nextFiles);
            form.setFieldValue('files', nextFiles);
        },
        [form, selectedFiles]
    );

    const filePreviews = useMemo<ChatBoxViewFilePreview[]>(
        () =>
            selectedFiles.map((file) => {
                const isImage = file.type.startsWith('image/');

                return {
                    file,
                    previewUrl: isImage ? URL.createObjectURL(file) : null,
                };
            }),
        [selectedFiles]
    );

    useEffect(() => {
        return () => {
            filePreviews.forEach((preview) => {
                if (preview.previewUrl) {
                    URL.revokeObjectURL(preview.previewUrl);
                }
            });
        };
    }, [filePreviews]);

    const handleStartRecording = useCallback(() => {
        if (selectedFiles.length) {
            toast.error('Remove selected files before recording audio.');
            return;
        }

        void startRecording();
    }, [selectedFiles.length, startRecording]);

    const handleSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            form.handleSubmit();
        },
        [form]
    );

    return (
        <ChatBoxView
            accept={CHAT_FILE_ACCEPT}
            fileInputRef={fileInputRef}
            filePreviews={filePreviews}
            form={form}
            isCreateMessageLoading={isCreateMessageLoading}
            isRecording={isRecording}
            onCancelRecording={handleCancelRecording}
            onOpenFilePicker={handleOpenFilePicker}
            onPickFiles={handlePickFiles}
            onRemoveFile={handleRemoveFile}
            onStartRecording={handleStartRecording}
            onStopRecording={stopRecording}
            onSubmit={handleSubmit}
        />
    );
};

export default memo(ChatBox);
