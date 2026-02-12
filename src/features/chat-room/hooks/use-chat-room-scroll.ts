import {
    type UIEvent,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
} from 'react';

interface UseChatRoomScrollProps {
    activePrivateConversationId: null | string;
    fetchNextMessagesPage: () => Promise<unknown>;
    hasNextMessagesPage: boolean;
    isFetchingNextMessagesPage: boolean;
    isRoomError: boolean;
    isRoomLoading: boolean;
    messagesLength: number;
}

export const useChatRoomScroll = ({
    activePrivateConversationId,
    fetchNextMessagesPage,
    hasNextMessagesPage,
    isFetchingNextMessagesPage,
    isRoomError,
    isRoomLoading,
    messagesLength,
}: UseChatRoomScrollProps) => {
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const prevScrollHeightRef = useRef(0);
    const hasAutoScrolledRef = useRef(false);
    const prevMessagesLengthRef = useRef(0);
    const shouldAutoScrollOnNewMessageRef = useRef(true);
    const shouldRestoreScrollRef = useRef(false);

    const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
        const el = messagesContainerRef.current;

        if (!el) return false;

        el.scrollTo({
            behavior,
            top: el.scrollHeight,
        });

        shouldAutoScrollOnNewMessageRef.current = true;
        return true;
    }, []);

    const handleScrollMessages = useCallback(
        async (e: UIEvent<HTMLDivElement>) => {
            const el = e.target as HTMLDivElement;
            const isNearBottom =
                el.scrollHeight - el.scrollTop - el.clientHeight < 64;

            shouldAutoScrollOnNewMessageRef.current = isNearBottom;

            if (
                el.scrollTop === 0 &&
                hasNextMessagesPage &&
                !isFetchingNextMessagesPage
            ) {
                prevScrollHeightRef.current = el.scrollHeight;

                await fetchNextMessagesPage();

                shouldRestoreScrollRef.current = true;
                shouldAutoScrollOnNewMessageRef.current = false;
            }
        },
        [fetchNextMessagesPage, hasNextMessagesPage, isFetchingNextMessagesPage]
    );

    useEffect(() => {
        hasAutoScrolledRef.current = false;
        prevMessagesLengthRef.current = 0;
        shouldAutoScrollOnNewMessageRef.current = true;
        shouldRestoreScrollRef.current = false;
    }, [activePrivateConversationId]);

    useLayoutEffect(() => {
        if (!activePrivateConversationId || isRoomLoading || isRoomError)
            return;
        if (!messagesLength || isFetchingNextMessagesPage) return;

        const currentLength = messagesLength;
        const prevLength = prevMessagesLengthRef.current;

        if (shouldRestoreScrollRef.current && currentLength > prevLength) {
            const el = messagesContainerRef.current;
            if (el) {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        el.scrollTop =
                            el.scrollHeight - prevScrollHeightRef.current;
                    });
                });
            }
            shouldRestoreScrollRef.current = false;
        }

        if (!hasAutoScrolledRef.current) {
            requestAnimationFrame(() => {
                const hasScrolled = scrollToBottom('auto');

                if (!hasScrolled) return;

                hasAutoScrolledRef.current = true;
                prevMessagesLengthRef.current = currentLength;
            });
            return;
        }

        if (
            currentLength > prevLength &&
            shouldAutoScrollOnNewMessageRef.current
        ) {
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
