import { IconFile } from '@tabler/icons-react';

import { cn } from '@/lib/utils';

import type { ChatRoomMessage } from '../../types';
import AudioPlayer from '../audio-player';

export const renderBody = (message: ChatRoomMessage) => {
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
        const files = message.fileMeta ?? message.fileUrls.map((fileUrl) => ({
            fileName: fileUrl,
            isImage: false,
            url: fileUrl,
        }));

        return (
            <div className="grid max-w-xs grid-cols-1 gap-2 md:max-w-sm">
                {files.map((file, index) => {
                    return (
                        <a
                            className={cn(
                                'flex min-w-40 items-center gap-x-2 rounded-lg border px-2 py-1.5 text-xs transition-colors',
                                message.isMe
                                    ? 'border-white/25 bg-white/10 hover:bg-white/20'
                                    : 'border-border/70 bg-muted/35 hover:bg-muted/55'
                            )}
                            href={file.url}
                            key={`${file.url}-${index}`}
                            rel="noreferrer"
                            target="_blank"
                        >
                            {file.isImage ? (
                                <img
                                    alt={file.fileName}
                                    className="size-10 rounded-md object-cover"
                                    decoding="async"
                                    loading="lazy"
                                    src={file.url}
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
                                {file.fileName}
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
