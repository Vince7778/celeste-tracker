import { Router } from "express";
import { getUserProfile } from "../../database/users";

const router = Router();

router.get("/me", (req, res) => {
    if (!req.user) {
        return res.json({ loggedIn: false });
    }

    const user = req.user as any;
    return res.json({
        loggedIn: true,
        id: user.id,
        username: user.username,
        roles: user.roles,
    });
});

router.get("/", async (req, res) => {
    const username = req.query.username;
    if (!username) {
        return res.status(400).json({ error: "No username provided" });
    }

    const userProfile = await getUserProfile(username as string);
    if (!userProfile) {
        return res.status(404).json({ error: "User not found" });
    }

    return res.json(userProfile);
});

export default router;
