import { MerchantSettings } from '@prisma/client';

import DatabaseClient from './database.class';

export class Configuration {
	/** The unique identifier of the configuration */
	private id: number;

	/** The property name of the configuration */
	private property: string;

	/** The value associated with the property */
	private value: number;

	/** The ID of the merchant associated with the configuration */
	private merchantId: number;

	/** Constructor */
	constructor() {}

	/**
	 * Gets the ID of the configuration
	 * @return {number} The ID of the configuration
	 */
	public getId(): number {
		return this.id;
	}

	/**
	 * Sets the ID of the configuration
	 * @param {number} value - The new ID value
	 */
	public setId(value: number) {
		this.id = value;
	}

	/**
	 * Gets the property name of the configuration
	 * @return {string} The property name
	 */
	public getProperty(): string {
		return this.property;
	}

	/**
	 * Sets the property name of the configuration
	 * @param {string} value - The new property name
	 */
	public setProperty(value: string) {
		this.property = value;
	}

	/**
	 * Gets the value associated with the property
	 * @return {number} The value
	 */
	public getValue(): number {
		return this.value;
	}

	/**
	 * Sets the value associated with the property
	 * @param {number} value - The new value
	 */
	public setValue(value: number) {
		this.value = value;
	}

	/**
	 * Gets the merchant ID associated with the configuration
	 * @return {number} The merchant ID
	 */
	public getMerchantId(): number {
		return this.merchantId;
	}

	/**
	 * Sets the merchant ID associated with the configuration
	 * @param {number} value - The new merchant ID
	 */
	public setMerchantId(value: number) {
		this.merchantId = value;
	}

	/**
	 * Converts the configuration instance to a JSON object
	 * @return {object} The JSON representation of the configuration
	 */
	public toJSON(): object {
		return {
			id: this.id,
			property: this.property,
			value: this.value,
			merchantId: this.merchantId,
		};
	}

	/**
	 * Creates a Configuration instance from a JSON object
	 * @param {any} json - The JSON object
	 * @return {Configuration} The new Configuration instance
	 */
	public static fromJSON(json: any): Configuration {
		const configuration = new Configuration();
		configuration.id = json.id;
		configuration.property = json.property;
		configuration.value = json.value;
		configuration.merchantId = json.merchantId;
		return configuration;
	}

	/**
	 * Saves the current configuration instance to the database
	 * @return {Promise<MerchantSettings>} The saved configuration
	 */
	public async save(): Promise<MerchantSettings> {
		const configuration = await DatabaseClient.getDatabaseInstance()
			.getClient()
			.merchantSettings.create({
				data: {
					value: this.value,
					property: this.property,
					merchantId: this.merchantId,
				},
			});
		return configuration;
	}

	/**
	 * Fetches a configuration by its ID from the database
	 * @param {number} id - The ID of the configuration
	 * @return {Promise<MerchantSettings | null>} The fetched configuration or null if not found
	 */
	static async fetchById(id: number): Promise<MerchantSettings | null> {
		const configuration = await DatabaseClient.getDatabaseInstance()
			.getClient()
			.merchantSettings.findUnique({
				where: {
					id: id,
				},
			});
		return configuration;
	}

	/**
	 * Fetches configurations by merchant ID from the database
	 * @param {number} merchantId - The merchant ID
	 * @return {Promise<MerchantSettings[] | null>} The fetched configurations or null if none found
	 */
	static async fetchByMerchantId(
		merchantId: number
	): Promise<MerchantSettings[] | null> {
		const configuration = await DatabaseClient.getDatabaseInstance()
			.getClient()
			.merchantSettings.findMany({
				where: {
					merchantId: merchantId,
				},
			});
		return configuration;
	}

	/**
	 * Updates the current configuration instance in the database
	 * @return {Promise<MerchantSettings>} The updated configuration
	 */
	public async update(): Promise<MerchantSettings> {
		const configuration = await DatabaseClient.getDatabaseInstance()
			.getClient()
			.merchantSettings.update({
				where: {
					id: this.id,
				},
				data: {
					value: this.value,
				},
			});
		return configuration;
	}

	/**
	 * Deletes the current configuration instance from the database
	 * @return {Promise<MerchantSettings>} The deleted configuration
	 */
	public async delete(): Promise<MerchantSettings> {
		const configuration = await DatabaseClient.getDatabaseInstance()
			.getClient()
			.merchantSettings.delete({
				where: {
					id: this.id,
				},
			});
		return configuration;
	}
}
