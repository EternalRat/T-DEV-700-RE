import { Request, Response } from "express";
import CMProduct from "../class/product.class";

/**
 * Product controller
 *
 * Contains the logic of the product routes
 */
export namespace ProductController {
    /**
     * Create a new product from the request body
     * @param req {Request}
     * @param res {Response}
     * @returns {Promise<void>}
     */
    export const create = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const product = CMProduct.fromJSON(req.body);
        const newProduct = await product.save();
        res.json(newProduct);
    };

    /**
     * Get a product by its id
     * @param req {Request}
     * @param res {Response}
     * @returns {Promise<void>}
     */
    export const get = async (req: Request, res: Response): Promise<void> => {
        const newProduct = await CMProduct.fetchById(parseInt(req.params.id));
        if (!newProduct) {
            res.status(404).send("Product not found");
            return;
        }
        res.json(newProduct);
    };

    /**
     * Update a product
     * @param req {Request}
     * @param res {Response}
     * @returns {Promise<void>}
     */
    export const update = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const product = CMProduct.fromJSON(req.body);
        product.setId(parseInt(req.params.id));
        const updatedProduct = await product.update();
        res.json(updatedProduct);
    };

    /**
     * Remove a product by its id
     * @param req {Request}
     * @param res {Response}
     * @returns {Promise<void>}
     */
    export const remove = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const product = new CMProduct();
        product.setId(parseInt(req.params.id));
        await product.delete();
        res.status(204).send();
    };

    /**
     * Get all products
     * @param req {Request}
     * @param res {Response}
     * @returns {Promise<void>}
     */
    export const getAll = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const products = await CMProduct.fetchAll();
        res.json(products);
    };

    /**
     * Get all products by merchant id
     * @param req {Request}
     * @param res {Response}
     * @returns {Promise<void>}
     */
    export const getByMerchantId = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const products = await CMProduct.fetchByMerchantId(
            parseInt(req.params.id),
        );
        console.log(JSON.stringify(products));
        if (!products) {
            res.status(404).send("Products not found");
            return;
        }
        res.status(200).send({ status: "success", data: products });
    };

    /**
     * Delete all products by merchant id
     * @param req {Request}
     * @param res {Response}
     * @returns {Promise<void>}
     */
    export const deleteByMerchantId = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const productsCount = await CMProduct.deleteByMerchantId(
            parseInt(req.params.id),
        );
        res.status(204).send(productsCount);
    };

    /**
     * Delete all products
     * @param req {Request}
     * @param res {Response}
     * @returns {Promise<void>}
     */
    export const deleteAll = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        await CMProduct.deleteAll();
        res.status(204).send();
    };
}
