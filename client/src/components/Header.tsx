import { UserDisplay } from "./UserDisplay";

export function Header() {
    return (
        <div
            style={{
                padding: "10px",
                backgroundColor: "var(--bg-dark)",
                display: "flex",
            }}
        >
            <div id="left-header">
                <h1>Celeste Tracker</h1>
            </div>
            <div
                id="right-header"
                style={{
                    display: "flex",
                    marginLeft: "auto",
                    alignItems: "center",
                }}
            >
                <UserDisplay />
            </div>
        </div>
    );
}
