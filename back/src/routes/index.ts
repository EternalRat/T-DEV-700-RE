import express from "express";
import authRoutes from "./auth";
import productRoutes from "./product";
import userRoutes from "./user";
import settingsRoutes from "./settings";
import { JWT } from "../class/jwt.class";

const router = express.Router();

/**
 * @swagger
 * /auth:
 *   post:
 *     description: Routes related to authentication.
 *     responses:
 *       200:
 *         description: Successful response.
 */
router.use("/auth", authRoutes);

/**
 * @swagger
 * /product:
 *   get:
 *     description: Routes related to products, protected by JWT authentication.
 *     responses:
 *       200:
 *         description: Successful response.
 *       401:
 *         description: Unauthorized.
 */
router.use("/product", JWT.authToken, productRoutes);

/**
 * @swagger
 * /user:
 *   get:
 *     description: Routes related to users, protected by JWT authentication.
 *     responses:
 *       200:
 *         description: Successful response.
 *       401:
 *         description: Unauthorized.
 */
router.use("/user", JWT.authToken, userRoutes);

/**
 * @swagger
 * /settings:
 *   get:
 *     description: Routes related to settings, protected by JWT authentication.
 *     responses:
 *       200:
 *         description: Successful response.
 *       401:
 *         description: Unauthorized.
 */
router.use("/settings", JWT.authToken, settingsRoutes);

export default router;
