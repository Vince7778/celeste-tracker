import { getMapList } from "../../src/api/maps";

const fetchMock = jest.fn();
window.fetch = fetchMock;

describe("getMapList", () => {
    it("should return a list of maps", async () => {
        const mockMapList = [
            {
                id: 1234,
                name: "Test Map",
                num_chapters: 3,
                gb_mod_id: "1234567890",
                preview_image_url: "https://example.com/example.png",
            },
        ];

        fetchMock.mockResolvedValue({
            json: jest.fn().mockResolvedValue(mockMapList),
        });
        const result = await getMapList();
        expect(window.fetch).toHaveBeenCalledWith("/api/maps/list", {
            method: "POST",
        });
        expect(result).toEqual(mockMapList);
    });
});
