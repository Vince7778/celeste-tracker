import { getMapData } from "../src/gamebanana";

global.fetch = jest.fn();

describe("GameBanana getMapData", () => {
    it("should fail if ID is invalid", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce({
                error: "Invalid mod ID",
                error_code: "INVALID_PARAMS",
            }),
        });

        const data = await getMapData("123456789");
        expect(fetch).toHaveBeenCalledWith(
            "https://api.gamebanana.com/Core/Item/Data?itemtype=Mod&itemid=123456789&fields=name,Game().name,Category().name,Preview().sSubFeedImageUrl()&return_keys=1",
        );
        expect(data).toEqual({
            success: false,
            error: "Invalid mod ID",
        });
    });

    it("should fail if GameBanana API returns unknown error", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce({
                error: "Unknown error",
                error_code: "UNKNOWN_ERROR",
            }),
        });

        expect(async () => {
            await getMapData("123456789");
        }).rejects.toThrow("Unknown error");
        expect(fetch).toHaveBeenCalledWith(
            "https://api.gamebanana.com/Core/Item/Data?itemtype=Mod&itemid=123456789&fields=name,Game().name,Category().name,Preview().sSubFeedImageUrl()&return_keys=1",
        );
    });

    it("should fail if mod is not for Celeste", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce({
                name: "Test Map",
                "Game().name": "Not Celeste",
                "Category().name": "Maps",
                "Preview().sSubFeedImageUrl()":
                    "https://example.com/example.png",
            }),
        });

        const data = await getMapData("123456789");
        expect(fetch).toHaveBeenCalledWith(
            "https://api.gamebanana.com/Core/Item/Data?itemtype=Mod&itemid=123456789&fields=name,Game().name,Category().name,Preview().sSubFeedImageUrl()&return_keys=1",
        );
        expect(data).toEqual({
            success: false,
            error: "Mod is not for Celeste",
        });
    });

    it("should fail if mod is not in a valid category", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce({
                name: "Test Map",
                "Game().name": "Celeste",
                "Category().name": "Skins",
                "Preview().sSubFeedImageUrl()":
                    "https://example.com/example.png",
            }),
        });

        const data = await getMapData("123456789");
        expect(fetch).toHaveBeenCalledWith(
            "https://api.gamebanana.com/Core/Item/Data?itemtype=Mod&itemid=123456789&fields=name,Game().name,Category().name,Preview().sSubFeedImageUrl()&return_keys=1",
        );
        expect(data).toEqual({
            success: false,
            error: "Mod is not in a valid category",
        });
    });

    it("should return map data if valid", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce({
                name: "Test Map",
                "Game().name": "Celeste",
                "Category().name": "Standalone",
                "Preview().sSubFeedImageUrl()":
                    "https://example.com/example.png",
            }),
        });

        const data = await getMapData("123456789");
        expect(fetch).toHaveBeenCalledWith(
            "https://api.gamebanana.com/Core/Item/Data?itemtype=Mod&itemid=123456789&fields=name,Game().name,Category().name,Preview().sSubFeedImageUrl()&return_keys=1",
        );
        expect(data).toEqual({
            success: true,
            data: {
                name: "Test Map",
                previewImageURL: "https://example.com/example.png",
            },
        });
    });
});
