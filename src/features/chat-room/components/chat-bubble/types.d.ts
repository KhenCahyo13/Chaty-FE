import type { ReactNode } from 'react';
import type { ChatBubbleProps } from '../../types';

export interface ChatBubbleViewProps extends ChatBubbleProps {
    body: ReactNode;
}
