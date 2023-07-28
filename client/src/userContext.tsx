import React from "react";
import { getThisUser } from "./api/user";

interface UserInfoContext {
    userInfo?: APIUserInfo;
    relogin: () => void;
}

export const UserContext = React.createContext<UserInfoContext>({
    relogin: () => {
        throw new Error("Relogin called before defined?");
    },
});

export function UserProvider(props: React.PropsWithChildren) {
    const [userInfo, setUserInfo] = React.useState<APIUserInfo>(null);

    function relogin() {
        getThisUser(setUserInfo);
    }

    React.useEffect(relogin, []);

    return (
        <UserContext.Provider value={{ userInfo, relogin }}>
            {props.children}
        </UserContext.Provider>
    );
}
