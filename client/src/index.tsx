import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from "./routes/root";
import { Main } from "./routes/main";
import { Login } from "./routes/login";
import { Signup } from "./routes/signup";
import { UserProvider } from "./userContext";
import { TestPage } from "./routes/testpage";
import { profileLoader, UserProfile } from "./routes/user";
import { Maps } from "./routes/maps";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "/",
                element: <Main />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/signup",
                element: <Signup />,
            },
            {
                path: "/testpage",
                element: <TestPage />,
            },
            {
                path: "/users/:username",
                element: <UserProfile />,
                loader: profileLoader,
            },
            {
                path: "/maps",
                element: <Maps />,
            },
        ],
    },
]);

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement,
);
root.render(
    <React.StrictMode>
        <UserProvider>
            <RouterProvider router={router} />
        </UserProvider>
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
