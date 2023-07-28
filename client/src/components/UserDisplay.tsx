import { useContext } from "react";
import { UserContext } from "../userContext";
import { Dropdown } from "./dropdown/Dropdown";
import { logoutUser } from "../api/user";

export function UserDisplay() {
    const user = useContext(UserContext);

    if (!user) {
        return <div>Loading...</div>;
    }

    if (!user.loggedIn) {
        return (
            <a href="/login" className="no-recolor">
                Not logged in
            </a>
        );
    }

    async function logout() {
        await logoutUser();
    }

    return (
        <Dropdown
            label={user.username}
            buttons={[
                {
                    label: "Log Out",
                    action: logout,
                },
            ]}
        />
    );
}
