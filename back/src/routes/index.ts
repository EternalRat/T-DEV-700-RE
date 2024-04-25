import express from "express";
import authRoutes from "./auth";
import productRoutes from "./product";
import userRoutes from "./user";
import { JWT } from "../class/jwt.class";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/product", JWT.authToken, productRoutes);
router.use("/user", JWT.authToken, userRoutes);

export default router;
