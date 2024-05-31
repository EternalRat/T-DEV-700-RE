import { Merchant } from '@prisma/client';
import { Request, Response } from 'express';

import { Configuration } from '../class/configuration.class';

export namespace SettingsController {
	/**
	 * Handles the GET request to fetch configurations by merchant ID.
	 * @param {Request} req - The request object containing the user information.
	 * @param {Response} res - The response object to send the results.
	 * @return {Promise<void>} A promise that resolves when the operation is complete.
	 */
	export const get = async (req: Request, res: Response): Promise<void> => {
		const id = (req.user as Merchant).id; // Extracts the user ID from the request object
		const settings = await Configuration.fetchByMerchantId(id); // Fetches settings by merchant ID
		if (!settings) {
			res.status(404).send({
				status: 'error',
				message: 'Error fetching settings',
			});
			return;
		}
		res.json({ settings }); // Sends the fetched settings as a JSON response
	};

	/**
	 * Handles the PUT request to update a configuration.
	 * @param {Request} req - The request object containing the new settings and user information.
	 * @param {Response} res - The response object to send the results.
	 * @return {Promise<void>} A promise that resolves when the operation is complete.
	 */
	export const update = async (
		req: Request,
		res: Response
	): Promise<void> => {
		const { settings } = req.body; // Extracts the setting parameter from the request
		const id = (req.user as Merchant).id; // Extracts the user ID from the request object
		const configuration = Configuration.fromJSON({
			...settings, // Parses the setting parameter into a JSON object
			merchantId: id, // Adds the merchant ID to the configuration
		});
		try {
			const config = await configuration.update(); // Updates the configuration in the database
			res.json(config); // Sends the updated configuration as a JSON response
		} catch {
			res.status(500).send({
				status: 'Internal Server Error',
				message: 'An unknown error occurred',
			});
		}
	};

	/**
	 * Handles the DELETE request to remove a configuration.
	 * @param {Request} req - The request object containing the ID of the configuration to delete.
	 * @param {Response} res - The response object to send the results.
	 * @return {Promise<void>} A promise that resolves when the operation is complete.
	 */
	export const remove = async (
		req: Request,
		res: Response
	): Promise<void> => {
		const { id } = req.params; // Extracts the ID parameter from the request
		try {
			const configuration = Configuration.fromJSON({ id }); // Creates a Configuration instance from the ID
			await configuration.delete(); // Deletes the configuration from the database
			res.status(204).send(); // Sends a 204 No Content status indicating successful deletion
		} catch {
			res.status(500).send({
				status: 'Internal Server Error',
				message: 'An unknown error occurred',
			});
		}
	};
}
