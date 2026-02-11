export const queryKeys = {
    // Private Conversations
    privateConversations: {
        all: ['private-conversations'] as const,
        lists: () => [...queryKeys.privateConversations.all, 'list'] as const,
        list: (limit: number) =>
            [...queryKeys.privateConversations.lists(), { limit }] as const,
    },
} as const;
