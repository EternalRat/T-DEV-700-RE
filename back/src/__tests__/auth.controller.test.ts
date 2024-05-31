import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

import DatabaseClient from '../class/database.class';
import { AuthController } from '../controllers/auth.controller';

describe('Auth Controller', () => {
	const res = {} as any as Response;
	const mockPrismaClient = mockDeep<PrismaClient>();

	beforeAll(() => {
		res.send = vi.fn();
		res.status = vi.fn(() => res);
		res.cookie = vi.fn(() => res);
		res.json = vi.fn();

		const mockAuthMethods = {
			findUnique: vi.fn().mockResolvedValue({
				name: 'newUser',
				password: bcrypt.hashSync('new', 10),
				id: 1,
				secretPassword: bcrypt.hashSync('secret', 10),
			}),
		};

		// Assignez l'objet des méthodes auth à la propriété auth de mockPrismaClient
		(mockPrismaClient as any).merchant = mockAuthMethods;

		vi.spyOn(DatabaseClient.prototype, 'getClient').mockReturnValue(
			mockPrismaClient
		);
	});

	afterAll(() => {
		mockReset(mockPrismaClient); // Réinitialiser les mocks après chaque test
	});

	it('should refuse login since password is missing', async () => {
		const req = {} as any as Request;
		req.body = {
			username: 'newUser',
		};

		await AuthController.login(req, res);
		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.send).toHaveBeenCalledWith({
			status: 'error',
			message: 'Missing username or password.',
		});
	});

	it('should refuse login since password is incorrect', async () => {
		const req = {} as any as Request;
		req.body = {
			username: 'newUser',
			password: 'wrongPassword',
		};

		await AuthController.login(req, res);
		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.send).toHaveBeenCalledWith({
			status: 'error',
			message: 'Invalid password.',
		});
	});

	it('should refuse login since username is incorrect', async () => {
		const mockAuthMethods = {
			fetchByUsername: vi.fn().mockResolvedValue(undefined),
		};

		const specialPrismaClient = mockDeep<PrismaClient>();
		(specialPrismaClient as any).auth = mockAuthMethods;

		vi.spyOn(DatabaseClient.prototype, 'getClient').mockReturnValue(
			specialPrismaClient
		);

		const req = {} as any as Request;
		req.body = {
			username: 'wrongUser',
			password: 'new',
		};

		await AuthController.login(req, res);
		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.send).toHaveBeenCalledWith({
			status: 'error',
			message: 'No user found with that username.',
		});

		vi.spyOn(DatabaseClient.prototype, 'getClient').mockReturnValue(
			mockPrismaClient
		);
	});

	it('should allow login using the correct username and password and create a token cookie', async () => {
		const req = {} as any as Request;
		req.body = {
			username: 'newUser',
			password: 'new',
		};

		await AuthController.login(req, res);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.cookie).toHaveBeenCalledWith('token', expect.any(String), {
			httpOnly: true,
			secure: false,
		});
		expect(res.send).toHaveBeenCalledWith({
			status: 200,
			user: {
				name: 'newUser',
				id: 1,
			},
		});
	});

	it('should handle login errors', async () => {
		const req = {} as any as Request;
		req.body = {
			username: 'newUser',
			password: 'new',
		};

		(mockPrismaClient.merchant.findUnique as any).mockRejectedValueOnce(
			new Error('Database error')
		);

		await AuthController.login(req, res);
		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.send).toHaveBeenCalledWith({
			status: 'error',
			message: 'Something went wrong',
		});
	});

	it('should return the logged user', async () => {
		const req = {} as any as Request;
		req.user = {
			username: 'newUser',
			id: 1,
		};

		await AuthController.getAuthedUser(req, res);
		expect(res.send).toHaveBeenCalledWith({
			message: 'User found',
			data: req.user,
		});
	});

	it('should return that no user is logged in', async () => {
		const req = {} as any as Request;

		await AuthController.getAuthedUser(req, res);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			message: 'No user found',
			status: 404,
		});
	});

	it('should allow checking the secret password', async () => {
		const req = {} as any as Request;
		req.user = {
			id: 1,
		};
		req.body = {
			secretPassword: 'secret',
		};

		await AuthController.checkSecretPassword(req, res);
		expect(res.status).toHaveBeenCalledWith(200);
	});

	it('should refuse checking the secret password if incorrect', async () => {
		const req = {} as any as Request;
		req.user = {
			id: 1,
		};
		req.body = {
			secretPassword: 'wrongSecret',
		};

		await AuthController.checkSecretPassword(req, res);
		expect(res.status).toHaveBeenCalledWith(403);
	});

	it('should handle missing secret password', async () => {
		const req = {} as any as Request;
		req.user = {
			id: 1,
		};
		req.body = {};

		await AuthController.checkSecretPassword(req, res);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.send).toHaveBeenCalledWith({
			status: 'error',
			message: 'secret password is required',
		});
	});

	it('should handle wrong user when checking secret password', async () => {
		const req = {} as any as Request;
		req.user = {
			id: 2,
		};
		req.body = {
			secretPassword: 'secret',
		};

		const specialPrismaClient = mockDeep<PrismaClient>();
		(specialPrismaClient as any).auth = {
			fetchById: vi.fn().mockResolvedValue(undefined),
		};

		vi.spyOn(DatabaseClient.prototype, 'getClient').mockReturnValue(
			specialPrismaClient
		);

		await AuthController.checkSecretPassword(req, res);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.send).toHaveBeenCalledWith({
			status: 'error',
			message: 'Wrong user',
		});

		vi.spyOn(DatabaseClient.prototype, 'getClient').mockReturnValue(
			mockPrismaClient
		);
	});

	it('should handle fetchById error when checking secret password', async () => {
		const req = {} as any as Request;
		req.user = {
			id: 1,
		};
		req.body = {
			secretPassword: 'secret',
		};

		(mockPrismaClient.merchant.findUnique as any).mockRejectedValueOnce(
			new Error('Database error')
		);

		await AuthController.checkSecretPassword(req, res);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.send).toHaveBeenCalledWith({
			status: 'Internal Server Error',
			message: 'An unknown error occurred',
		});
	});
});
