import type { RefObject, SyntheticEvent } from 'react';

export interface AudioPlayerProps {
    isMe: boolean;
    src: string;
}

export interface AudioPlayerViewProps extends AudioPlayerProps {
    audioRef: RefObject<HTMLAudioElement | null>;
    currentTime: number;
    duration: number;
    isPlaying: boolean;
    onEnded: () => void;
    onLoadedMetadata: (event: SyntheticEvent<HTMLAudioElement>) => void;
    onPause: () => void;
    onPlay: () => void;
    onSeek: (nextValue: number) => void;
    onTimeUpdate: (event: SyntheticEvent<HTMLAudioElement>) => void;
    onTogglePlay: () => void;
}
