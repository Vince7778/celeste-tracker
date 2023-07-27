interface APIUserInfoLoggedOut {
    loggedIn: false;
}

interface APIUserInfoLoggedIn {
    loggedIn: true;
    id: number;
    username: string;
}

type APIUserInfo = APIUserInfoLoggedOut | APIUserInfoLoggedIn | null;
