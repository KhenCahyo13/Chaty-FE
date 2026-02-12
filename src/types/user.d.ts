export interface UserProfile {
    id: string;
    fullName: string;
    about: string | null;
    avatarUrl: string | null;
}

export interface UserList {
    id: string;
    username: string;
    email: string;
    profile: UserProfile | null;
}
