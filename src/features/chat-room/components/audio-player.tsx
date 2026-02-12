import {
    IconPlayerPauseFilled,
    IconPlayerPlayFilled,
} from '@tabler/icons-react';
import { type FC, memo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
    isMe: boolean;
    src: string;
}

const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return '0:00';
    }

    const minute = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minute}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const AudioPlayer: FC<AudioPlayerProps> = ({ isMe, src }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const togglePlay = async () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (audio.paused) {
            await audio.play();
            setIsPlaying(true);
            return;
        }

        audio.pause();
        setIsPlaying(false);
    };

    return (
        <div className="w-full min-w-44 max-w-60">
            <audio
                onEnded={() => {
                    setIsPlaying(false);
                    setCurrentTime(0);
                }}
                onLoadedMetadata={(event) => {
                    setDuration(event.currentTarget.duration || 0);
                }}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onTimeUpdate={(event) => {
                    setCurrentTime(event.currentTarget.currentTime || 0);
                }}
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
                        void togglePlay();
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
                <div className="flex items-center min-w-0 flex-1 gap-x-1">
                    <span className={cn(
                        'text-[10px]',
                        isMe ? 'text-white/80' : 'text-muted-foreground'
                    )}>{formatTime(currentTime)}</span>
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
                            const nextValue = Number(event.target.value);
                            const audio = audioRef.current;

                            if (!audio) return;

                            audio.currentTime = nextValue;
                            setCurrentTime(nextValue);
                        }}
                        step={0.1}
                        type="range"
                        value={duration ? currentTime : 0}
                    />
                    <span className={cn(
                        'text-[10px]',
                        isMe ? 'text-white/80' : 'text-muted-foreground'
                    )}>{formatTime(duration)}</span>
                </div>
            </div>
        </div>
    );
};

export default memo(AudioPlayer);
