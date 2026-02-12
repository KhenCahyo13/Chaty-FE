import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface UseAudioRecorderProps {
    disabled?: boolean;
    onRecorded: (audioFile: File) => void;
}

export const useAudioRecorder = ({
    disabled = false,
    onRecorded,
}: UseAudioRecorderProps) => {
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const isCancellingRef = useRef(false);
    const recordedChunksRef = useRef<Blob[]>([]);
    const [isRecording, setIsRecording] = useState(false);

    const stopTracks = useCallback(() => {
        mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
    }, []);

    const startRecording = useCallback(async () => {
        if (disabled || isRecording) {
            return;
        }

        if (!navigator.mediaDevices?.getUserMedia) {
            toast.error('Audio recording is not supported in this browser.');
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            const recorder = new MediaRecorder(stream);

            mediaStreamRef.current = stream;
            mediaRecorderRef.current = recorder;
            recordedChunksRef.current = [];
            isCancellingRef.current = false;

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            recorder.onstop = () => {
                const chunks = recordedChunksRef.current;
                recordedChunksRef.current = [];
                stopTracks();
                mediaRecorderRef.current = null;

                if (isCancellingRef.current) {
                    isCancellingRef.current = false;
                    return;
                }

                const recordedAudioBlob = new Blob(chunks, {
                    type: recorder.mimeType || 'audio/webm',
                });

                if (!recordedAudioBlob.size) {
                    toast.error('Recorded audio is empty.');
                    return;
                }

                const extension = recorder.mimeType.includes('ogg')
                    ? 'ogg'
                    : recorder.mimeType.includes('mp4')
                      ? 'm4a'
                      : 'webm';

                onRecorded(
                    new File(
                        [recordedAudioBlob],
                        `audio-${Date.now()}.${extension}`,
                        {
                            type: recordedAudioBlob.type,
                        }
                    )
                );
            };

            recorder.start();
            setIsRecording(true);
        } catch {
            stopTracks();
            mediaRecorderRef.current = null;
            toast.error(
                'Failed to access microphone. Please check permissions.'
            );
        }
    }, [disabled, isRecording, onRecorded, stopTracks]);

    const stopRecording = useCallback(() => {
        if (!isRecording || !mediaRecorderRef.current) {
            return;
        }

        isCancellingRef.current = false;
        setIsRecording(false);
        mediaRecorderRef.current.stop();
    }, [isRecording]);

    const cancelRecording = useCallback(() => {
        if (!isRecording || !mediaRecorderRef.current) {
            return;
        }

        isCancellingRef.current = true;
        recordedChunksRef.current = [];
        setIsRecording(false);
        mediaRecorderRef.current.stop();
    }, [isRecording]);

    useEffect(() => {
        return () => {
            if (
                mediaRecorderRef.current &&
                mediaRecorderRef.current.state !== 'inactive'
            ) {
                isCancellingRef.current = true;
                mediaRecorderRef.current.stop();
            }

            stopTracks();
        };
    }, [stopTracks]);

    return {
        cancelRecording,
        isRecording,
        startRecording,
        stopRecording,
    };
};
