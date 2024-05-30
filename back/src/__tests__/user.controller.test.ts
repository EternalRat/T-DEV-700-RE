import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { Request, Response } from "express";
import { mockDeep, mockReset } from "vitest-mock-extended";
import { PrismaClient, ProductType } from "@prisma/client";
import DatabaseClient from "../class/database.class";
import { UserController } from "../controllers/user.controller";

describe("Auth Controller", () => {
    const res = {} as any as Response;
    const mockPrismaClient = mockDeep<PrismaClient>();

    beforeAll(() => {
        res.send = vi.fn();
        res.status = vi.fn(() => res);
        res.cookie = vi.fn(() => res);
        res.json = vi.fn();

        const mockUserMethods = {
            create: vi.fn().mockResolvedValue({
                name: "Prisma Fan",
                id: 1,
                cartId: "1",
            }),
            update: vi.fn().mockResolvedValue({
                name: "Prisma Fan New",
                id: 2,
                cartId: "2",
            }),
            delete: vi.fn().mockResolvedValue({
                name: "Prisma Fan",
                id: 1,
                cartId: "1",
            }),
            deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
            findUnique: vi.fn().mockResolvedValue({
                name: "Prisma Fan",
                id: 1,
                cartId: "1",
                nfc: "Test",
                qrCode: "Test",
            }),
            findMany: vi.fn().mockResolvedValue([
                {
                    name: "Prisma Fan",
                    id: 2,
                    cartId: "1",
                },
                {
                    name: "Prisma Fan 2",
                    id: 2,
                    cartId: "2",
                },
            ]),
        };

        // Assignez l'objet des méthodes user à la propriété user de mockPrismaClient
        (mockPrismaClient as any).user = mockUserMethods;

        vi.spyOn(DatabaseClient.prototype, "getClient").mockReturnValue(
            mockPrismaClient,
        );
    });

    afterAll(() => {
        mockReset(mockPrismaClient); // Réinitialiser les mocks après chaque test
    });

    it("should create a user with its data", async () => {
        const req = {} as any as Request;
        req.body = {
            name: "Prisma Fan",
            id: 1,
            cartId: "1",
        };

        await UserController.create(req, res);
        expect(res.json).toHaveBeenCalledWith({
            name: "Prisma Fan",
            id: 1,
            cartId: "1",
        });
    });

    it("should handle errors when creating a user", async () => {
        const req = {} as any as Request;
        req.body = {
            name: "Prisma Fan",
            id: 1,
            cartId: "1",
        };

        (mockPrismaClient.user.create as any).mockRejectedValueOnce(
            new Error("Create error"),
        );

        await UserController.create(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            status: "Internal Server Error",
            message: "Could not create user",
        });
    });

    it("should get a user with its id sent as params", async () => {
        const req = {} as any as Request;
        req.params = { id: "1" };

        await UserController.get(req, res);
        expect(res.json).toHaveBeenCalledWith({
            name: "Prisma Fan",
            id: 1,
            cartId: "1",
            nfc: "Test",
            qrCode: "Test",
        });
    });

    it("should handle errors when getting a user by ID", async () => {
        const req = {} as any as Request;
        req.params = { id: "1" };

        (mockPrismaClient.user.findUnique as any).mockRejectedValueOnce(
            new Error("Find error"),
        );

        await UserController.get(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            status: "Internal Server Error",
            message: "User not found",
        });
    });

    it("should get a user with its invalid id", async () => {
        const mockUserMethods = {
            findUnique: vi.fn().mockResolvedValue(undefined),
        };

        const specialPrismaClient = mockDeep<PrismaClient>();
        (specialPrismaClient as any).user = mockUserMethods;

        vi.spyOn(DatabaseClient.prototype, "getClient").mockReturnValue(
            specialPrismaClient,
        );

        const req = {} as any as Request;
        req.params = { id: "2" };

        await UserController.get(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("User not found");

        vi.spyOn(DatabaseClient.prototype, "getClient").mockReturnValue(
            mockPrismaClient,
        );
    });

    it("should update a user with its data", async () => {
        const req = {} as any as Request;
        req.body = {
            name: "Prisma Fan New",
            cartId: "2",
        };
        req.params = { id: "1" };

        await UserController.update(req, res);
        expect(res.json).toHaveBeenCalledWith({
            name: "Prisma Fan New",
            id: 2,
            cartId: "2",
        });
    });

    it("should handle errors when updating a user", async () => {
        const req = {} as any as Request;
        req.body = {
            name: "Prisma Fan New",
            cartId: "2",
        };
        req.params = { id: "1" };

        (mockPrismaClient.user.update as any).mockRejectedValueOnce(
            new Error("Update error"),
        );

        await UserController.update(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            status: "Internal Server Error",
            message: "An unknown error occurred",
        });
    });

    it("should delete a user with its id", async () => {
        const req = {} as any as Request;
        req.params = { id: "1" };

        await UserController.remove(req, res);
        expect(res.send).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(204);
    });

    it("should handle errors when deleting a user", async () => {
        const req = {} as any as Request;
        req.params = { id: "1" };

        (mockPrismaClient.user.delete as any).mockRejectedValueOnce(
            new Error("Delete error"),
        );

        await UserController.remove(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            status: "Internal Server Error",
            message: "An unknown error occurred",
        });
    });

    it("should get all existing users", async () => {
        const req = {} as any as Request;

        await UserController.getAll(req, res);
        expect(res.json).toHaveBeenCalledWith([
            {
                name: "Prisma Fan",
                id: 2,
                cartId: "1",
            },
            {
                name: "Prisma Fan 2",
                id: 2,
                cartId: "2",
            },
        ]);
    });

    it("should handle errors when getting all users", async () => {
        const req = {} as any as Request;

        (mockPrismaClient.user.findMany as any).mockRejectedValueOnce(
            new Error("Find error"),
        );

        await UserController.getAll(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            status: "Internal Server Error",
            message: "An unknown error occurred",
        });
    });

    it("should get a user with its nfc id", async () => {
        const req = {} as any as Request;
        req.params = {
            id: "Test",
        };

        await UserController.getByNFC(req, res);
        expect(res.json).toHaveBeenCalledWith({
            name: "Prisma Fan",
            id: 1,
            cartId: "1",
            nfc: "Test",
            qrCode: "Test",
        });
    });

    it("should get undefined with invalid nfc", async () => {
        const mockUserMethods = {
            findUnique: vi.fn().mockResolvedValue(undefined),
        };

        const specialPrismaClient = mockDeep<PrismaClient>();
        (specialPrismaClient as any).user = mockUserMethods;

        vi.spyOn(DatabaseClient.prototype, "getClient").mockReturnValue(
            specialPrismaClient,
        );

        const req = {} as any as Request;
        req.params = {
            id: "Test2",
        };

        await UserController.getByNFC(req, res);
        expect(res.send).toHaveBeenCalledWith("User not found");
        expect(res.status).toHaveBeenCalledWith(404);

        vi.spyOn(DatabaseClient.prototype, "getClient").mockReturnValue(
            mockPrismaClient,
        );
    });

    it("should handle errors when getting user by NFC id", async () => {
        const req = {} as any as Request;
        req.params = {
            id: "Test",
        };

        (mockPrismaClient.user.findUnique as any).mockRejectedValueOnce(
            new Error("Find error"),
        );

        await UserController.getByNFC(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            status: "Internal Server Error",
            message: "An unknown error occurred",
        });
    });

    it("should get a user with its qrcode id", async () => {
        const req = {} as any as Request;
        req.params = {
            id: "Test",
        };

        await UserController.getByQRCode(req, res);
        expect(res.json).toHaveBeenCalledWith({
            name: "Prisma Fan",
            id: 1,
            cartId: "1",
            nfc: "Test",
            qrCode: "Test",
        });
    });

    it("should get undefined with invalid qrcode", async () => {
        const mockUserMethods = {
            findUnique: vi.fn().mockResolvedValue(undefined),
        };

        const specialPrismaClient = mockDeep<PrismaClient>();
        (specialPrismaClient as any).user = mockUserMethods;

        vi.spyOn(DatabaseClient.prototype, "getClient").mockReturnValue(
            specialPrismaClient,
        );

        const req = {} as any as Request;
        req.params = {
            id: "Test2",
        };

        await UserController.getByQRCode(req, res);
        expect(res.send).toHaveBeenCalledWith("User not found");
        expect(res.status).toHaveBeenCalledWith(404);

        vi.spyOn(DatabaseClient.prototype, "getClient").mockReturnValue(
            mockPrismaClient,
        );
    });

    it("should handle errors when getting user by QR code", async () => {
        const req = {} as any as Request;
        req.params = {
            id: "Test",
        };

        (mockPrismaClient.user.findUnique as any).mockRejectedValueOnce(
            new Error("Find error"),
        );

        await UserController.getByQRCode(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            status: "Internal Server Error",
            message: "An unknown error occurred",
        });
    });

    it("should delete every user", async () => {
        const req = {} as any as Request;

        await UserController.deleteAll(req, res);
        expect(res.send).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(204);
    });

    it("should handle errors when deleting all users", async () => {
        const req = {} as any as Request;

        (mockPrismaClient.user.deleteMany as any).mockRejectedValueOnce(
            new Error("Delete error"),
        );

        await UserController.deleteAll(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            status: "Internal Server Error",
            message: "An unknown error occurred",
        });
    });
});
