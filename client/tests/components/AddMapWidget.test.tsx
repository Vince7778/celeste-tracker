import { AddMapWidget } from "../../src/components/AddMapWidget";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import React from "react";

const mockFetch = jest.fn();
window.fetch = mockFetch;

describe("AddMapWidget", () => {
    it("should create a fetch request", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
        });

        render(<AddMapWidget />);

        userEvent.type(screen.getByRole("textbox"), "test value");
        userEvent.click(screen.getByRole("button"));

        await screen.findByText("Map added successfully!");

        expect(mockFetch).toBeCalledTimes(1);
        const calledWith = mockFetch.mock.calls[0];
        // can't do this because it'll have localhost
        // expect(calledWith[0]).toBe("/api/maps/add");
        expect(calledWith[1]).toMatchObject({
            method: "post",
            body: expect.anything(),
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded;charset=UTF-8",
            },
        });

        const params = calledWith[1].body as URLSearchParams;
        expect(params.get("gblink")).toBe("test value");
    });

    it("should display an error message on error", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({
                error: "test error",
            }),
        });

        render(<AddMapWidget />);

        userEvent.type(screen.getByRole("textbox"), "test value");
        userEvent.click(screen.getByRole("button"));

        await waitFor(() => {
            expect(screen.getByText("test error")).toBeInTheDocument();
        });
    });

    it("should call the success callback and display a message on success", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
        });

        const successCallback = jest.fn();
        render(<AddMapWidget onAddMap={successCallback} />);

        userEvent.type(screen.getByRole("textbox"), "test value");
        userEvent.click(screen.getByRole("button"));

        await waitFor(() => {
            expect(successCallback).toBeCalledTimes(1);
        });
        await waitFor(() => {
            expect(
                screen.getByText("Map added successfully!"),
            ).toBeInTheDocument();
        });
    });
});
