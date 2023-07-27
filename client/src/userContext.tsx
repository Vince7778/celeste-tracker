import React from "react";

export const UserContext = React.createContext<APIUserInfo>(null);

export function UserProvider(props: React.PropsWithChildren) {
    const [userInfo, setUserInfo] = React.useState<APIUserInfo>(null);

    React.useEffect(() => {
        async function fetchInfo() {
            const res = await fetch("/api/userinfo");
            const userJSON: APIUserInfo = await res.json();
            setUserInfo(userJSON);
        }

        fetchInfo();
    }, []);

    return (
        <UserContext.Provider value={userInfo}>
            {props.children}
        </UserContext.Provider>
    );
}
