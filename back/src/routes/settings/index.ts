import express from 'express';

import { SettingsController } from '../../controllers/settings.controller';

const router = express.Router();

/**
 * @swagger
 * /settings:
 *   get:
 *     summary: Get settings by merchant ID
 *     description: Fetches configurations by the merchant ID.
 *     tags:
 *       - Settings
 *     responses:
 *       200:
 *         description: Successfully fetched settings
 *       404:
 *         description: Settings not found
 *       500:
 *         description: Internal server error
 */
router.get('/', SettingsController.get);

/**
 * @swagger
 * /settings:
 *   patch:
 *     summary: Update settings
 *     description: Updates a configuration with the provided settings data.
 *     tags:
 *       - Settings
 *     requestBody:
 *       description: The new settings data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               settings:
 *                 type: object
 *                 properties:
 *                   // Specify the properties of your settings object here
 *     responses:
 *       200:
 *         description: Successfully updated settings
 *       500:
 *         description: Internal server error
 */
router.patch('/', SettingsController.update);

/**
 * @swagger
 * /settings:
 *   delete:
 *     summary: Delete settings
 *     description: Deletes a configuration.
 *     tags:
 *       - Settings
 *     responses:
 *       204:
 *         description: Successfully deleted settings
 *       500:
 *         description: Internal server error
 */
router.delete('/', SettingsController.remove);

export default router;
