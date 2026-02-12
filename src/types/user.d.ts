export interface UserProfile {
    about: null | string;
    avatarUrl: null | string;
    fullName: string;
    id: string;
}

export interface UserList {
    email: string;
    id: string;
    profile: null | UserProfile;
    username: string;
}
