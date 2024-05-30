import express from "express";
import { SettingsController } from "../../controllers/settings.controller";
import { JWT } from "src/class/jwt.class";

const router = express.Router();

router.get("/", SettingsController.get);

router.patch("/", SettingsController.update);

router.delete("/", SettingsController.remove);

export default router;
