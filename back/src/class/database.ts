import { PrismaClient } from '@prisma/client';

export default class DatabaseClient {
    private static _instance: DatabaseClient;
    private _prismaClient: PrismaClient;

    constructor() {
        this._prismaClient = PrismaClient();
    }

    public static getDatabaseInstance(): DatabaseClient {
        if (!DatabaseClient._instance) {
            DatabaseClient._instance = new DatabaseClient();
        }
        return DatabaseClient._instance;
    }

    public getClient(): PrismaClient {
        return this._prismaClient;
    }
}
