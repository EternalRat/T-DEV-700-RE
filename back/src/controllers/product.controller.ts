import { Request, Response } from 'express';

import CMProduct from '../class/product.class';

/**
 * Product controller
 *
 * Contains the logic of the product routes
 */
export namespace ProductController {
	/**
	 * Handles the request to create a new product from the request body.
	 * @param {Request} req - The request object containing the product data.
	 * @param {Response} res - The response object to send the result.
	 * @returns {Promise<void>} A promise that resolves when the operation is complete.
	 */
	export const create = async (
		req: Request,
		res: Response
	): Promise<void> => {
		const product = CMProduct.fromJSON(req.body);
		try {
			const newProduct = await product.save();
			res.json({ status: 'success', id: newProduct.id });
		} catch {
			res.status(500).send({
				status: 'Internal Server Error',
				message: 'An unknown error occurred',
			});
		}
	};

	/**
	 * Handles the request to get a product by its ID.
	 * @param {Request} req - The request object containing the product ID.
	 * @param {Response} res - The response object to send the result.
	 * @returns {Promise<void>} A promise that resolves when the operation is complete.
	 */
	export const get = async (req: Request, res: Response): Promise<void> => {
		try {
			const newProduct = await CMProduct.fetchById(
				parseInt(req.params.id)
			);
			if (!newProduct) {
				res.status(404).send('Product not found');
				return;
			}
			res.json(newProduct);
		} catch {
			res.status(500).send({
				status: 'Internal Server Error',
				message: 'An unknown error occurred',
			});
		}
	};

	/**
	 * Handles the request to update a product using the data from the request body.
	 * @param {Request} req - The request object containing the product data.
	 * @param {Response} res - The response object to send the result.
	 * @returns {Promise<void>} A promise that resolves when the operation is complete.
	 */
	export const update = async (
		req: Request,
		res: Response
	): Promise<void> => {
		const product = CMProduct.fromJSON(req.body);
		product.setId(parseInt(req.params.id));
		try {
			const updatedProduct = await product.update();
			res.json({ status: 'success', product: updatedProduct });
		} catch {
			res.status(500).send({
				status: 'Internal Server Error',
				message: 'An unknown error occurred',
			});
		}
	};

	/**
	 * Handles the request to remove a product by its ID.
	 * @param {Request} req - The request object containing the ID of the product to delete.
	 * @param {Response} res - The response object to send the result.
	 * @returns {Promise<void>} A promise that resolves when the operation is complete.
	 */
	export const remove = async (
		req: Request,
		res: Response
	): Promise<void> => {
		const product = new CMProduct();
		product.setId(parseInt(req.params.id));
		try {
			await product.delete();
			res.status(204).send();
		} catch {
			res.status(500).send({
				status: 'Internal Server Error',
				message: 'An unknown error occurred',
			});
		}
	};

	/**
	 * Handles the request to get all products.
	 * @param {Request} req - The request object.
	 * @param {Response} res - The response object to send the result.
	 * @returns {Promise<void>} A promise that resolves when the operation is complete.
	 */
	export const getAll = async (
		req: Request,
		res: Response
	): Promise<void> => {
		try {
			const products = await CMProduct.fetchAll();
			res.json(products);
		} catch {
			res.status(500).send({
				status: 'Internal Server Error',
				message: 'An unknown error occurred',
			});
		}
	};

	/**
	 * Handles the request to get all products by merchant ID.
	 * @param {Request} req - The request object containing the merchant ID.
	 * @param {Response} res - The response object to send the result.
	 * @returns {Promise<void>} A promise that resolves when the operation is complete.
	 */
	export const getByMerchantId = async (
		req: Request,
		res: Response
	): Promise<void> => {
		try {
			const products = await CMProduct.fetchByMerchantId(
				parseInt(req.params.id)
			);
			if (!products) {
				res.status(404).send('Products not found');
				return;
			}
			res.status(200).send({ status: 'success', data: products });
		} catch {
			res.status(500).send({
				status: 'Internal Server Error',
				message: 'An unknown error occurred',
			});
		}
	};

	/**
	 * Handles the request to delete all products by merchant ID.
	 * @param {Request} req - The request object containing the merchant ID.
	 * @param {Response} res - The response object to send the result.
	 * @returns {Promise<void>} A promise that resolves when the operation is complete.
	 */
	export const deleteByMerchantId = async (
		req: Request,
		res: Response
	): Promise<void> => {
		try {
			const productsCount = await CMProduct.deleteByMerchantId(
				parseInt(req.params.id)
			);
			res.status(204).send(productsCount);
		} catch {
			res.status(500).send({
				status: 'Internal Server Error',
				message: 'An unknown error occurred',
			});
		}
	};

	/**
	 * Handles the request to delete all products.
	 * @param {Request} req - The request object.
	 * @param {Response} res - The response object to send the result.
	 * @returns {Promise<void>} A promise that resolves when the operation is complete.
	 */
	export const deleteAll = async (
		req: Request,
		res: Response
	): Promise<void> => {
		try {
			await CMProduct.deleteAll();
			res.status(204).send();
		} catch {
			res.status(500).send({
				status: 'Internal Server Error',
				message: 'An unknown error occurred',
			});
		}
	};
}
