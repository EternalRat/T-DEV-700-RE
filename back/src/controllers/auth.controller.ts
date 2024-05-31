import { Merchant } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import CMAuth from '../class/auth.class';
import { JWT } from '../class/jwt.class';

/**
 * Auth controller
 *
 * Contains the logic of the auth routes
 */
export namespace AuthController {
	/**
	 * Handles the request to login the user.
	 * @param {Request} req - The request object containing the username and password.
	 * @param {Response} res - The response object to send the result.
	 * @returns {Promise<void>} A promise that resolves when the operation is complete.
	 */
	export const login = async (req: Request, res: Response): Promise<void> => {
		const { username, password } = req.body;
		if (!username || !password) {
			res.status(403).send({
				status: 'error',
				message: 'Missing username or password.',
			});
			return;
		}
		try {
			const user = await CMAuth.fetchByUsername(username);
			if (!user) {
				res.status(403).send({
					status: 'error',
					message: 'No user found with that username.',
				});
				return;
			}
			if (await bcrypt.compare(password, user.password)) {
				const token = jwt.sign(
					{
						id: user.id,
						username: user.name,
					},
					JWT.getInstance().getSecret(),
					{
						expiresIn: '6h',
					}
				);

				res.cookie('token', token, {
					httpOnly: true,
					secure: false,
				});

				res.status(200).send({
					status: 200,
					user: {
						name: user.name,
						id: user.id,
					},
				});
			} else {
				res.status(403).send({
					status: 'error',
					message: 'Invalid password.',
				});
			}
		} catch {
			res.status(403).send({
				status: 'error',
				message: 'Something went wrong',
			});
		}
	};

	/**
	 * Handles the request to get the logged-in user.
	 * @param {Request} req - The request object.
	 * @param {Response} res - The response object to send the result.
	 * @returns {void}
	 */
	export const getAuthedUser = (req: Request, res: Response) => {
		if (req.user) res.send({ message: 'User found', data: req.user });
		else res.status(404).json({ message: 'No user found', status: 404 });
	};

	/**
	 * Handles the request to check if the secret password is correct.
	 * @param {Request} req - The request object containing the secret password.
	 * @param {Response} res - The response object to send the result.
	 * @returns {Promise<void>} A promise that resolves when the operation is complete.
	 */
	export const checkSecretPassword = async (req: Request, res: Response) => {
		const connectedUser = req.user as Merchant;
		try {
			const user = await CMAuth.fetchById(connectedUser.id);
			if (!user) {
				res.status(404).send({
					status: 'error',
					message: 'Wrong user',
				});
				return;
			}
			const { secretPassword } = req.body;
			if (!secretPassword) {
				res.status(404).send({
					status: 'error',
					message: 'secret password is required',
				});
				return;
			}
			if (await bcrypt.compare(secretPassword, user.secretPassword)) {
				res.status(200).send();
				return;
			}
			res.status(403).send();
		} catch {
			res.status(500).send({
				status: 'Internal Server Error',
				message: 'An unknown error occurred',
			});
		}
	};
}
