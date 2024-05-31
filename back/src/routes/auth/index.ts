import express from 'express';

import { JWT } from '../../class/jwt.class';
import { AuthController } from '../../controllers/auth.controller';

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns a token.
 *     tags:
 *       - Auth
 *     requestBody:
 *       description: Username and password for login
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       403:
 *         description: Invalid credentials
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /auth:
 *   get:
 *     summary: Get authenticated user
 *     description: Retrieves the details of the authenticated user.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Successful response with user data
 *       404:
 *         description: User not found
 */
router.get('/', JWT.authToken, AuthController.getAuthedUser);

/**
 * @swagger
 * /auth/admin:
 *   post:
 *     summary: Check secret password
 *     description: Validates the secret password of an authenticated user.
 *     tags:
 *       - Auth
 *     requestBody:
 *       description: Secret password to be validated
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               secretPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Secret password is correct
 *       403:
 *         description: Invalid secret password
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/admin', JWT.authToken, AuthController.checkSecretPassword);

export default router;
