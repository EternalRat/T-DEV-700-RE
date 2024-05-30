require("dotenv").config();
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"; // 👈🏻 Added the `vi` import
import { mockDeep, mockReset } from "vitest-mock-extended";
import { PrismaClient, MerchantSettings } from "@prisma/client";
import DatabaseClient from "../class/database.class";
import { Configuration } from "../class/configuration.class";

describe("Configuration class", () => {
    let mockPrismaClient;
    beforeAll(() => {
        // Create a mock PrismaClient
        mockPrismaClient = mockDeep<PrismaClient>();

        // Create an object to represent the methods for merchantSettings
        const mockMerchantSettingsMethods = {
            create: vi.fn().mockResolvedValue({
                id: 1,
                property: "testProperty",
                value: 100,
                merchantId: 1,
            }),
            update: vi.fn().mockResolvedValue({
                id: 1,
                property: "testProperty",
                value: 200,
                merchantId: 1,
            }),
            delete: vi.fn().mockResolvedValue({
                id: 1,
                property: "testProperty",
                value: 100,
                merchantId: 1,
            }),
            findUnique: vi.fn().mockResolvedValue({
                id: 1,
                property: "testProperty",
                value: 100,
                merchantId: 1,
            }),
            findMany: vi.fn().mockResolvedValue([
                {
                    id: 1,
                    property: "testProperty",
                    value: 100,
                    merchantId: 1,
                },
                {
                    id: 2,
                    property: "anotherProperty",
                    value: 200,
                    merchantId: 1,
                },
            ]),
        };

        // Assign the merchantSettings methods to the mockPrismaClient
        (mockPrismaClient as any).merchantSettings =
            mockMerchantSettingsMethods;

        vi.spyOn(DatabaseClient.prototype, "getClient").mockReturnValue(
            mockPrismaClient,
        );
    });

    afterAll(() => {
        mockReset(mockPrismaClient); // Reset the mocks after each test
    });

    it("should return the set ID", () => {
        const config = new Configuration();
        config.setId(1);
        expect(config.getId()).toStrictEqual(1);
    });

    it("should return the set property", () => {
        const config = new Configuration();
        config.setProperty("testProperty");
        expect(config.getProperty()).toStrictEqual("testProperty");
    });

    it("should return the set value", () => {
        const config = new Configuration();
        config.setValue(100);
        expect(config.getValue()).toStrictEqual(100);
    });

    it("should return the set merchantId", () => {
        const config = new Configuration();
        config.setMerchantId(1);
        expect(config.getMerchantId()).toStrictEqual(1);
    });

    it("should convert to JSON correctly", () => {
        const config = new Configuration();
        config.setId(1);
        config.setProperty("testProperty");
        config.setValue(100);
        config.setMerchantId(1);
        expect(config.toJSON()).toStrictEqual({
            id: 1,
            property: "testProperty",
            value: 100,
            merchantId: 1,
        });
    });

    it("should create an instance from JSON", () => {
        const json = {
            id: 1,
            property: "testProperty",
            value: 100,
            merchantId: 1,
        };
        const config = Configuration.fromJSON(json);
        expect(config.getId()).toStrictEqual(1);
        expect(config.getProperty()).toStrictEqual("testProperty");
        expect(config.getValue()).toStrictEqual(100);
        expect(config.getMerchantId()).toStrictEqual(1);
    });

    it("should save the configuration to the database", async () => {
        const config = new Configuration();
        config.setProperty("testProperty");
        config.setValue(100);
        config.setMerchantId(1);
        const savedConfig = await config.save();
        expect(savedConfig).toStrictEqual({
            id: 1,
            property: "testProperty",
            value: 100,
            merchantId: 1,
        });
    });

    it("should fetch a configuration by ID", async () => {
        const fetchedConfig = await Configuration.fetchById(1);
        expect(fetchedConfig).toStrictEqual({
            id: 1,
            property: "testProperty",
            value: 100,
            merchantId: 1,
        });
    });

    it("should fetch configurations by merchant ID", async () => {
        const fetchedConfigs = await Configuration.fetchByMerchantId(1);
        expect(fetchedConfigs).toStrictEqual([
            {
                id: 1,
                property: "testProperty",
                value: 100,
                merchantId: 1,
            },
            {
                id: 2,
                property: "anotherProperty",
                value: 200,
                merchantId: 1,
            },
        ]);
    });

    it("should update the configuration in the database", async () => {
        const config = new Configuration();
        config.setId(1);
        config.setProperty("testProperty");
        config.setValue(200);
        const updatedConfig = await config.update();
        expect(updatedConfig).toStrictEqual({
            id: 1,
            property: "testProperty",
            value: 200,
            merchantId: 1,
        });
    });

    it("should delete the configuration from the database", async () => {
        const config = new Configuration();
        config.setId(1);
        const deletedConfig = await config.delete();
        expect(deletedConfig).toStrictEqual({
            id: 1,
            property: "testProperty",
            value: 100,
            merchantId: 1,
        });
    });
});
