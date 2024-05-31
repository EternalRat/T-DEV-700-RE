import { Product, ProductType } from '@prisma/client';

import DatabaseClient from './database.class';

/**
 * CMProduct class
 * @example
 * import { Product, ProductType } from '@prisma/client';
 * import CMProduct from './product.class';
 *
 * const product = new CMProduct();
 * product.setId(1);
 * product.setName('Product 1');
 * product.setPrice(100);
 * product.setDescription('Product 1 description');
 * product.setMerchantId(1);
 * product.setType(ProductType.ELECTRONICS);
 * product.save();
 * @return {CMProduct} CMProduct instance
 */
export default class CMProduct {
	/**
	 * Product ID
	 */
	private id: number;

	/**
	 * Product name
	 */
	private name: string;

	/**
	 * Product price
	 */
	private price: number;

	/**
	 * Product description
	 */
	private description: string;

	/**
	 * Merchant ID
	 */
	private merchantId: number;

	/**
	 * Product type
	 */
	private type: ProductType;

	constructor() {}

	/**
	 * Set the product ID
	 * @param {number} id Product ID
	 */
	public setId(id: number): void {
		this.id = id;
	}

	/**
	 * Get the product ID
	 * @return {number} Product ID
	 */
	public getId(): number {
		return this.id;
	}

	/**
	 * Set the product name
	 * @param {string} name Product name
	 */
	public setName(name: string): void {
		this.name = name;
	}

	/**
	 * Get the product name
	 * @return {string} Product name
	 */
	public getName(): string {
		return this.name;
	}

	/**
	 * Set the product price
	 * @param {number} price Product price
	 */
	public setPrice(price: number): void {
		this.price = price;
	}

	/**
	 * Get the product price
	 * @return {number} Product price
	 */
	public getPrice(): number {
		return this.price;
	}

	/**
	 * Set the product description
	 * @param {string} description Product description
	 */
	public setDescription(description: string): void {
		this.description = description;
	}

	/**
	 * Get the product description
	 * @return {string} Product description
	 */
	public getDescription(): string {
		return this.description;
	}

	/**
	 * Set the merchant ID
	 * @param {number} merchantId Merchant ID
	 */
	public setMerchantId(merchantId: number): void {
		this.merchantId = merchantId;
	}

	/**
	 * Get the merchant ID
	 * @return {number} Merchant ID
	 */
	public getMerchantId(): number {
		return this.merchantId;
	}

	/**
	 * Set the product type
	 * @param {ProductType} type Product type
	 */
	public setType(type: ProductType): void {
		this.type = type;
	}

	/**
	 * Get the product type
	 * @return {ProductType} Product type
	 */
	public getType(): ProductType {
		return this.type;
	}

	/**
	 * Convert the object to JSON
	 * @return {object} JSON object
	 */
	public toJSON(): object {
		return {
			id: this.id,
			name: this.name,
			price: this.price,
			description: this.description,
			merchantId: this.merchantId,
			type: this.type,
		};
	}

	/**
	 * Create a new CMProduct instance from JSON
	 * @param {object} json JSON object
	 * @return {CMProduct} CMProduct instance
	 */
	static fromJSON(json: any): CMProduct {
		const product = new CMProduct();
		product.id = json.id;
		product.name = json.name;
		product.price = json.price;
		product.description = json.description;
		product.merchantId = json.merchantId;
		product.type = json.type;
		return product;
	}

	/**
	 * Save the product to the database
	 * @return {Promise<Product>} Product instance
	 */
	public async save(): Promise<Product> {
		const product = await DatabaseClient.getDatabaseInstance()
			.getClient()
			.product.create({
				data: {
					id: this.id,
					name: this.name,
					price: this.price,
					description: this.description,
					merchantId: this.merchantId,
					type: this.type,
				},
			});
		return product;
	}

	/**
	 * Get a product by its ID
	 * @param {number} id Product ID
	 * @return {Promise<Product | null>} Product instance
	 */
	static async fetchById(id: number): Promise<Product | null> {
		const product = await DatabaseClient.getDatabaseInstance()
			.getClient()
			.product.findUnique({
				where: {
					id: id,
				},
			});
		return product;
	}

	/**
	 * Get products by merchant ID
	 * @param {number} merchantId Merchant ID
	 * @return {Promise<Product[] | null>} Product instance
	 */
	static async fetchByMerchantId(
		merchantId: number
	): Promise<Product[] | null> {
		const products = await DatabaseClient.getDatabaseInstance()
			.getClient()
			.product.findMany({
				where: {
					merchantId: merchantId,
				},
			});
		return products;
	}

	/**
	 * Get all products
	 * @return {Promise<Product[]>} Product instance
	 */
	static async fetchAll(): Promise<Product[]> {
		const products = await DatabaseClient.getDatabaseInstance()
			.getClient()
			.product.findMany();
		return products;
	}

	/**
	 * Update the product
	 * @return {Promise<Product>} Product instance
	 */
	public async update(): Promise<Product> {
		const product = await DatabaseClient.getDatabaseInstance()
			.getClient()
			.product.update({
				where: {
					id: this.id,
				},
				data: {
					name: this.name,
					price: this.price,
					description: this.description,
					merchantId: this.merchantId,
					type: this.type,
				},
			});
		return product;
	}

	/**
	 * Delete the product
	 * @return {Promise<Product>} Product instance
	 */
	public async delete(): Promise<Product> {
		const product = await DatabaseClient.getDatabaseInstance()
			.getClient()
			.product.delete({
				where: {
					id: this.id,
				},
			});
		return product;
	}

	/**
	 * Delete all products by merchant ID
	 * @param {number} merchantId Merchant ID
	 * @return {Promise<number>} Number of products deleted
	 */
	static async deleteByMerchantId(merchantId: number): Promise<number> {
		const products = await DatabaseClient.getDatabaseInstance()
			.getClient()
			.product.deleteMany({
				where: {
					merchantId: merchantId,
				},
			});
		return products.count;
	}

	/**
	 * Delete all products
	 * @return {Promise<void>}
	 */
	static async deleteAll(): Promise<void> {
		await DatabaseClient.getDatabaseInstance()
			.getClient()
			.product.deleteMany();
	}
}
