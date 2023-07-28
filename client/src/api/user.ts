export async function getUserInfo(callback?: (res: APIUserInfo) => void) {
    const res = await fetch("/api/userinfo");
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
