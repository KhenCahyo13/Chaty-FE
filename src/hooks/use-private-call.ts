import { useCallback, useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';

import {
    getPrivateCallPeerIdentity,
    parsePrivateCallIceCandidate,
    parsePrivateCallSessionDescription,
} from '@/lib/call';
import { logCallDebug } from '@/lib/debugging';
import { socket } from '@/lib/socket';
import { useAuthStore } from '@/stores/auth-store';
import { useComponentsStore } from '@/stores/components';
import { usePrivateCallStore } from '@/stores/private-call-store';
import type { PrivateConversationList } from '@/types/private-conversation';
import type {
    ActivePrivateCall,
    SocketErrorPayload,
    SocketPrivateCallAnsweredPayload,
    SocketPrivateCallEndedPayload,
    SocketPrivateCallIceCandidatePayload,
    SocketPrivateCallPayload,
    SocketPrivateCallWebRtcPayload,
} from '@/types/realtime';

interface UsePrivateCallProps {
    privateConversations: PrivateConversationList[] | undefined;
}

export const usePrivateCall = ({
    privateConversations,
}: UsePrivateCallProps) => {
    const { user } = useAuthStore();
    const { setOpenCallDialog } = useComponentsStore();
    const { activePrivateCall, clearActivePrivateCall, setActivePrivateCall } =
        usePrivateCallStore();

    const peerConnectionRef = useRef<null | RTCPeerConnection>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const pendingIceCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
    const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

    const privateConversationMap = useMemo(() => {
        return new Map(
            (privateConversations ?? []).map((item) => [item.id, item])
        );
    }, [privateConversations]);

    const cleanupWebRtc = useCallback(() => {
        logCallDebug('cleanup webrtc');
        peerConnectionRef.current?.close();
        peerConnectionRef.current = null;

        localStreamRef.current?.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
        pendingIceCandidatesRef.current = [];

        if (remoteAudioRef.current) {
            remoteAudioRef.current.pause();
            remoteAudioRef.current.srcObject = null;
            remoteAudioRef.current = null;
        }
    }, []);

    const getOrCreatePeerConnection = useCallback((call: ActivePrivateCall) => {
        if (peerConnectionRef.current) return peerConnectionRef.current;

        logCallDebug('create peer connection', {
            callId: call.callId,
            conversationId: call.privateConversationId,
        });

        const peerConnection = new RTCPeerConnection({
            iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
        });

        peerConnection.onconnectionstatechange = () => {
            logCallDebug('connection state', peerConnection.connectionState);
        };
        peerConnection.oniceconnectionstatechange = () => {
            logCallDebug(
                'ice connection state',
                peerConnection.iceConnectionState
            );
        };
        peerConnection.onicegatheringstatechange = () => {
            logCallDebug(
                'ice gathering state',
                peerConnection.iceGatheringState
            );
        };
        peerConnection.onicecandidate = (event) => {
            if (!event.candidate) return;

            logCallDebug('emit webrtc-ice-candidate');
            socket.emit('private-call:webrtc-ice-candidate', {
                call_id: call.callId,
                candidate: event.candidate.toJSON(),
                private_conversation_id: call.privateConversationId,
            });
        };

        peerConnection.ontrack = (event) => {
            const [remoteStream] = event.streams;
            if (!remoteStream) return;
            logCallDebug('remote track received', {
                audioTracks: remoteStream.getAudioTracks().length,
                id: remoteStream.id,
            });

            if (!remoteAudioRef.current) {
                const remoteAudio = new Audio();
                remoteAudio.autoplay = true;
                remoteAudioRef.current = remoteAudio;
            }

            remoteAudioRef.current.srcObject = remoteStream;
            void remoteAudioRef.current.play().catch(() => undefined);
        };

        peerConnectionRef.current = peerConnection;
        return peerConnection;
    }, []);

    const flushPendingIceCandidates = useCallback(async () => {
        const peerConnection = peerConnectionRef.current;
        if (!peerConnection) return;
        if (!peerConnection.remoteDescription) return;
        if (!pendingIceCandidatesRef.current.length) return;

        const pendingCandidates = [...pendingIceCandidatesRef.current];
        pendingIceCandidatesRef.current = [];
        logCallDebug('flush pending ice candidates', pendingCandidates.length);

        for (const candidate of pendingCandidates) {
            await peerConnection.addIceCandidate(
                new RTCIceCandidate(candidate)
            );
        }
    }, []);

    const ensureLocalAudioStream = useCallback(
        async (peerConnection: RTCPeerConnection) => {
            if (!navigator.mediaDevices?.getUserMedia) {
                throw new Error(
                    'Audio device is not supported in this browser.'
                );
            }

            if (!localStreamRef.current) {
                logCallDebug('request local audio stream');
                localStreamRef.current =
                    await navigator.mediaDevices.getUserMedia({
                        audio: true,
                        video: false,
                    });
                logCallDebug('local audio stream ready', {
                    tracks: localStreamRef.current.getAudioTracks().length,
                });
            }

            const localStream = localStreamRef.current;

            localStream.getAudioTracks().forEach((track) => {
                const isTrackAdded = peerConnection
                    .getSenders()
                    .some((sender) => sender.track?.id === track.id);

                if (!isTrackAdded) {
                    peerConnection.addTrack(track, localStream);
                }
            });
        },
        []
    );

    const createAndSendOffer = useCallback(
        async (call: ActivePrivateCall) => {
            const peerConnection = getOrCreatePeerConnection(call);
            await ensureLocalAudioStream(peerConnection);

            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            logCallDebug('emit webrtc-offer');

            if (!peerConnection.localDescription) return;

            socket.emit('private-call:webrtc-offer', {
                call_id: call.callId,
                private_conversation_id: call.privateConversationId,
                sdp: peerConnection.localDescription,
            });
        },
        [ensureLocalAudioStream, getOrCreatePeerConnection]
    );

    useEffect(() => {
        if (!user?.id) return;

        const handleCallStarted = (
            data: SocketPrivateCallPayload,
            isIncoming: boolean
        ) => {
            logCallDebug('call started event', {
                callId: data.call_id,
                isIncoming,
                status: data.status,
            });
            cleanupWebRtc();

            const peerId =
                data.caller_id === user.id ? data.callee_id : data.caller_id;
            const peerIdentity = getPrivateCallPeerIdentity(
                privateConversationMap,
                data,
                peerId
            );

            setActivePrivateCall({
                calleeId: data.callee_id,
                callerId: data.caller_id,
                callId: data.call_id,
                callType: data.call_type,
                isIncoming,
                peerId,
                peerInitials: peerIdentity.initials,
                peerName: peerIdentity.name,
                privateConversationId: data.private_conversation_id,
                room: data.room,
                startedAt: data.started_at,
                status: data.status,
            });
            setOpenCallDialog(true);
        };

        const handleCallEnded = (data: SocketPrivateCallEndedPayload) => {
            logCallDebug('call ended event', data);
            cleanupWebRtc();
            clearActivePrivateCall();
            setOpenCallDialog(false);

            if (data.ended_by !== user.id) {
                toast.info('The call has ended.');
            }
        };
        const handlePrivateCallError = (data: SocketErrorPayload) => {
            toast.error(data.message);
        };
        const handlePrivateCallStarted = (data: SocketPrivateCallPayload) => {
            handleCallStarted(data, false);
        };
        const handlePrivateCallIncoming = (data: SocketPrivateCallPayload) => {
            handleCallStarted(data, true);
        };
        const handleCallAnswered = (data: SocketPrivateCallAnsweredPayload) => {
            logCallDebug('call answered event', data);
            const { activePrivateCall } = usePrivateCallStore.getState();

            if (!activePrivateCall) return;
            if (activePrivateCall.callId !== data.call_id) return;
            if (
                activePrivateCall.privateConversationId !==
                data.private_conversation_id
            ) {
                return;
            }

            const nextCall: ActivePrivateCall = {
                ...activePrivateCall,
                room: data.room,
                status: data.status,
            };

            setActivePrivateCall(nextCall);

            if (nextCall.callerId === user.id) {
                void createAndSendOffer(nextCall).catch(() => {
                    toast.error('Failed to initialize call connection.');
                });
            }
        };
        const handleWebRtcOffer = async (
            data: SocketPrivateCallWebRtcPayload
        ) => {
            logCallDebug('receive webrtc-offer', data);
            const { activePrivateCall } = usePrivateCallStore.getState();
            if (!activePrivateCall) return;
            if (activePrivateCall.callId !== data.call_id) return;
            if (
                activePrivateCall.privateConversationId !==
                data.private_conversation_id
            ) {
                return;
            }

            const offer = parsePrivateCallSessionDescription(data.sdp, 'offer');
            if (!offer) return;

            const peerConnection = getOrCreatePeerConnection(activePrivateCall);
            await ensureLocalAudioStream(peerConnection);
            await peerConnection.setRemoteDescription(
                new RTCSessionDescription(offer)
            );
            await flushPendingIceCandidates();

            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            logCallDebug('emit webrtc-answer');

            if (!peerConnection.localDescription) return;

            socket.emit('private-call:webrtc-answer', {
                call_id: activePrivateCall.callId,
                private_conversation_id:
                    activePrivateCall.privateConversationId,
                sdp: peerConnection.localDescription,
            });
        };
        const handleWebRtcAnswer = async (
            data: SocketPrivateCallWebRtcPayload
        ) => {
            logCallDebug('receive webrtc-answer', data);
            const { activePrivateCall } = usePrivateCallStore.getState();
            if (!activePrivateCall) return;
            if (activePrivateCall.callId !== data.call_id) return;
            if (
                activePrivateCall.privateConversationId !==
                data.private_conversation_id
            ) {
                return;
            }

            const answer = parsePrivateCallSessionDescription(
                data.sdp,
                'answer'
            );
            if (!answer) return;

            const peerConnection = peerConnectionRef.current;
            if (!peerConnection) return;

            await peerConnection.setRemoteDescription(
                new RTCSessionDescription(answer)
            );
            await flushPendingIceCandidates();
            logCallDebug('set remote answer success');
        };
        const handleWebRtcIceCandidate = async (
            data: SocketPrivateCallIceCandidatePayload
        ) => {
            const { activePrivateCall } = usePrivateCallStore.getState();
            if (!activePrivateCall) return;
            if (activePrivateCall.callId !== data.call_id) return;
            if (
                activePrivateCall.privateConversationId !==
                data.private_conversation_id
            ) {
                return;
            }

            const candidate = parsePrivateCallIceCandidate(data.candidate);
            if (!candidate) return;

            const peerConnection = peerConnectionRef.current;
            if (!peerConnection || !peerConnection.remoteDescription) {
                pendingIceCandidatesRef.current.push(candidate);
                logCallDebug('queue ice candidate', {
                    queueSize: pendingIceCandidatesRef.current.length,
                });
                return;
            }

            await peerConnection.addIceCandidate(
                new RTCIceCandidate(candidate)
            );
            logCallDebug('add ice candidate success');
        };
        const onWebRtcOffer = (data: SocketPrivateCallWebRtcPayload) => {
            void handleWebRtcOffer(data).catch(() => {
                toast.error('Failed to handle WebRTC offer.');
            });
        };
        const onWebRtcAnswer = (data: SocketPrivateCallWebRtcPayload) => {
            void handleWebRtcAnswer(data).catch(() => {
                toast.error('Failed to handle WebRTC answer.');
            });
        };
        const onWebRtcIceCandidate = (
            data: SocketPrivateCallIceCandidatePayload
        ) => {
            void handleWebRtcIceCandidate(data).catch(() => undefined);
        };

        socket.on('private-call:start:error', handlePrivateCallError);
        socket.on('private-call:end:error', handlePrivateCallError);
        socket.on('private-call:started', handlePrivateCallStarted);
        socket.on('private-call:incoming', handlePrivateCallIncoming);
        socket.on('private-call:answered', handleCallAnswered);
        socket.on('private-call:webrtc-offer', onWebRtcOffer);
        socket.on('private-call:webrtc-answer', onWebRtcAnswer);
        socket.on('private-call:webrtc-ice-candidate', onWebRtcIceCandidate);
        socket.on('private-call:ended', handleCallEnded);
        socket.on('private-call:answer:error', handlePrivateCallError);
        socket.on('private-call:webrtc-offer:error', handlePrivateCallError);
        socket.on('private-call:webrtc-answer:error', handlePrivateCallError);
        socket.on(
            'private-call:webrtc-ice-candidate:error',
            handlePrivateCallError
        );

        return () => {
            socket.off('private-call:start:error', handlePrivateCallError);
            socket.off('private-call:end:error', handlePrivateCallError);
            socket.off('private-call:started', handlePrivateCallStarted);
            socket.off('private-call:incoming', handlePrivateCallIncoming);
            socket.off('private-call:answered', handleCallAnswered);
            socket.off('private-call:webrtc-offer', onWebRtcOffer);
            socket.off('private-call:webrtc-answer', onWebRtcAnswer);
            socket.off(
                'private-call:webrtc-ice-candidate',
                onWebRtcIceCandidate
            );
            socket.off('private-call:ended', handleCallEnded);
            socket.off('private-call:answer:error', handlePrivateCallError);
            socket.off(
                'private-call:webrtc-offer:error',
                handlePrivateCallError
            );
            socket.off(
                'private-call:webrtc-answer:error',
                handlePrivateCallError
            );
            socket.off(
                'private-call:webrtc-ice-candidate:error',
                handlePrivateCallError
            );
            cleanupWebRtc();
        };
    }, [
        cleanupWebRtc,
        createAndSendOffer,
        clearActivePrivateCall,
        ensureLocalAudioStream,
        flushPendingIceCandidates,
        getOrCreatePeerConnection,
        privateConversationMap,
        setActivePrivateCall,
        setOpenCallDialog,
        user?.id,
    ]);

    useEffect(() => {
        if (activePrivateCall) return;
        cleanupWebRtc();
    }, [activePrivateCall, cleanupWebRtc]);
};
