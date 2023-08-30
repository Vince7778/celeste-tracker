import { Link, useLocation } from "react-router-dom";
import { UserDisplay } from "./UserDisplay";
import "./Header.css";

const HEADER_LINKS = [
    {
        name: "Maps",
        link: "/maps",
    },
];

export function Header() {
    const location = useLocation();

    // Create the links for the header
    const links = HEADER_LINKS.map((link, ind) => (
        <Link
            key={ind}
            to={link.link}
            className={
                "no-style header-link" +
                (location.pathname === link.link ? " active" : "")
            }
        >
            {link.name}
        </Link>
    ));

    return (
        <div
            style={{
                backgroundColor: "var(--bg-dark)",
                display: "flex",
                padding: "0px 10px",
            }}
        >
            <div id="left-header" style={{ padding: "10px 0px" }}>
                <h1>
                    <Link to="/" className="no-style">
                        Celeste Tracker
                    </Link>
                </h1>
            </div>
            <div
                style={{
                    display: "flex",
                    margin: "10px 30px 10px 0",
                    alignItems: "center",
                }}
            >
                {links}
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
