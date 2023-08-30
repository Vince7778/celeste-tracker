import { useContext } from "react";
import { UserContext } from "../userContext";
import { Dropdown } from "./dropdown/Dropdown";
import { logoutUser } from "../api/user";
import { useLocation, useNavigate } from "react-router-dom";

export function UserDisplay() {
    const userCtx = useContext(UserContext);
    const user = userCtx.userInfo;
    const navigate = useNavigate();
    const prevLocation = useLocation();

    if (!user) {
        return <div>Loading...</div>;
    }

    function redirectLogin() {
        navigate(`/login?redirect=${prevLocation.pathname}`);
    }

    if (!user.loggedIn) {
        return (
            <button className="no-style" onClick={redirectLogin}>
                Log in
            </button>
        );
    }

    async function logout() {
        await logoutUser();
        userCtx.relogin();
    }

    return (
        <Dropdown
            label={user.username}
            buttons={[
                {
                    label: "Profile",
                    action: () => navigate(`/users/${user.username}`),
                },
                {
                    label: "Log Out",
                    action: logout,
                },
            ]}
        />
    );
}
