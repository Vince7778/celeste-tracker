import { useContext, useEffect } from "react";
import { UserContext } from "../../userContext";
import { getProfile } from "../../api/user";
import {
    LoaderFunctionArgs,
    redirect,
    useLoaderData,
    useNavigate,
} from "react-router-dom";

export async function profileLoader({ params }: LoaderFunctionArgs) {
    if (!params.username) {
        return redirect("/users/me");
    }
    if (params.username === "me") {
        return "me";
    }
    try {
        return await getProfile(params.username);
    } catch (e) {
        return null;
    }
}

export function UserProfile() {
    const userInfo = useContext(UserContext).userInfo;
    const navigate = useNavigate();
    const userProfile = useLoaderData() as APIUserProfile | "me" | null;

    useEffect(() => {
        if (userProfile === "me") {
            if (userInfo) {
                if (userInfo.loggedIn) {
                    return navigate(`/users/${userInfo.username}`);
                }
                return navigate("/login");
            }
        }
    }, [userProfile, userInfo, navigate]);

    if (userProfile === "me") {
        return <div>Loading...</div>;
    }

    if (!userProfile) {
        return <div>User not found</div>;
    }

    // whether this profile belongs to the logged in user
    const isThisUser =
        userInfo?.loggedIn && userInfo?.username === userProfile.username;

    let rolesList = userProfile.roles
        .map((role) => role.display_name ?? role.name)
        .join(", ");
    if (rolesList === "") {
        rolesList = "None";
    }

    return (
        <div>
            <h1>{userProfile.username}</h1>
            {userProfile.creation_date && (
                <div>
                    Account created{" "}
                    {new Date(userProfile.creation_date).toLocaleDateString()}
                </div>
            )}
            {isThisUser && <div>This is you!</div>}
            <div>Roles: {rolesList}</div>
        </div>
    );
}
