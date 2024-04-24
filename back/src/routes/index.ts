import express from "express";
import merchantRoutes from "./merchant";
import productRoutes from "./product";
import userRoutes from "./user";

const router = express.Router();

router.use("/merchant", merchantRoutes);
router.use("/product", productRoutes);
router.use("/user", userRoutes);

export default router;
