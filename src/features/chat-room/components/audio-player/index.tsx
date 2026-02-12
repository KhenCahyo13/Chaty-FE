import {
    type FC,
    memo,
    type SyntheticEvent,
    useCallback,
    useRef,
    useState,
} from 'react';

import type { AudioPlayerProps } from './types';
import AudioPlayerView from './view';

const AudioPlayer: FC<AudioPlayerProps> = ({ isMe, src }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const togglePlay = useCallback(async () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (audio.paused) {
            await audio.play();
            setIsPlaying(true);
            return;
        }

        audio.pause();
        setIsPlaying(false);
    }, []);

    const handleEnded = useCallback(() => {
        setIsPlaying(false);
        setCurrentTime(0);
    }, []);

    const handleLoadedMetadata = useCallback(
        (event: SyntheticEvent<HTMLAudioElement>) => {
            setDuration(event.currentTarget.duration || 0);
        },
        []
    );

    const handlePause = useCallback(() => {
        setIsPlaying(false);
    }, []);

    const handlePlay = useCallback(() => {
        setIsPlaying(true);
    }, []);

    const handleTimeUpdate = useCallback(
        (event: SyntheticEvent<HTMLAudioElement>) => {
            setCurrentTime(event.currentTarget.currentTime || 0);
        },
        []
    );

    const handleSeek = useCallback((nextValue: number) => {
        const audio = audioRef.current;

        if (!audio) return;

        audio.currentTime = nextValue;
        setCurrentTime(nextValue);
    }, []);

    return (
        <AudioPlayerView
            audioRef={audioRef}
            currentTime={currentTime}
            duration={duration}
            isMe={isMe}
            isPlaying={isPlaying}
            onEnded={handleEnded}
            onLoadedMetadata={handleLoadedMetadata}
            onPause={handlePause}
            onPlay={handlePlay}
            onSeek={handleSeek}
            onTimeUpdate={handleTimeUpdate}
            onTogglePlay={() => {
                void togglePlay();
            }}
            src={src}
        />
    );
};

export default memo(AudioPlayer);
