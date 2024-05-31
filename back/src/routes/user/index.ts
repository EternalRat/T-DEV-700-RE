import express from 'express';

import { UserController } from '../../controllers/user.controller';

const router = express.Router();

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     description: Retrieves a list of all users.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Successfully fetched users
 *       500:
 *         description: Internal server error
 */
router.get('/', UserController.getAll);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieves a user by its ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Successfully fetched user
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', UserController.get);

/**
 * @swagger
 * /user/nfc/{id}:
 *   get:
 *     summary: Get user by NFC ID
 *     description: Retrieves a user by its NFC ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The NFC ID
 *     responses:
 *       200:
 *         description: Successfully fetched user
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/nfc/:id', UserController.getByNFC);

/**
 * @swagger
 * /user/qrcode/{id}:
 *   get:
 *     summary: Get user by QR code ID
 *     description: Retrieves a user by its QR code ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The QR code ID
 *     responses:
 *       200:
 *         description: Successfully fetched user
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/qrcode/:id', UserController.getByQRCode);

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user with the provided data.
 *     tags:
 *       - Users
 *     requestBody:
 *       description: The user data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Specify the properties of your user object here
 *     responses:
 *       200:
 *         description: Successfully created user
 *       500:
 *         description: Internal server error
 */
router.post('/', UserController.create);

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update a user by ID
 *     description: Updates an existing user with the provided data.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     requestBody:
 *       description: The updated user data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Specify the properties of your user object here
 *     responses:
 *       200:
 *         description: Successfully updated user
 *       500:
 *         description: Internal server error
 */
router.put('/:id', UserController.update);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Deletes a user by its ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       204:
 *         description: Successfully deleted user
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', UserController.remove);

/**
 * @swagger
 * /user:
 *   delete:
 *     summary: Delete all users
 *     description: Deletes all users.
 *     tags:
 *       - Users
 *     responses:
 *       204:
 *         description: Successfully deleted all users
 *       500:
 *         description: Internal server error
 */
router.delete('/', UserController.deleteAll);

export default router;
