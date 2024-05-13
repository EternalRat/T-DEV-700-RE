import { Request, Response } from "express";
import CMUser from "../class/user.class";

/**
 * User controller
 *
 * Contains the logic of the user routes
 */
export namespace UserController {
    /**
     * Create a new user from the request body
     * @param req {Request} The request
     * @param res {Response} The response
     * @returns {Promise<void>}
     */
    export const create = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const user = CMUser.fromJSON(req.body);
        const newUser = await user.save();
        res.json(newUser);
    };

    /**
     * Get a user by its id
     * @param req {Request}
     * @param res {Response}
     * @returns {Promise<void>}
     */
    export const get = async (req: Request, res: Response): Promise<void> => {
        const newUser = await CMUser.fetchById(parseInt(req.params.id));
        if (!newUser) {
            res.status(404).send("User not found");
            return;
        }
        res.json(newUser);
    };

    /**
     * Update a user
     * @param req {Request}
     * @param res {Response}
     * @returns {Promise<void>}
     */
    export const update = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const user = CMUser.fromJSON(req.body);
        user.setId(parseInt(req.params.id));
        const updatedUser = await user.update();
        res.json(updatedUser);
    };

    /**
     * Remove a user by its id
     * @param req {Request}
     * @param res {Response}
     * @returns {Promise<void>}
     */
    export const remove = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const user = new CMUser();
        user.setId(parseInt(req.params.id));
        await user.delete();
        res.status(204).send();
    };

    /**
     * Get all users
     * @param req {Request}
     * @param res {Response}
     * @returns {Promise<void>}
     */
    export const getAll = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const users = await CMUser.fetchAll();
        res.json(users);
    };

    /**
     * Get a user by its nfc
     * @param req {Request}
     * @param res {Response}
     * @returns {Promise<void>}
     */
    export const getByNFC = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const user = await CMUser.fetchByNFC(req.params.id);
        if (!user) {
            res.status(404).send("User not found");
            return;
        }
        res.json(user);
    };

    /**
     * Get a user by its qr code
     * @param req {Request}
     * @param res {Response}
     * @returns {Promise<void>}
     */
    export const getByQRCode = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const user = await CMUser.fetchByQRCode(req.params.id);
        if (!user) {
            res.status(404).send("User not found");
            return;
        }
        res.json(user);
    };

    /**
     * Delete all users
     * @param req {Request}
     * @param res {Response}
     * @returns {Promise<void>}
     */
    export const deleteAll = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        await CMUser.deleteAll();
        res.status(204).send();
    };
}
