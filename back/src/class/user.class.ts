import { User } from "@prisma/client";
import DatabaseClient from "./database.class";

/**
 * CMUser class
 * @example
 * import { User } from '@prisma/client';
 * import CMUser from './user.class';
 *
 * const user = new CMUser();
 * user.setId(1);
 * user.setName('User 1');
 * user.setCartId('1');
 * user.save();
 * @return {CMUser} CMUser instance
 */
export default class CMUser {
    /**
     * User ID
     */
    private id: number;

    /**
     * User name
     */
    private name: string;

    /**
     * User NFC/QRCode ID
     */
    private nfc: string;
    private qrCode: string;

    /**
     * User amount
     */
    private amount: number;

    constructor() {}

    /**
     * Set the user ID
     * @param {number} id User ID
     */
    public setId(id: number): void {
        this.id = id;
    }

    /**
     * Get the user ID
     * @return {number} User ID
     */
    public getId(): number {
        return this.id;
    }

    /**
     * Set the user name
     * @param {string} name User name
     */
    public setName(name: string): void {
        this.name = name;
    }

    /**
     * Get the user name
     * @return {string} User name
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Set the user nfc
     * @param {string} nfc User nfc
     */
    public setNFC(nfc: string): void {
        this.nfc = nfc;
    }

    /**
     * Get the user nfc
     * @return {string} User nfc
     */
    public getNFC(): string {
        return this.nfc;
    }

    /**
     * Set the user qr code
     * @param {string} qrCode User qr code
     */
    public setQRCode(qrCode: string): void {
        this.qrCode = qrCode;
    }

    /**
     * Get the user qr code
     * @return {string} User qr code
     */
    public getQRCode(): string {
        return this.qrCode;
    }

    /**
     * Set the user amount
     * @param {number} amount
     */
    public setAmount(amount: number): void {
        this.amount = amount;
    }

    /**
     * Get the user amount
     * @return {number} User amount
     */
    public getAmount(): number {
        return this.amount;
    }

    /**
     * Get the JSON representation of the user
     * @returns {object} JSON representation of the user
     */
    public toJSON(): object {
        return {
            id: this.id,
            name: this.name,
            qrCode: this.qrCode,
            nfc: this.nfc,
            amount: this.amount,
        };
    }

    /**
     * Create a new user from JSON
     * @param {object} json JSON object
     * @returns {CMUser} CMUser instance
     */
    static fromJSON(json: any): CMUser {
        const user = new CMUser();
        user.id = json.id;
        user.name = json.name;
        user.qrCode = json.qrCode;
        user.nfc = json.nfc;
        user.amount = json.amount;
        return user;
    }

    /**
     * Save the user to the database
     * @returns {Promise<User>} User instance
     */
    public async save(): Promise<User> {
        const user = await DatabaseClient.getDatabaseInstance()
            .getClient()
            .user.create({
                data: {
                    id: this.id,
                    name: this.name,
                    nfc: this.nfc,
                    qrCode: this.qrCode,
                    amount: this.amount,
                },
            });
        return user;
    }

    /**
     * Get a user by its ID
     * @param {number} id User ID
     * @returns {Promise<User | null>} User instance
     */
    static async fetchById(id: number): Promise<User | null> {
        const user = await DatabaseClient.getDatabaseInstance()
            .getClient()
            .user.findUnique({
                where: {
                    id: id,
                },
            });
        return user;
    }

    /**
     * Get a user by its NFC
     * @param {string} nfc User NFC
     * @returns {Promise<User | null>} User instance
     */
    static async fetchByNFC(nfc: string): Promise<User | null> {
        const user = await DatabaseClient.getDatabaseInstance()
            .getClient()
            .user.findUnique({
                where: {
                    nfc: nfc,
                },
            });
        return user;
    }

    /**
     * Get a user by its qr code
     * @param {string} nfc User qr code
     * @returns {Promise<User | null>} User instance
     */
    static async fetchByQRCode(qrCode: string): Promise<User | null> {
        const user = await DatabaseClient.getDatabaseInstance()
            .getClient()
            .user.findUnique({
                where: {
                    qrCode: qrCode,
                },
            });
        return user;
    }

    /**
     * Get all users
     * @returns {Promise<User[]>} User instances
     */
    static async fetchAll(): Promise<User[]> {
        const users = await DatabaseClient.getDatabaseInstance()
            .getClient()
            .user.findMany();
        return users;
    }

    /**
     * Update the user
     * @returns {Promise<User>} User instance
     */
    public async update(): Promise<User> {
        const user = await DatabaseClient.getDatabaseInstance()
            .getClient()
            .user.update({
                where: {
                    id: this.id,
                },
                data: {
                    name: this.name,
                    nfc: this.nfc,
                    qrCode: this.qrCode,
                    amount: this.amount,
                },
            });
        return user;
    }

    /**
     * Delete the user
     * @returns {Promise<User>} User instance
     */
    public async delete(): Promise<User> {
        const user = await DatabaseClient.getDatabaseInstance()
            .getClient()
            .user.delete({
                where: {
                    id: this.id,
                },
            });
        return user;
    }

    /**
     * Delete all users
     * @returns {Promise<void>}
     */
    static async deleteAll(): Promise<void> {
        await DatabaseClient.getDatabaseInstance()
            .getClient()
            .user.deleteMany();
    }
}
