import { PrismaClient } from "@prisma/client";

/**
 * DatabaseClient class which is a singleton class to handle the database client
 * @example
 * import DatabaseClient from './database.class';
 *
 * const databaseClient = DatabaseClient.getDatabaseInstance();
 * const prismaClient = databaseClient.getClient();
 * const users = await prismaClient.user.findMany();
 * console.log(users);
 * @return {DatabaseClient} DatabaseClient instance
 */
export default class DatabaseClient {
    /**
     * Singleton instance
     */
    private static _instance: DatabaseClient;

    /**
     * Prisma client instance
     */
    private _prismaClient: PrismaClient;

    /**
     * Constructor
     */
    private constructor() {
        this._prismaClient = new PrismaClient();
    }

    /**
     * Get the DatabaseClient instance
     * @return {DatabaseClient} DatabaseClient instance
     */
    public static getDatabaseInstance(): DatabaseClient {
        if (!DatabaseClient._instance) {
            DatabaseClient._instance = new DatabaseClient();
        }
        return DatabaseClient._instance;
    }

    /**
     * Get the Prisma client instance
     * @return {PrismaClient} Prisma client instance
     */
    /* v8 ignore next 3 */
    public getClient(): PrismaClient {
        return this._prismaClient;
    }
}
