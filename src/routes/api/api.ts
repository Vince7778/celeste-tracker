import { Router } from "express";
import UsersRouter from "./users";
import MapsRouter from "./maps";

const router = Router();

router.use("/users", UsersRouter);
router.use("/maps", MapsRouter);

export function getAPIRouter() {
    return router;
}
