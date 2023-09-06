import { Router } from "express";
import { addMap, getMapList } from "../../database/maps";
import { getMapData } from "../../gamebanana";

const router = Router();

// use post to support pagination in the future
router.post("/list", async (req, res) => {
    const mapList = await getMapList();

    return res.json(mapList);
});

interface AddRequest {
    name: string;
    gblink: string;
}

router.post("/add", async (req, res) => {
    // get name and link fields from the request
    const { gblink } = req.body as AddRequest;

    if (!gblink) {
        return res.status(400).json({ error: "Missing fields" });
    }

    // extract map id from the link
    const mapMatch = gblink.match(
        /^(?:(?:https:\/\/)?gamebanana\.com\/mods\/)?(\d+)\/?$/,
    );
    if (!mapMatch) {
        return res.status(400).json({ error: "Invalid link" });
    }

    const mapID = mapMatch[1];
    const mapData = await getMapData(mapID);
    if (!mapData.success) {
        return res.status(400).json({ error: mapData.error });
    }

    // insert map into db
    const lastUpdated = new Date().toISOString();
    await addMap({
        name: mapData.data.name,
        gb_mod_id: mapID,
        last_updated: lastUpdated,
        preview_image_url: mapData.data.previewImageURL,
    });

    return res.status(200).json({ success: true });
});

export default router;
