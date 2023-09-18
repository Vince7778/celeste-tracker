import { render, screen } from "@testing-library/react";
import { UserContext } from "../../src/userContext";
import React from "react";
import { UserDisplay } from "../../src/components/UserDisplay";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

// mock react-router-dom navigate
const mockNavigate = jest.fn();
const mockLocation = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
}));

describe("UserDisplay", () => {
    it("should render logged out", async () => {
        const userCtx = {
            userInfo: {
                loggedIn: false as const,
            },
            relogin: () => {},
        };
        render(
            <UserContext.Provider value={userCtx}>
                <UserDisplay />
            </UserContext.Provider>,
        );
        expect(screen.getByText("Log in")).toBeInTheDocument();
    });

    it("should render logged in", async () => {
        const userCtx = {
            userInfo: {
                loggedIn: true as const,
                username: "test user",
            },
            relogin: () => {},
        };
        render(
            <UserContext.Provider value={userCtx as any}>
                <UserDisplay />
            </UserContext.Provider>,
        );
        expect(screen.getByText("test user")).toBeInTheDocument();

        // try navigating to profile
        mockNavigate.mockClear();
        userEvent.click(screen.getByText("test user"));
        userEvent.click(screen.getByText("Profile"));

        expect(mockNavigate).toBeCalledTimes(1);
        expect(mockNavigate).toBeCalledWith("/users/test user");
    });
});
