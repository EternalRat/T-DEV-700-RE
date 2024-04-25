import { Request, Response } from "express";
import CMAuth from "../class/auth.class";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT } from "../class/jwt.class";

/**
 * Auth controller
 *
 * Contains the logic of the auth routes
 */
export namespace AuthController {
    /**
     * Login the user
     * @param req {Request}
     * @param res {Response}
     * @returns {Promise<void>}
     */
    export const login = async (req: Request, res: Response): Promise<void> => {
        console.log(req.body);
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(403).send({
                status: "error",
                message: "Missing username or password.",
            });
            return;
        }
        const user = await CMAuth.fetchByUsername(username);
        console.log(user)
        if (!user) {
            res.status(403).send({
                status: "error",
                message: "No user found with that username.",
            });
            return;
        }
        console.log(
            user,
            password,
            await bcrypt.compare(password, user.password),
        );
        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                {
                    id: user.id,
                    username: user.name,
                },
                JWT.getInstance().getSecret(),
                {
                    expiresIn: "6h",
                },
            );

            res.status(200).send({
                status: 200,
                user: {
                    name: user.name,
                    id: user.id,
                    token: token,
                },
            });
        } else {
            res.status(403).send({
                status: "error",
                message: "Invalid password.",
            });
        }
    };

    /**
     * Get the logged user
     */
    export const getAuthedUser = (req: Request, res: Response) => {
        if (req.user) res.send({ message: "User found", data: req.user });
        else res.status(404).json({ message: "No user found", status: 404 });
    };
}
