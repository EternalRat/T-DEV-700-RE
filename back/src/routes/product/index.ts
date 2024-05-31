import express from 'express';

import { ProductController } from '../../controllers/product.controller';

const router = express.Router();

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Get all products
 *     description: Retrieves a list of all products.
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Successful response with a list of products
 *       500:
 *         description: Internal server error
 */
router.get('/', ProductController.getAll);

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Retrieves a product by its ID.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Successful response with the product data
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', ProductController.get);

/**
 * @swagger
 * /product/merchant/{id}:
 *   get:
 *     summary: Get products by merchant ID
 *     description: Retrieves all products associated with a specific merchant ID.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The merchant ID
 *     responses:
 *       200:
 *         description: Successful response with a list of products
 *       404:
 *         description: Products not found
 *       500:
 *         description: Internal server error
 */
router.get('/merchant/:id', ProductController.getByMerchantId);

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Create a new product
 *     description: Creates a new product using the data provided in the request body.
 *     tags:
 *       - Products
 *     requestBody:
 *       description: The product data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/', ProductController.create);

/**
 * @swagger
 * /product/{id}:
 *   put:
 *     summary: Update a product by ID
 *     description: Updates an existing product using the data provided in the request body.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product ID
 *     requestBody:
 *       description: The updated product data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       500:
 *         description: Internal server error
 */
router.put('/:id', ProductController.update);

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     description: Deletes a product by its ID.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product ID
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', ProductController.remove);

/**
 * @swagger
 * /product/merchant/{id}:
 *   delete:
 *     summary: Delete all products by merchant ID
 *     description: Deletes all products associated with a specific merchant ID.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The merchant ID
 *     responses:
 *       204:
 *         description: Products deleted successfully
 *       500:
 *         description: Internal server error
 */
router.delete('/merchant/:id', ProductController.deleteByMerchantId);

/**
 * @swagger
 * /product:
 *   delete:
 *     summary: Delete all products
 *     description: Deletes all products in the database.
 *     tags:
 *       - Products
 *     responses:
 *       204:
 *         description: All products deleted successfully
 *       500:
 *         description: Internal server error
 */
router.delete('/', ProductController.deleteAll);

export default router;
