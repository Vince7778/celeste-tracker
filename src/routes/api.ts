import { Router } from "express";

const router = Router();

router.get("/userinfo", (req, res) => {
    if (!req.user) {
        return res.json({ loggedIn: false });
    }

    const user = req.user as any;
    return res.json({
        loggedIn: true,
        id: user.id,
        username: user.username,
    });
});

export function getAPIRouter() {
    return router;
}
