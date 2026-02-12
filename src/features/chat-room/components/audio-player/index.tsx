import {
    type FC,
    memo,
    type SyntheticEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import type { AudioPlayerProps } from './types';
import AudioPlayerView from './view';

const AudioPlayer: FC<AudioPlayerProps> = ({ isMe, src }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const lastUpdateRef = useRef(0);
    const rafIdRef = useRef<number | null>(null);
    const lastReportedTimeRef = useRef(0);
    const isPlayingRef = useRef(false);
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
        isPlayingRef.current = false;
        if (rafIdRef.current !== null) {
            cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = null;
        }
        setIsPlaying(false);
        setCurrentTime(0);
        lastReportedTimeRef.current = 0;
    }, []);

    const handleLoadedMetadata = useCallback(
        (event: SyntheticEvent<HTMLAudioElement>) => {
            setDuration(event.currentTarget.duration || 0);
        },
        []
    );

    const handlePause = useCallback(() => {
        isPlayingRef.current = false;
        if (rafIdRef.current !== null) {
            cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = null;
        }
        setIsPlaying(false);
    }, []);

    const handlePlay = useCallback(() => {
        isPlayingRef.current = true;
        setIsPlaying(true);

        if (rafIdRef.current !== null) return;

        const tick = () => {
            const audio = audioRef.current;
            if (!audio) {
                rafIdRef.current = null;
                return;
            }

            const nextTime = audio.currentTime || 0;
            if (Math.abs(nextTime - lastReportedTimeRef.current) >= 0.1) {
                lastReportedTimeRef.current = nextTime;
                setCurrentTime(nextTime);
            }

            rafIdRef.current = requestAnimationFrame(tick);
        };

        rafIdRef.current = requestAnimationFrame(tick);
    }, []);

    const handleTimeUpdate = useCallback(
        (event: SyntheticEvent<HTMLAudioElement>) => {
            if (isPlayingRef.current) return;
            const now = performance.now();
            if (now - lastUpdateRef.current < 200) return;

            lastUpdateRef.current = now;
            const nextTime = event.currentTarget.currentTime || 0;
            lastReportedTimeRef.current = nextTime;
            setCurrentTime(nextTime);
        },
        []
    );

    const handleSeek = useCallback((nextValue: number) => {
        const audio = audioRef.current;

        if (!audio) return;

        audio.currentTime = nextValue;
        setCurrentTime(nextValue);
        lastReportedTimeRef.current = nextValue;
    }, []);

    useEffect(() => {
        return () => {
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
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
