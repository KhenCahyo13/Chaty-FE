import { type UIEvent,useCallback, useEffect, useRef } from 'react';

interface UseChatRoomScrollProps {
    activePrivateConversationId: string | null;
    messagesLength: number;
    isRoomLoading: boolean;
    isRoomError: boolean;
    isFetchingNextMessagesPage: boolean;
    hasNextMessagesPage: boolean;
    fetchNextMessagesPage: () => Promise<unknown>;
}

export const useChatRoomScroll = ({
    activePrivateConversationId,
    messagesLength,
    isRoomLoading,
    isRoomError,
    isFetchingNextMessagesPage,
    hasNextMessagesPage,
    fetchNextMessagesPage,
}: UseChatRoomScrollProps) => {
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const prevScrollHeightRef = useRef(0);
    const hasAutoScrolledRef = useRef(false);
    const prevMessagesLengthRef = useRef(0);
    const shouldAutoScrollOnNewMessageRef = useRef(true);

    const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
        const el = messagesContainerRef.current;

        if (!el) return false;

        el.scrollTo({
            top: el.scrollHeight,
            behavior,
        });

        shouldAutoScrollOnNewMessageRef.current = true;
        return true;
    }, []);

    const handleScrollMessages = useCallback(
        async (e: UIEvent<HTMLDivElement>) => {
            const el = e.target as HTMLDivElement;
            const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 64;

            shouldAutoScrollOnNewMessageRef.current = isNearBottom;

            if (el.scrollTop === 0 && hasNextMessagesPage && !isFetchingNextMessagesPage) {
                prevScrollHeightRef.current = el.scrollHeight;

                await fetchNextMessagesPage();

                requestAnimationFrame(() => {
                    el.scrollTop = el.scrollHeight - prevScrollHeightRef.current;
                    shouldAutoScrollOnNewMessageRef.current = false;
                });
            }
        },
        [
            fetchNextMessagesPage,
            hasNextMessagesPage,
            isFetchingNextMessagesPage,
        ]
    );

    useEffect(() => {
        hasAutoScrolledRef.current = false;
        prevMessagesLengthRef.current = 0;
        shouldAutoScrollOnNewMessageRef.current = true;
    }, [activePrivateConversationId]);

    useEffect(() => {
        if (!activePrivateConversationId || isRoomLoading || isRoomError) return;
        if (!messagesLength || isFetchingNextMessagesPage) return;

        const currentLength = messagesLength;
        const prevLength = prevMessagesLengthRef.current;

        if (!hasAutoScrolledRef.current) {
            requestAnimationFrame(() => {
                const hasScrolled = scrollToBottom('auto');

                if (!hasScrolled) return;

                hasAutoScrolledRef.current = true;
                prevMessagesLengthRef.current = currentLength;
            });
            return;
        }

        if (currentLength > prevLength && shouldAutoScrollOnNewMessageRef.current) {
            requestAnimationFrame(() => {
                scrollToBottom('smooth');
            });
        }

        prevMessagesLengthRef.current = currentLength;
    }, [
        activePrivateConversationId,
        messagesLength,
        isFetchingNextMessagesPage,
        isRoomLoading,
        isRoomError,
        scrollToBottom,
    ]);

    return {
        handleScrollMessages,
        messagesContainerRef,
    };
};
