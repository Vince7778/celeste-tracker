import React from "react";
import { getUserInfo } from "./api/user";

export const UserContext = React.createContext<APIUserInfo>(null);

export function UserProvider(props: React.PropsWithChildren) {
    const [userInfo, setUserInfo] = React.useState<APIUserInfo>(null);

    React.useEffect(() => {
        getUserInfo(setUserInfo);
    }, []);

    return (
        <UserContext.Provider value={userInfo}>
            {props.children}
        </UserContext.Provider>
    );
}
