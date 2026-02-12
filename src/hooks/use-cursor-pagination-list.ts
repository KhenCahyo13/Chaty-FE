import {
    type InfiniteData,
    type QueryKey,
    useInfiniteQuery,
} from '@tanstack/react-query';
import { type UIEvent, useCallback, useMemo } from 'react';

import type { ApiResponse, CursorMeta } from '@/types/api';

interface UseCursorPaginationListProps<TItem, TQueryKey extends QueryKey> {
    queryKey: TQueryKey;
    queryFn: (pageParam: string | undefined) => Promise<ApiResponse<TItem[], CursorMeta>>;
    scrollThreshold?: number;
}

export const useCursorPaginationList = <TItem, TQueryKey extends QueryKey>({
    queryKey,
    queryFn,
    scrollThreshold = 120,
}: UseCursorPaginationListProps<TItem, TQueryKey>) => {
    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useInfiniteQuery<
        ApiResponse<TItem[], CursorMeta>,
        Error,
        InfiniteData<ApiResponse<TItem[], CursorMeta>>,
        TQueryKey,
        string | undefined
    >({
        queryKey,
        queryFn: ({ pageParam }) => queryFn(pageParam),
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage?.meta?.nextCursor ?? undefined,
    });

    const items = useMemo(() => {
        if (!data) return [];

        return data.pages.flatMap((page) =>
            Array.isArray(page?.data) ? page.data : []
        );
    }, [data]);

    const handleScroll = useCallback(
        (e: UIEvent<HTMLDivElement, globalThis.UIEvent>) => {
            if (!hasNextPage || isFetchingNextPage) return;

            const element = e.currentTarget;
            const remainingHeight =
                element.scrollHeight - element.scrollTop - element.clientHeight;
            if (remainingHeight > scrollThreshold) return;

            fetchNextPage();
        },
        [fetchNextPage, hasNextPage, isFetchingNextPage, scrollThreshold]
    );

    return {
        items,
        isLoading,
        isError,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        handleScroll,
    };
};
