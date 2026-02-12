export const queryKeys = {
    // Private Conversations
    privateConversations: {
        all: ['private-conversations'] as const,
        lists: () => [...queryKeys.privateConversations.all, 'list'] as const,
        list: (limit: number) =>
            [...queryKeys.privateConversations.lists(), { limit }] as const,
        details: () =>
            [...queryKeys.privateConversations.all, 'detail'] as const,
        detail: (id: string) =>
            [...queryKeys.privateConversations.details(), id] as const,
        messages: () =>
            [...queryKeys.privateConversations.all, 'messages'] as const,
        message: (id: string) =>
            [...queryKeys.privateConversations.messages(), id] as const,
    },

    // Users
    users: {
        all: ['users'] as const,
        lists: () => [...queryKeys.users.all, 'list'] as const,
        list: (limit: number, search: string) =>
            [...queryKeys.users.lists(), { limit, search }] as const,
    },
} as const;
