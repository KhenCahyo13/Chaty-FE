export const queryKeys = {
    // Me
    me: {
        all: ['me'] as const,
        profile: () => [...queryKeys.me.all, 'profile'] as const,
    },

    // Private Conversations
    privateConversations: {
        all: ['private-conversations'] as const,
        detail: (id: string) =>
            [...queryKeys.privateConversations.details(), id] as const,
        details: () =>
            [...queryKeys.privateConversations.all, 'detail'] as const,
        list: (limit: number, search?: string) =>
            [
                ...queryKeys.privateConversations.lists(),
                { limit, search },
            ] as const,
        lists: () => [...queryKeys.privateConversations.all, 'list'] as const,
        message: (id: string) =>
            [...queryKeys.privateConversations.messages(), id] as const,
        messages: () =>
            [...queryKeys.privateConversations.all, 'messages'] as const,
    },

    // Users
    users: {
        all: ['users'] as const,
        list: (limit: number, search?: string) =>
            [...queryKeys.users.lists(), { limit, search }] as const,
        lists: () => [...queryKeys.users.all, 'list'] as const,
    },
} as const;
