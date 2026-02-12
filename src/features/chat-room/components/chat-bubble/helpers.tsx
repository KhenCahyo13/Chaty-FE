import { cn } from '@/lib/utils';
import type { PrivateConversationDetailsMessage } from '@/types/private-conversation';
import AudioPlayer from '../audio-player';
import { getFileExtensionFromUrl, getFileNameFromUrl } from '@/lib/file';
import { IconFile } from '@tabler/icons-react';
import { IMAGE_FILE_EXTENSIONS } from '@/constants/file';

export const renderBody = (message: PrivateConversationDetailsMessage) => {
    if (message.isDeleted) {
        return (
            <p
                className={cn(
                    'wrap-break-word text-[13px] leading-relaxed italic',
                    message.isMe ? 'text-white/70' : 'text-muted-foreground'
                )}
            >
                This message was deleted
            </p>
        );
    }

    if (message.messageType === 'AUDIO' && message.audioUrl) {
        return <AudioPlayer isMe={message.isMe} src={message.audioUrl} />;
    }

    if (message.messageType === 'FILE' && message.fileUrls?.length) {
        return (
            <div className="grid max-w-xs grid-cols-1 gap-2 md:max-w-sm">
                {message.fileUrls.map((fileUrl, index) => {
                    const extension = getFileExtensionFromUrl(fileUrl);
                    const isImage = IMAGE_FILE_EXTENSIONS.has(extension);
                    const fileName = getFileNameFromUrl(fileUrl);

                    return (
                        <a
                            className={cn(
                                'flex min-w-40 items-center gap-x-2 rounded-lg border px-2 py-1.5 text-xs transition-colors',
                                message.isMe
                                    ? 'border-white/25 bg-white/10 hover:bg-white/20'
                                    : 'border-border/70 bg-muted/35 hover:bg-muted/55'
                            )}
                            href={fileUrl}
                            key={`${fileUrl}-${index}`}
                            rel="noreferrer"
                            target="_blank"
                        >
                            {isImage ? (
                                <img
                                    alt={fileName}
                                    className="size-10 rounded-md object-cover"
                                    src={fileUrl}
                                />
                            ) : (
                                <div
                                    className={cn(
                                        'flex size-10 shrink-0 items-center justify-center rounded-md',
                                        message.isMe
                                            ? 'bg-white/15'
                                            : 'bg-muted'
                                    )}
                                >
                                    <IconFile className="size-4" />
                                </div>
                            )}
                            <p className="line-clamp-2 break-all text-left">
                                {fileName}
                            </p>
                        </a>
                    );
                })}
            </div>
        );
    }

    return (
        <p className="wrap-break-word text-[13px] leading-relaxed">
            {message.content ?? ''}
        </p>
    );
};