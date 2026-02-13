import type { ActivePrivateCall } from '@/types/realtime';

export interface CallDialogViewProps {
    activePrivateCall: ActivePrivateCall | null;
    handleAnswerCall: () => void;
    handleEndCall: () => void;
    onOpenChange: (open: boolean) => void;
    openCallDialog: boolean;
}
