import express from "express";
import authRoutes from "./auth";
import productRoutes from "./product";
import userRoutes from "./user";
import settingsRoutes from "./settings";
import { JWT } from "../class/jwt.class";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/product", JWT.authToken, productRoutes);
router.use("/user", JWT.authToken, userRoutes);
router.use("/settings", JWT.authToken, settingsRoutes);

export default router;
