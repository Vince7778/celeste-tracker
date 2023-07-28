import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./login.css";
import { useContext } from "react";
import { UserContext } from "../userContext";

export function Login() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const userInfoCtx = useContext(UserContext);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        const username = data.get("username") as string;
        const password = data.get("password") as string;

        const myParams = new URLSearchParams({
            username,
            password,
        });

        const res = await fetch(form.action, {
            method: form.method,
            body: myParams,
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded;charset=UTF-8",
            },
        });

        if (res.ok) {
            if (searchParams.has("redirect")) {
                userInfoCtx.relogin();
                navigate(searchParams.get("redirect")!);
            } else {
                navigate("/");
            }
        }
    }

    return (
        <>
            <h2>Sign in</h2>
            <form
                action="/login/password"
                method="post"
                style={{ marginBottom: "10px" }}
                onSubmit={handleSubmit}
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
            </form>
            <Link to="/signup">Sign up</Link>
        </>
    );
}
