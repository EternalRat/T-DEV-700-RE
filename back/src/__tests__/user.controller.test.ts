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

    it("should create a product with its data", async () => {
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

    it("should get a product with its id sent as params", async () => {
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

    it("should get a product with its invalid id", async () => {
        const mockAuthMethods = {
            findUnique: vi.fn().mockResolvedValue(undefined),
        };

        const specialPrismaClient = mockDeep<PrismaClient>();
        // Assignez l'objet des méthodes user à la propriété user de mockPrismaClient
        (specialPrismaClient as any).user = mockAuthMethods;

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

    it("should update a product with its data", async () => {
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

    it("should delete a product with its id", async () => {
        const req = {} as any as Request;
        req.params = { id: "1" };

        await UserController.remove(req, res);
        expect(res.send).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(204);
    });

    it("should delete a product with its id", async () => {
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

    it("should get an user with its nfc id", async () => {
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
        const mockAuthMethods = {
            findUnique: vi.fn().mockResolvedValue(undefined),
        };

        const specialPrismaClient = mockDeep<PrismaClient>();
        // Assignez l'objet des méthodes user à la propriété user de mockPrismaClient
        (specialPrismaClient as any).user = mockAuthMethods;

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

    it("should get an user with its qrcode id", async () => {
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
        const mockAuthMethods = {
            findUnique: vi.fn().mockResolvedValue(undefined),
        };

        const specialPrismaClient = mockDeep<PrismaClient>();
        // Assignez l'objet des méthodes user à la propriété user de mockPrismaClient
        (specialPrismaClient as any).user = mockAuthMethods;

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

    it("should delete every user", async () => {
        const req = {} as any as Request;

        await UserController.deleteAll(req, res);
        expect(res.send).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(204);
    });
});
