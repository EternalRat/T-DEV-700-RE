import { Request, Response } from 'express';

import CMUser from '../class/user.class';

/**
 * User controller
 *
 * Contains the logic of the user routes
 */
export namespace UserController {
	/**
	 * Handles the request to create a new user from the request body.
	 * @param {Request} req - The request object containing the user data.
	 * @param {Response} res - The response object to send the result.
	 * @returns {Promise<void>} A promise that resolves when the operation is complete.
	 */
	export const create = async (
		req: Request,
		res: Response
	): Promise<void> => {
		const user = CMUser.fromJSON(req.body);
		try {
			const newUser = await user.save();
			res.json(newUser);
		} catch {
			res.status(500).send({
				status: 'Internal Server Error',
				message: 'Could not create user',
			});
		}
	};

	/**
	 * Handles the request to get a user by its ID.
	 * @param {Request} req - The request object containing the user ID.
	 * @param {Response} res - The response object to send the result.
	 * @returns {Promise<void>} A promise that resolves when the operation is complete.
	 */
	export const get = async (req: Request, res: Response): Promise<void> => {
		try {
			const newUser = await CMUser.fetchById(parseInt(req.params.id));
			if (!newUser) {
				res.status(404).send('User not found');
				return;
			}
			res.json(newUser);
		} catch {
			res.status(500).send({
				status: 'Internal Server Error',
				message: 'User not found',
			});
		}
	};

	/**
	 * Handles the request to update a user using the data from the request body.
	 * @param {Request} req - The request object containing the user data.
	 * @param {Response} res - The response object to send the result.
	 * @returns {Promise<void>} A promise that resolves when the operation is complete.
	 */
	export const update = async (
		req: Request,
		res: Response
	): Promise<void> => {
		const user = CMUser.fromJSON(req.body);
		user.setId(parseInt(req.params.id));
		try {
			const updatedUser = await user.update();
			res.json(updatedUser);
		} catch {
			res.status(500).send({
				status: 'Internal Server Error',
				message: 'An unknown error occurred',
			});
		}
	};

	/**
	 * Handles the request to remove a user by its ID.
	 * @param {Request} req - The request object containing the ID of the user to delete.
	 * @param {Response} res - The response object to send the result.
	 * @returns {Promise<void>} A promise that resolves when the operation is complete.
	 */
	export const remove = async (
		req: Request,
		res: Response
	): Promise<void> => {
		const user = new CMUser();
		user.setId(parseInt(req.params.id));
		try {
			await user.delete();
			res.status(204).send();
		} catch {
			res.status(500).send({
				status: 'Internal Server Error',
				message: 'An unknown error occurred',
			});
		}
	};

	/**
	 * Handles the request to get all users.
	 * @param {Request} req - The request object.
	 * @param {Response} res - The response object to send the result.
	 * @returns {Promise<void>} A promise that resolves when the operation is complete.
	 */
	export const getAll = async (
		req: Request,
		res: Response
	): Promise<void> => {
		try {
			const users = await CMUser.fetchAll();
			res.json(users);
		} catch {
			res.status(500).send({
				status: 'Internal Server Error',
				message: 'An unknown error occurred',
			});
		}
	};

	/**
	 * Handles the request to get a user by its NFC.
	 * @param {Request} req - The request object containing the NFC ID.
	 * @param {Response} res - The response object to send the result.
	 * @returns {Promise<void>} A promise that resolves when the operation is complete.
	 */
	export const getByNFC = async (
		req: Request,
		res: Response
	): Promise<void> => {
		try {
			const user = await CMUser.fetchByNFC(req.params.id);
			if (!user) {
				res.status(404).send('User not found');
				return;
			}
			res.json(user);
		} catch {
			res.status(500).send({
				status: 'Internal Server Error',
				message: 'An unknown error occurred',
			});
		}
	};

	/**
	 * Handles the request to get a user by its QR code.
	 * @param {Request} req - The request object containing the QR code ID.
	 * @param {Response} res - The response object to send the result.
	 * @returns {Promise<void>} A promise that resolves when the operation is complete.
	 */
	export const getByQRCode = async (
		req: Request,
		res: Response
	): Promise<void> => {
		try {
			const user = await CMUser.fetchByQRCode(req.params.id);
			if (!user) {
				res.status(404).send('User not found');
				return;
			}
			res.json(user);
		} catch {
			res.status(500).send({
				status: 'Internal Server Error',
				message: 'An unknown error occurred',
			});
		}
	};

	/**
	 * Handles the request to delete all users.
	 * @param {Request} req - The request object.
	 * @param {Response} res - The response object to send the result.
	 * @returns {Promise<void>} A promise that resolves when the operation is complete.
	 */
	export const deleteAll = async (
		req: Request,
		res: Response
	): Promise<void> => {
		try {
			await CMUser.deleteAll();
			res.status(204).send();
		} catch {
			res.status(500).send({
				status: 'Internal Server Error',
				message: 'An unknown error occurred',
			});
		}
	};
}
