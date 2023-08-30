interface APIUserInfoLoggedOut {
    loggedIn: false;
}

interface APIUserInfoLoggedIn {
    loggedIn: true;
    id: number;
    username: string;
    roles: APIRole[];
}

type APIUserInfo = APIUserInfoLoggedOut | APIUserInfoLoggedIn | null;

interface APIUserProfile {
    id: number;
    username: string;
    creation_date?: string;
    roles: APIRole[];
}

interface APIRole {
    id: number;
    name: string;
    display_name?: string;
}

interface APIMapSummary {
    id: number;
    name: string;
    num_chapters: number;
    gb_mod_id: string;
}
