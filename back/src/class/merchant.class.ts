import { Merchant, Product } from "@prisma/client";
import DatabaseClient from "./database.class";
import CMProduct from "./product.class";

/**
 * CMMerchant class
 * @example
 * import { Merchant } from '@prisma/client';
 * import CMMerchant from './merchant.class';
 *
 * const merchant = new CMMerchant();
 * merchant.setId(1);
 * merchant.setName('Merchant 1');
 * merchant.save();
 * @return {CMMerchant} CMMerchant instance
 */
export default class CMMerchant {
    /**
     * Merchant ID
     */
    private id: number;

    /**
     * Merchant name
     */
    private name: string;

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

    /**
     * Convert JSON object to merchant instance
     * @param {any} json JSON object
     */
    static fromJSON(json: any): CMMerchant {
        const merchant = new CMMerchant();
        merchant.id = json.id;
        merchant.name = json.name;
        merchant.products = json.products;
        return merchant;
    }

    public async save(): Promise<Merchant> {
        const merchant = await DatabaseClient.getDatabaseInstance()
            .getClient()
            .merchant.create({
                data: {
                    id: this.id,
                    name: this.name,
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
        merchantId: number,
    ): Promise<Product[] | null> {
        return await CMProduct.fetchByMerchantId(merchantId);
    }
}
