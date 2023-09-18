import { HTMLForm } from "../../src/components/HTMLForm";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import React from "react";

const mockFetch = jest.fn();
window.fetch = mockFetch;

describe("HTMLForm", () => {
    it("should create a fetch request", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
        });

        render(
            <HTMLForm action="https://example.com/test" method="post">
                <input type="text" name="test" />
                <button type="submit">Submit</button>
            </HTMLForm>,
        );

        userEvent.type(screen.getByRole("textbox"), "test value");
        userEvent.click(screen.getByText("Submit"));

        expect(mockFetch).toBeCalledTimes(1);
        const calledWith = mockFetch.mock.calls[0];
        expect(calledWith[0]).toBe("https://example.com/test");
        expect(calledWith[1]).toMatchObject({
            method: "post",
            body: expect.anything(),
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded;charset=UTF-8",
            },
        });

        const params = calledWith[1].body as URLSearchParams;
        expect(params.get("test")).toBe("test value");
    });

    it("should call the success callback on success", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
        });

        const successCallback = jest.fn();
        render(
            <HTMLForm
                action="https://example.com/test"
                method="post"
                onSuccess={successCallback}
                ignoreResponseData
            >
                <input type="text" name="test" />
                <button type="submit">Submit</button>
            </HTMLForm>,
        );

        userEvent.type(screen.getByRole("textbox"), "test value");
        userEvent.click(screen.getByText("Submit"));

        await waitFor(() => expect(successCallback).toBeCalledTimes(1));
    });

    it("should call the error callback on error", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({}),
        });

        const errorCallback = jest.fn();
        render(
            <HTMLForm
                action="https://example.com/test"
                method="post"
                onError={errorCallback}
                ignoreResponseData
            >
                <input type="text" name="test" />
                <button type="submit">Submit</button>
            </HTMLForm>,
        );

        userEvent.type(screen.getByRole("textbox"), "test value");
        userEvent.click(screen.getByText("Submit"));

        await waitFor(() => expect(errorCallback).toBeCalledTimes(1));
    });

    it("should call the success callback on success with data", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ test: "test value" }),
        });

        const successCallback = jest.fn();
        render(
            <HTMLForm
                action="https://example.com/test"
                method="post"
                onSuccess={successCallback}
            >
                <input type="text" name="test" />
                <button type="submit">Submit</button>
            </HTMLForm>,
        );

        userEvent.type(screen.getByRole("textbox"), "test value");
        userEvent.click(screen.getByText("Submit"));

        await waitFor(() => {
            expect(successCallback).toBeCalledTimes(1);
        });
        await waitFor(() => {
            expect(successCallback).toBeCalledWith({ test: "test value" });
        });
    });

    it("should call the error callback on error with data", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ test: "test value" }),
        });

        const errorCallback = jest.fn();
        render(
            <HTMLForm
                action="https://example.com/test"
                method="post"
                onError={errorCallback}
            >
                <input type="text" name="test" />
                <button type="submit">Submit</button>
            </HTMLForm>,
        );

        userEvent.type(screen.getByRole("textbox"), "test value");
        userEvent.click(screen.getByText("Submit"));

        await waitFor(() => {
            expect(errorCallback).toBeCalledTimes(1);
        });
        await waitFor(() => {
            expect(errorCallback).toBeCalledWith({ test: "test value" });
        });
    });

    it("should call the beforeSubmit callback before submitting", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
        });

        const beforeSubmitCallback = jest.fn();
        render(
            <HTMLForm
                action="https://example.com/test"
                method="post"
                beforeSubmit={beforeSubmitCallback}
                ignoreResponseData
            >
                <input type="text" name="test" />
                <button type="submit">Submit</button>
            </HTMLForm>,
        );

        userEvent.type(screen.getByRole("textbox"), "test value");
        userEvent.click(screen.getByText("Submit"));

        expect(beforeSubmitCallback).toBeCalledTimes(1);
    });
});
