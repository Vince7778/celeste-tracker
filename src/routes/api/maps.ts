import { Router } from "express";
import { addMap, getMapList } from "../../database/maps";

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
    const { name, gblink } = req.body as AddRequest;

    if (!name || !gblink) {
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

    // TODO: verify that this is an actual map

    // TODO: automatically get name

    // insert map into db
    await addMap({ name, gb_mod_id: mapID });

    return res.status(200).json({ success: true });
});

export default router;
