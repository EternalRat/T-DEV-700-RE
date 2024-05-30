import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { Request, Response } from "express";
import { mockDeep, mockReset } from "vitest-mock-extended";
import { PrismaClient } from "@prisma/client";
import DatabaseClient from "../class/database.class";
import { SettingsController } from "../controllers/settings.controller"; // Assurez-vous que le chemin est correct

describe("Configuration Controller", () => {
    const res = {} as any as Response;
    const mockPrismaClient = mockDeep<PrismaClient>();

    beforeAll(() => {
        res.send = vi.fn();
        res.status = vi.fn(() => res);
        res.json = vi.fn();

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

    it("should fetch configurations by merchant ID", async () => {
        const req = {} as any as Request;
        req.user = { id: 1 };

        await SettingsController.get(req, res);
        expect(res.json).toHaveBeenCalledWith({
            settings: [
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
            ],
        });
    });

    it("should return 404 if no configurations found by merchant ID", async () => {
        const req = {} as any as Request;
        req.user = { id: 2 };

        (
            mockPrismaClient.merchantSettings.findMany as any
        ).mockResolvedValueOnce(null);

        await SettingsController.get(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith({
            status: "error",
            message: "Error fetching settings",
        });
    });

    it("should update a configuration", async () => {
        const req = {} as any as Request;
        req.user = { id: 1 };
        req.params = {
            setting: JSON.stringify({
                id: 1,
                property: "testProperty",
                value: 200,
            }),
        };

        await SettingsController.update(req, res);
        expect(res.json).toHaveBeenCalledWith({
            id: 1,
            property: "testProperty",
            value: 200,
            merchantId: 1,
        });
    });

    it("should handle update errors", async () => {
        const req = {} as any as Request;
        req.user = { id: 1 };
        req.params = {
            setting: JSON.stringify({
                id: 1,
                property: "testProperty",
                value: 200,
            }),
        };

        (mockPrismaClient.merchantSettings.update as any).mockRejectedValueOnce(
            new Error("Update error"),
        );

        await SettingsController.update(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            status: "Internal Server Error",
            message: "An unknown error occurred",
        });
    });

    it("should delete a configuration", async () => {
        const req = {} as any as Request;
        req.params = { id: "1" };

        await SettingsController.remove(req, res);
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });

    it("should handle delete errors", async () => {
        const req = {} as any as Request;
        req.params = { id: "1" };

        (mockPrismaClient.merchantSettings.delete as any).mockRejectedValueOnce(
            new Error("Delete error"),
        );

        await SettingsController.remove(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            status: "Internal Server Error",
            message: "An unknown error occurred",
        });
    });
});
