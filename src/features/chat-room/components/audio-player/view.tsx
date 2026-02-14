import {
    IconPlayerPauseFilled,
    IconPlayerPlayFilled,
} from '@tabler/icons-react';
import { type FC, memo } from 'react';

import { Button } from '@/components/ui/button';
import { formatDuration } from '@/lib/media';
import { cn } from '@/lib/utils';

import type { AudioPlayerViewProps } from './types';

const AudioPlayerView: FC<AudioPlayerViewProps> = ({
    audioRef,
    currentTime,
    duration,
    isMe,
    isPlaying,
    onEnded,
    onLoadedMetadata,
    onPause,
    onPlay,
    onSeek,
    onTimeUpdate,
    onTogglePlay,
    src,
}) => (
    <div className="w-full min-w-44 max-w-60">
        <audio
            onEnded={onEnded}
            onLoadedMetadata={onLoadedMetadata}
            onPause={onPause}
            onPlay={onPlay}
            onTimeUpdate={onTimeUpdate}
            preload="metadata"
            ref={audioRef}
            src={src}
        />
        <div className="flex items-center gap-x-2">
            <Button
                className={cn(
                    'size-7 shrink-0 rounded-full border p-0',
                    isMe
                        ? 'border-white/30 bg-white/15 hover:bg-white/25'
                        : 'border-border bg-muted/30 hover:bg-muted/50'
                )}
                onClick={() => {
                    onTogglePlay();
                }}
                size="icon-xs"
                type="button"
                variant="ghost"
            >
                {isPlaying ? (
                    <IconPlayerPauseFilled className="size-3" />
                ) : (
                    <IconPlayerPlayFilled className="size-3" />
                )}
            </Button>
            <div className="flex min-w-0 flex-1 items-center gap-x-1">
                <span
                    className={cn(
                        'text-[10px]',
                        isMe ? 'text-white/80' : 'text-muted-foreground'
                    )}
                >
                    {formatDuration(currentTime)}
                </span>
                <input
                    className={cn(
                        'h-1 w-full cursor-pointer appearance-none rounded-full',
                        '[&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-full',
                        '[&::-webkit-slider-thumb]:-mt-1 [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full',
                        isMe
                            ? 'bg-white/25 [&::-webkit-slider-runnable-track]:bg-white/25 [&::-webkit-slider-thumb]:bg-white'
                            : 'bg-muted [&::-webkit-slider-runnable-track]:bg-muted [&::-webkit-slider-thumb]:bg-primary'
                    )}
                    max={duration || 0}
                    min={0}
                    onChange={(event) => {
                        onSeek(Number(event.target.value));
                    }}
                    step={0.1}
                    type="range"
                    value={duration ? currentTime : 0}
                />
                <span
                    className={cn(
                        'text-[10px]',
                        isMe ? 'text-white/80' : 'text-muted-foreground'
                    )}
                >
                    {formatDuration(duration)}
                </span>
            </div>
        </div>
    </div>
)

export default memo(AudioPlayerView);
