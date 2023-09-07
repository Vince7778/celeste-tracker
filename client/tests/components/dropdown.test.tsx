import { render, screen } from "@testing-library/react";
import { Dropdown } from "../../src/components/dropdown/Dropdown";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import React from "react";

describe("Dropdown", () => {
    it("should render closed", async () => {
        const buttons = [
            {
                label: "test button",
                action: () => {},
            },
        ];
        render(<Dropdown label="test label" buttons={buttons} />);

        expect(screen.getByText("test label")).toBeInTheDocument();
        expect(screen.getByText("test button")).not.toBeVisible();
    });

    it("should open after click", async () => {
        const buttons = [
            {
                label: "test button",
                action: () => {},
            },
        ];
        render(<Dropdown label="test label" buttons={buttons} />);

        userEvent.click(screen.getByText("test label"));

        expect(screen.getByText("test button")).toBeVisible();
    });

    it("should close after clicking outside", async () => {
        const buttons = [
            {
                label: "test button",
                action: () => {},
            },
        ];
        render(<Dropdown label="test label" buttons={buttons} />);

        userEvent.click(screen.getByText("test label"));
        userEvent.click(document.body);

        expect(screen.getByText("test button")).not.toBeVisible();
    });

    it("should close after clicking on dropdown while it's open", async () => {
        const buttons = [
            {
                label: "test button",
                action: () => {},
            },
        ];
        render(<Dropdown label="test label" buttons={buttons} />);

        userEvent.click(screen.getByText("test label"));
        userEvent.click(screen.getByText("test label"));

        expect(screen.getByText("test button")).not.toBeVisible();
    });

    it("should close after clicking on button if keepOpen is false", async () => {
        const mockButton = jest.fn();
        const buttons = [
            {
                label: "test button",
                action: mockButton,
            },
        ];
        render(<Dropdown label="test label" buttons={buttons} />);

        userEvent.click(screen.getByText("test label"));
        userEvent.click(screen.getByText("test button"));

        expect(screen.getByText("test button")).not.toBeVisible();
        expect(mockButton).toHaveBeenCalled();
    });

    it("should not close after clicking on button if keepOpen is true", async () => {
        const mockButton = jest.fn();
        const buttons = [
            {
                label: "test button",
                action: mockButton,
                keepOpen: true,
            },
        ];
        render(<Dropdown label="test label" buttons={buttons} />);

        userEvent.click(screen.getByText("test label"));
        userEvent.click(screen.getByText("test button"));

        expect(screen.getByText("test button")).toBeVisible();
        expect(mockButton).toHaveBeenCalled();
    });
});
