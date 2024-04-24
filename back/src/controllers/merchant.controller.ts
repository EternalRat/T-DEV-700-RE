import { Request, Response } from "express";
import CMMerchant from "../class/merchant.class";

/**
 * Merchant controller
 *
 * Contains the logic of the merchant routes
 */
export namespace MerchantController {
    /**
     * Create a new merchant from the request body
     * @param req {Request}
     * @param res {Response}
     * @returns {Promise<void>}
     */
    export const create = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const merchant = CMMerchant.fromJSON(req.body);
        const newMerchant = await merchant.save();
        res.json(newMerchant);
    };

    /**
     * Get a merchant by its id
     * @param req {Request}
     * @param res {Response}
     * @returns {Promise<void>}
     */
    export const get = async (req: Request, res: Response): Promise<void> => {
        const newMerchant = await CMMerchant.fetchById(parseInt(req.params.id));
        if (!newMerchant) {
            res.status(404).send("Merchant not found");
            return;
        }
        res.json(newMerchant);
    };

    /**
     * Update a merchant
     * @param req {Request}
     * @param res {Response}
     * @returns {Promise<void>}
     */
    export const update = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const merchant = CMMerchant.fromJSON(req.body);
        merchant.setId(parseInt(req.params.id));
        const updatedMerchant = await merchant.update();
        res.json(updatedMerchant);
    };

    /**
     * Remove a merchant by its id
     * @param req {Request}
     * @param res {Response}
     * @returns {Promise<void>}
     */
    export const remove = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const merchant = new CMMerchant();
        merchant.setId(parseInt(req.params.id));
        await merchant.delete();
        res.status(204).send();
    };

    /**
     * Get all merchants
     * @param req {Request}
     * @param res {Response}
     * @returns {Promise<void>}
     */
    export const getAll = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const merchants = await CMMerchant.fetchAll();
        res.json(merchants);
    };

    /**
     * Get all products by merchant id
     * @param req {Request}
     * @param res {Response}
     * @returns {Promise<void>}
     */
    export const getAvailableProducts = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const products = await CMMerchant.fetchProductsByMerchantId(
            parseInt(req.params.id),
        );
        res.json(products);
    };

    /**
     * Add a product to a merchant
     * @param req {Request}
     * @param res {Response}
     * @returns {Promise<void>}
     */
    export const addProduct = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const merchant = new CMMerchant();
        merchant.setId(parseInt(req.params.id));
        const product = req.body;
        await merchant.addProduct(product);
        res.status(204).send();
    };

    /**
     * Remove a product from a merchant
     * @param req {Request}
     * @param res {Response}
     * @returns {Promise<void>}
     */
    export const removeProduct = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const merchant = new CMMerchant();
        merchant.setId(parseInt(req.params.id));
        const product = req.body;
        await merchant.removeProduct(product);
        res.status(204).send();
    };

    /**
     * Update a product from a merchant
     * @param req {Request}
     * @param res {Response}
     * @returns {Promise<void>}
     */
    export const updateProduct = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const merchant = new CMMerchant();
        merchant.setId(parseInt(req.params.id));
        const product = req.body;
        await merchant.updateProduct(product);
        res.status(204).send();
    };
}
