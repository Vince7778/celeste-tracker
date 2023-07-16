import "./login.css";

export function Signup() {
    return (
        <>
            <h2>Sign Up</h2>
            <form action="/signup" method="post">
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
                    <label htmlFor="new-password">Password</label>
                    <input
                        id="new-password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                    />
                </section>
                <button type="submit">Sign up</button>
            </form>
        </>
    );
}
