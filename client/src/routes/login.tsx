import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./login.css";
import { useContext } from "react";
import { UserContext } from "../userContext";
import { HTMLForm } from "../components/HTMLForm";

export function Login() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const userInfoCtx = useContext(UserContext);

    function onSuccess() {
        if (searchParams.has("redirect")) {
            userInfoCtx.relogin();
            navigate(searchParams.get("redirect")!);
        } else {
            navigate("/");
        }
    }

    return (
        <>
            <h2>Sign in</h2>
            <HTMLForm
                action="/login/password"
                method="post"
                style={{ marginBottom: "10px" }}
                onSuccess={onSuccess}
                ignoreResponseData
            >
                <section>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        autoFocus
                    />
                </section>
                <section>
                    <label htmlFor="current-password">Password</label>
                    <input
                        id="current-password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                    />
                </section>
                <button type="submit">Sign in</button>
            </HTMLForm>
            <Link to="/signup">Sign up</Link>
        </>
    );
}
