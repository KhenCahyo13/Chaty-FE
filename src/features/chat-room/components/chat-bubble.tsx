import { IconChecks, IconFile } from '@tabler/icons-react';
import { type FC, memo } from 'react';

import { formatLastSendTime } from '@/lib/datetime';
import { cn } from '@/lib/utils';

import type { ChatBubbleProps } from '../types';
import AudioPlayer from './audio-player';

const IMAGE_EXTENSIONS = new Set([
    '.bmp',
    '.gif',
    '.heic',
    '.heif',
    '.jpeg',
    '.jpg',
    '.png',
    '.webp',
]);

const getFileExtension = (fileUrl: string) => {
    const pathname = fileUrl.split('?')[0] ?? '';
    const dotIndex = pathname.lastIndexOf('.');

    if (dotIndex < 0) {
        return '';
    }

    return pathname.slice(dotIndex).toLowerCase();
};

const getFileNameFromUrl = (fileUrl: string) => {
    const pathname = fileUrl.split('?')[0] ?? '';
    const segments = pathname.split('/');
    const fileName = segments[segments.length - 1];

    return decodeURIComponent(fileName || 'Attachment');
};

const ChatBubble: FC<ChatBubbleProps> = ({
    message,
}) => {
    const renderBody = () => {
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
                        const extension = getFileExtension(fileUrl);
                        const isImage = IMAGE_EXTENSIONS.has(extension);
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

    return (
        <div
            className={cn(
                'max-w-[84%] rounded-xl border px-3 py-2 md:max-w-[62%]',
                message.isMe
                    ? 'self-end rounded-br-sm border-primary/30 bg-[linear-gradient(145deg,oklch(0.56_0.2_259)_0%,oklch(0.64_0.16_244)_100%)] text-white dark:border-primary/40 dark:bg-[linear-gradient(145deg,oklch(0.34_0.08_260)_0%,oklch(0.29_0.06_252)_100%)]'
                    : 'self-start rounded-bl-sm border-border/70 bg-white/92 text-foreground backdrop-blur dark:bg-card/85'
            )}
        >
            <div className="flex items-center gap-x-1">
                {message.isMe && (
                    <IconChecks
                        className={cn(
                            'shrink-0 size-3.5 text-white/70',
                            message.isRead && 'text-cyan-200'
                        )}
                    />
                )}
                {renderBody()}
                <p
                    className={cn(
                        'shrink-0 text-[10px]',
                        message.isMe ? 'text-white/75' : 'text-muted-foreground'
                    )}
                >
                    {formatLastSendTime(message.createdAt)}
                </p>
            </div>
        </div>
    );
};

export default memo(ChatBubble);
