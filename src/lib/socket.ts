import { io, Socket } from 'socket.io-client';

export const socket: Socket = io('http://localhost:3000', {
    autoConnect: false,
    withCredentials: true,
});

export const getSocketConnectionBadgeClassName = () => {
    switch (socket.connected) {
        case true:
            return 'bg-green-500/20 text-green-500 border-green-400';
        case false:
            return 'bg-red-500/20 text-red-500 border-red-400';
    }
};

export const getSocketConnectionBadgeText = () => {
    switch (socket.connected) {
        case true:
            return 'Connected';
        case false:
            return 'Disconnected';
    }
};
