import { Merchant, Product } from '@prisma/client';

import DatabaseClient from './database.class';
import CMProduct from './product.class';

/**
 * CMAuth class
 * @example
 * import { Merchant } from '@prisma/client';
 * import CMAuth from './auth.class';
 *
 * const merchant = new CMAuth();
 * merchant.setId(1);
 * merchant.setName('Merchant 1');
 * merchant.save();
 * @return {CMAuth} CMAuth instance
 */
export default class CMAuth {
	/**
	 * Merchant ID
	 */
	private id: number;

	/**
	 * Merchant name
	 */
	private name: string;

	/**
	 * Merchant password
	 */
	private password: string;

	/**
	 * Merchant secret password
	 */
	private secretPassword: string;

	/**
	 * Merchant products
	 */
	private products: Product[];

	constructor() {}

	/**
	 * Set the merchant ID
	 * @param {number} id Merchant ID
	 */
	public setId(id: number): void {
		this.id = id;
	}

	/**
	 * Get the merchant ID
	 * @return {number} Merchant ID
	 */
	public getId(): number {
		return this.id;
	}

	/**
	 * Set the merchant name
	 * @param {string} name Merchant name
	 */
	public setName(name: string): void {
		this.name = name;
	}

	/**
	 * Get the merchant name
	 * @return {string} Merchant name
	 */
	public getName(): string {
		return this.name;
	}

	/**
	 * Set the merchant password
	 * @param {string} password Merchant password
	 */
	public setPassword(password: string): void {
		this.password = password;
	}

	/**
	 * Get the merchant password
	 * @returns {string} Merchant password
	 */
	public getPassword(): string {
		return this.password;
	}

	/**
	 * Set the merchant secret password
	 * @param {string} secret Merchant secret
	 */
	public setSecret(secret: string): void {
		this.secretPassword = secret;
	}

	/**
	 * Get the merchant secret password
	 * @returns {string} Merchant secret password
	 */
	public getSecret(): string {
		return this.secretPassword;
	}

	/**
	 * Set the merchant products
	 * @param {Product[]} products Merchant products
	 */
	public setProducts(products: Product[]): void {
		this.products = products;
	}

	/**
	 * Get the merchant products
	 * @return {Product[]} Merchant products
	 */
	public getProducts(): Product[] {
		return this.products;
	}

	/**
	 * Convert the merchant instance to JSON
	 * @return {object} JSON object
	 */
	public toJSON(): object {
		return {
			id: this.id,
			name: this.name,
			products: this.products,
		};
	}

	public static fromJSON(json: any): CMAuth {
		const auth = new CMAuth();
		auth.id = json.id;
		auth.name = json.name;
		auth.password = json.password;
		auth.secretPassword = json.secretPassword;
		auth.products = json.products;
		return auth;
	}

	public async save(): Promise<Merchant> {
		const merchant = await DatabaseClient.getDatabaseInstance()
			.getClient()
			.merchant.create({
				data: {
					name: this.name,
					password: this.password,
					secretPassword: this.secretPassword,
				},
			});
		return merchant;
	}

	static async fetchById(id: number): Promise<Merchant | null> {
		const merchant = await DatabaseClient.getDatabaseInstance()
			.getClient()
			.merchant.findUnique({
				where: {
					id: id,
				},
			});
		return merchant;
	}

	static async fetchByUsername(username: string): Promise<Merchant | null> {
		const merchant = await DatabaseClient.getDatabaseInstance()
			.getClient()
			.merchant.findUnique({
				where: {
					name: username,
				},
			});
		return merchant;
	}

	static async fetchAll(): Promise<Merchant[]> {
		const merchants = await DatabaseClient.getDatabaseInstance()
			.getClient()
			.merchant.findMany();
		return merchants;
	}

	public async update(): Promise<Merchant> {
		const merchant = await DatabaseClient.getDatabaseInstance()
			.getClient()
			.merchant.update({
				where: {
					id: this.id,
				},
				data: {
					name: this.name,
					password: this.password,
					secretPassword: this.secretPassword,
				},
			});
		return merchant;
	}

	public async delete(): Promise<Merchant> {
		const merchant = await DatabaseClient.getDatabaseInstance()
			.getClient()
			.merchant.delete({
				where: {
					id: this.id,
				},
			});
		return merchant;
	}

	public async addProduct(product: Product): Promise<Product> {
		const productInstance = CMProduct.fromJSON(product);
		productInstance.setMerchantId(this.id);
		return await productInstance.save();
	}

	public async removeProduct(product: Product): Promise<Product> {
		const productInstance = CMProduct.fromJSON(product);
		return await productInstance.delete();
	}

	public async updateProduct(product: Product): Promise<Product> {
		const productInstance = CMProduct.fromJSON(product);
		return await productInstance.update();
	}

	static async fetchProductsByMerchantId(
		merchantId: number
	): Promise<Product[] | null> {
		return await CMProduct.fetchByMerchantId(merchantId);
	}
}
