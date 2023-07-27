import { useContext } from "react";
import { UserContext } from "../userContext";

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

    return <div>{user.username}</div>;
}
