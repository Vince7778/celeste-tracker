import { Outlet } from "react-router-dom";
import "./root.css";
import { Header } from "../components/Header";

export function Root() {
    return (
        <>
            <div className="header">
                <Header />
            </div>
            <div className="main">
                <Outlet />
            </div>
        </>
    );
}
