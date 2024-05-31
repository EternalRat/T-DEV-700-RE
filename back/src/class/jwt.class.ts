import { Merchant } from '@prisma/client';
import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import passportJWT from 'passport-jwt';

import CMAuth from './auth.class';
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

export class JWT {
	private static _instance: JWT;
	private _secret: string;
	private static _jwtAuth: passportJWT.Strategy;

	private constructor() {
		this._secret = bcrypt.genSaltSync();
		JWT._jwtAuth = new JwtStrategy(
			{
				secretOrKey: this._secret,
				jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			},
			async function (jwt_payload, next) {
				console.info('payload received', jwt_payload);
				let user = await CMAuth.fetchById(jwt_payload.id);

				if (user) {
					next(null, { name: user.name, id: user.id });
				} else {
					next(null, false);
				}
			}
		);
	}

	static getInstance(): JWT {
		if (!JWT._instance) {
			JWT._instance = new JWT();
		}
		return JWT._instance;
	}

	public getSecret(): string {
		return this._secret;
	}

	public static authToken = function authToken(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const authHeader = req.cookies.token;
		if (authHeader == null)
			return res.status(401).json({
				message: 'Not logged',
				status: 401,
			});

		jwt.verify(
			authHeader,
			JWT.getInstance()._secret,
			async (err: any, user: any) => {
				if (err) {
					return res.status(403).json({
						message: 'Invalid token',
						status: 403,
					});
				}
				req.user = user as Merchant;
				if (!(await CMAuth.fetchById((req.user! as Merchant).id)))
					return res.status(403).json({
						message: 'Invalid token',
						status: 403,
					});
				next();
			}
		);
	};
}
