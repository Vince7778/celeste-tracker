import { addMapAPI } from "../../../src/routes/api/maps";
import { getMapData } from "../../../src/gamebanana";
import { addMap } from "../../../src/database/maps";

jest.mock("../../../src/database/maps", () => ({
    addMap: jest.fn(),
}));
jest.mock("../../../src/gamebanana");
describe("addMapAPI", () => {
    it("returns 400 if missing fields", async () => {
        const req = {
            body: {},
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await addMapAPI(req as any, res as any);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Missing fields" });
    });

    it("returns 400 if invalid link", async () => {
        const req = {
            body: {
                gblink: "https://gameorange.com/mods/1234",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await addMapAPI(req as any, res as any);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Invalid link" });
    });

    it("returns 400 if GameBanana API returns error", async () => {
        const req = {
            body: {
                gblink: "https://gamebanana.com/mods/1235871238571",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        (getMapData as jest.Mock).mockResolvedValueOnce({
            success: false,
            error: "Invalid mod ID",
        });
        await addMapAPI(req as any, res as any);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Invalid mod ID",
        });
    });

    it("adds valid maps to the database", async () => {
        const req = {
            body: {
                gblink: "https://gamebanana.com/mods/1234",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const apiData = {
            success: true,
            data: {
                name: "Test Map",
                previewImageURL: "https://example.com/example.jpg",
            },
        };

        (getMapData as jest.Mock).mockResolvedValueOnce(apiData);
        await addMapAPI(req as any, res as any);
        expect(addMap).toHaveBeenCalledWith({
            name: "Test Map",
            gb_mod_id: "1234",
            last_updated: expect.any(String),
            preview_image_url: "https://example.com/example.jpg",
        });

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
        });
    });
});
