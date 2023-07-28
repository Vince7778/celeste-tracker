export async function getThisUser(callback?: (res: APIUserInfo) => void) {
    const res = await fetch("/api/thisuser");
    const userJSON: APIUserInfo = await res.json();
    if (callback) callback(userJSON);
    return userJSON;
}

export async function logoutUser() {
    const res = await fetch("/logout", { method: "POST" });
    if (res.redirected) {
        window.location.href = res.url;
    }
}

export async function getProfile(username: string) {
    const res = await fetch(`/api/userinfo?username=${username}`);
    if (res.status === 404) {
        return null;
    }
    const profileJSON: APIUserProfile = await res.json();
    return profileJSON;
}
