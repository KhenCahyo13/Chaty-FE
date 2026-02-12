import {
    IconLoader2,
    IconMicrophone,
    IconPaperclip,
    IconPlayerStopFilled,
    IconPlus,
    IconSend2,
    IconX,
} from '@tabler/icons-react';
import {
    type ChangeEvent,
    type FC,
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { toast } from 'sonner';

import { TfTextInput } from '@/components/tanstack-form/text-input';
import { Button } from '@/components/ui/button';

import { useAudioRecorder } from '../../../hooks/use-audio-recorder';
import { ALLOWED_CHAT_FILE_EXTENSIONS } from '../schema';
import type { ChatBoxProps } from '../types';

const CHAT_FILE_ACCEPT = Array.from(ALLOWED_CHAT_FILE_EXTENSIONS).join(',');

const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    const kb = bytes / 1024;
    if (kb < 1024) {
        return `${kb.toFixed(1)} KB`;
    }

    return `${(kb / 1024).toFixed(1)} MB`;
};

const ChatBox: FC<ChatBoxProps> = ({
    form,
    isCreateMessageLoading,
}) => {
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

    const filePreviews = useMemo(
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

    return (
        <div className="relative z-20 shrink-0 border-t border-border/70 bg-background/85 backdrop-blur">
            <form
                className="mx-auto max-w-5xl py-2"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                {isCreateMessageLoading && (
                    <div className="mb-2 inline-flex items-center gap-x-1 rounded-full border border-border/70 bg-white/85 px-2.5 py-1 text-[11px] text-muted-foreground dark:bg-muted/50">
                        <IconLoader2 className="size-3.5 animate-spin" />
                        Sending message...
                    </div>
                )}
                {filePreviews.length > 0 && (
                    <div className="mb-2 grid max-h-44 grid-cols-2 gap-2 overflow-y-auto rounded-xl border border-border/70 bg-white/90 p-2 dark:bg-muted/40 md:grid-cols-3">
                        {filePreviews.map((preview, index) => (
                            <div
                                className="relative rounded-lg border border-border/70 bg-background/80 p-2"
                                key={`${preview.file.name}-${preview.file.lastModified}-${index}`}
                            >
                                {preview.previewUrl ? (
                                    <img
                                        alt={preview.file.name}
                                        className="h-16 w-full rounded-md object-cover"
                                        src={preview.previewUrl}
                                    />
                                ) : (
                                    <div className="flex h-16 items-center justify-center rounded-md border border-dashed border-border/70 text-muted-foreground">
                                        <IconPaperclip className="size-4" />
                                    </div>
                                )}
                                <p className="mt-1 line-clamp-1 text-[11px] font-medium">
                                    {preview.file.name}
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                    {formatFileSize(preview.file.size)}
                                </p>
                                <Button
                                    className="absolute right-1 top-1 size-6 rounded-full bg-black/45 text-white hover:bg-black/60"
                                    onClick={() => handleRemoveFile(index)}
                                    size="icon-sm"
                                    type="button"
                                    variant="ghost"
                                >
                                    <IconX className="size-3.5" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex items-center gap-x-1.5 md:gap-x-2">
                    <input
                        accept={CHAT_FILE_ACCEPT}
                        className="hidden"
                        multiple
                        onChange={handlePickFiles}
                        ref={fileInputRef}
                        type="file"
                    />
                    <Button
                        className="rounded-lg border border-transparent hover:border-border/70 hover:bg-white dark:hover:bg-muted/50"
                        disabled={isCreateMessageLoading || isRecording}
                        onClick={handleOpenFilePicker}
                        size="icon-sm"
                        type="button"
                        variant="ghost"
                    >
                        <IconPlus className="size-5 text-muted-foreground" />
                    </Button>
                    <div className="flex flex-1 rounded-xl border border-border/70 bg-white px-1 shadow-[0_20px_26px_-30px_oklch(0.28_0.04_250)] dark:bg-muted/40 dark:shadow-none">
                        <TfTextInput
                            className="h-9 border-none bg-transparent text-[13px] shadow-none focus-visible:ring-0"
                            disabled={isCreateMessageLoading || isRecording}
                            form={form}
                            name="content"
                            placeholder="Write a message"
                        />
                    </div>
                    <Button
                        className="rounded-lg"
                        disabled={isCreateMessageLoading || isRecording}
                        size="icon-sm"
                        type="submit"
                    >
                        {isCreateMessageLoading ? (
                            <IconLoader2 className="size-4 animate-spin" />
                        ) : (
                            <IconSend2 className="size-4" />
                        )}
                    </Button>

                    {isRecording ? (
                        <>
                            <Button
                                className="rounded-lg border border-transparent hover:border-border/70 hover:bg-white dark:hover:bg-muted/50"
                                disabled={isCreateMessageLoading}
                                onClick={stopRecording}
                                size="icon-sm"
                                type="button"
                                variant="ghost"
                            >
                                <IconPlayerStopFilled className="size-5 text-rose-500" />
                            </Button>
                            <Button
                                className="rounded-lg border border-transparent hover:border-border/70 hover:bg-white dark:hover:bg-muted/50"
                                disabled={isCreateMessageLoading}
                                onClick={handleCancelRecording}
                                size="icon-sm"
                                type="button"
                                variant="ghost"
                            >
                                <IconX className="size-5 text-muted-foreground" />
                            </Button>
                        </>
                    ) : (
                        <Button
                            className="rounded-lg border border-transparent hover:border-border/70 hover:bg-white dark:hover:bg-muted/50"
                            disabled={isCreateMessageLoading}
                            onClick={handleStartRecording}
                            size="icon-sm"
                            type="button"
                            variant="ghost"
                        >
                            <IconMicrophone className="size-5 text-muted-foreground" />
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default memo(ChatBox);
