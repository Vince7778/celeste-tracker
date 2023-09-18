import { render, screen } from "@testing-library/react";
import { MapList } from "../../src/components/maps/MapList";
import "@testing-library/jest-dom";
import React from "react";
import { Map } from "../../src/components/maps/Map";

describe("Maps and MapList", () => {
    describe("Map", () => {
        it("should render", async () => {
            const map = {
                id: 123,
                name: "test map",
                num_chapters: 2,
                gb_mod_id: "123",
                preview_image_url: "test url",
            };
            render(<Map map={map} />);
            expect(screen.getByText("test map")).toBeInTheDocument();
            expect(screen.getByText("2 chapters")).toBeInTheDocument();
            expect(
                screen.getByAltText("Thumbnail for map test map"),
            ).toBeInTheDocument();
            expect(
                screen.getByAltText("Thumbnail for map test map"),
            ).toHaveAttribute("src", "test url");
            expect(screen.getByText("test map")).toHaveAttribute(
                "href",
                "https://gamebanana.com/mods/123",
            );
        });

        it("should render without image", async () => {
            const map = {
                id: 123,
                name: "test map",
                num_chapters: 2,
                gb_mod_id: "123",
            };
            render(<Map map={map} />);
            expect(screen.getByText("test map")).toBeInTheDocument();
            expect(screen.getByText("2 chapters")).toBeInTheDocument();
            expect(
                screen.queryByAltText("Thumbnail for map test map"),
            ).not.toBeInTheDocument();
            expect(screen.getByText("test map")).toHaveAttribute(
                "href",
                "https://gamebanana.com/mods/123",
            );
        });

        it("should render without GameBanana link", async () => {
            const map = {
                id: 123,
                name: "test map",
                num_chapters: 2,
                preview_image_url: "test url",
            };
            render(<Map map={map} />);
            expect(screen.getByText("test map")).toBeInTheDocument();
            expect(screen.getByText("2 chapters")).toBeInTheDocument();
            expect(
                screen.getByAltText("Thumbnail for map test map"),
            ).toBeInTheDocument();
            expect(
                screen.getByAltText("Thumbnail for map test map"),
            ).toHaveAttribute("src", "test url");
            expect(screen.getByText("test map")).not.toHaveAttribute("href");
        });

        it("should render without image or GameBanana link", async () => {
            const map = {
                id: 123,
                name: "test map",
                num_chapters: 2,
            };
            render(<Map map={map} />);
            expect(screen.getByText("test map")).toBeInTheDocument();
            expect(screen.getByText("2 chapters")).toBeInTheDocument();
            expect(
                screen.queryByAltText("Thumbnail for map test map"),
            ).not.toBeInTheDocument();
            expect(screen.getByText("test map")).not.toHaveAttribute("href");
        });

        it("should not pluralize chapters if there is only one", async () => {
            const map = {
                id: 123,
                name: "test map",
                num_chapters: 1,
            };
            render(<Map map={map} />);
            expect(screen.getByText("1 chapter")).toBeInTheDocument();
            expect(screen.queryByText("1 chapters")).not.toBeInTheDocument();
        });
    });

    describe("MapList", () => {
        it("should display all maps", async () => {
            const mapList = [
                {
                    id: 123,
                    name: "test map",
                    num_chapters: 2,
                    gb_mod_id: "123",
                    preview_image_url: "test url",
                },
                {
                    id: 456,
                    name: "test map 2",
                    num_chapters: 3,
                    gb_mod_id: "456",
                    preview_image_url: "test url 2",
                },
            ];
            render(<MapList mapList={mapList} />);
            expect(screen.getByText("test map")).toBeInTheDocument();
            expect(screen.getByText("test map 2")).toBeInTheDocument();
            expect(screen.getByText("2 chapters")).toBeInTheDocument();
            expect(screen.getByText("3 chapters")).toBeInTheDocument();
            expect(
                screen.getByAltText("Thumbnail for map test map"),
            ).toBeInTheDocument();
            expect(
                screen.getByAltText("Thumbnail for map test map"),
            ).toHaveAttribute("src", "test url");
            expect(
                screen.getByAltText("Thumbnail for map test map 2"),
            ).toBeInTheDocument();
            expect(
                screen.getByAltText("Thumbnail for map test map 2"),
            ).toHaveAttribute("src", "test url 2");
            expect(screen.getByText("test map")).toHaveAttribute(
                "href",
                "https://gamebanana.com/mods/123",
            );
            expect(screen.getByText("test map 2")).toHaveAttribute(
                "href",
                "https://gamebanana.com/mods/456",
            );
        });
    });
});
