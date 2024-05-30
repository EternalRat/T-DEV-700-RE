import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { Request, Response } from "express";
import { mockDeep, mockReset } from "vitest-mock-extended";
import { PrismaClient, ProductType } from "@prisma/client";
import DatabaseClient from "../class/database.class";
import { ProductController } from "../controllers/product.controller";

describe("Product Controller", () => {
    const res = {} as any as Response;
    const mockPrismaClient = mockDeep<PrismaClient>();

    beforeAll(() => {
        res.send = vi.fn();
        res.status = vi.fn(() => res);
        res.cookie = vi.fn(() => res);
        res.json = vi.fn();

        const mockProductMethods = {
            create: vi.fn().mockResolvedValue({
                name: "Prisma Fan",
                price: 1,
                description: "Prisma Desc",
                merchantId: 1,
                type: ProductType.ELECTRONICS,
                id: 1,
            }),
            update: vi.fn().mockResolvedValue({
                name: "Prisma Fan New",
                price: 10,
                description: "Prisma Desc",
                merchantId: 1,
                type: ProductType.ELECTRONICS,
                id: 2,
            }),
            delete: vi.fn().mockResolvedValue({
                name: "Prisma Fan",
                price: 1,
                description: "Prisma Desc",
                merchantId: 1,
                type: ProductType.ELECTRONICS,
                id: 1,
            }),
            deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
            findUnique: vi.fn().mockResolvedValue({
                name: "Prisma Fan",
                price: 1,
                description: "Prisma Desc",
                merchantId: 1,
                type: ProductType.ELECTRONICS,
                id: 1,
            }),
            findMany: vi.fn().mockResolvedValue([
                {
                    name: "Prisma Fan",
                    price: 1,
                    description: "Prisma Desc",
                    merchantId: 1,
                    type: ProductType.ELECTRONICS,
                    id: 1,
                },
                {
                    name: "Prisma Fan",
                    price: 1,
                    description: "Prisma Desc",
                    merchantId: 1,
                    type: ProductType.ELECTRONICS,
                    id: 2,
                },
            ]),
        };

        (mockPrismaClient as any).product = mockProductMethods;

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
            price: 1,
            description: "Prisma Desc",
            merchantId: 1,
            type: ProductType.ELECTRONICS,
        };

        await ProductController.create(req, res);
        expect(res.json).toHaveBeenCalledWith({
            name: "Prisma Fan",
            price: 1,
            description: "Prisma Desc",
            merchantId: 1,
            type: ProductType.ELECTRONICS,
            id: 1,
        });
    });

    it("should handle errors when creating a product", async () => {
        const req = {} as any as Request;
        req.body = {
            name: "Prisma Fan",
            price: 1,
            description: "Prisma Desc",
            merchantId: 1,
            type: ProductType.ELECTRONICS,
        };

        (mockPrismaClient.product.create as any).mockRejectedValueOnce(
            new Error("Create error"),
        );

        await ProductController.create(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            status: "Internal Server Error",
            message: "An unknown error occurred",
        });
    });

    it("should get a product with its id sent as params", async () => {
        const req = {} as any as Request;
        req.params = { id: "1" };

        await ProductController.get(req, res);
        expect(res.json).toHaveBeenCalledWith({
            name: "Prisma Fan",
            price: 1,
            description: "Prisma Desc",
            merchantId: 1,
            type: ProductType.ELECTRONICS,
            id: 1,
        });
    });

    it("should handle errors when getting a product by ID", async () => {
        const req = {} as any as Request;
        req.params = { id: "1" };

        (mockPrismaClient.product.findUnique as any).mockRejectedValueOnce(
            new Error("Find error"),
        );

        await ProductController.get(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            status: "Internal Server Error",
            message: "An unknown error occurred",
        });
    });

    it("should get a product with its invalid id", async () => {
        const mockProductMethods = {
            findUnique: vi.fn().mockResolvedValue(undefined),
        };

        const specialPrismaClient = mockDeep<PrismaClient>();
        (specialPrismaClient as any).product = mockProductMethods;

        vi.spyOn(DatabaseClient.prototype, "getClient").mockReturnValue(
            specialPrismaClient,
        );

        const req = {} as any as Request;
        req.params = { id: "2" };

        await ProductController.get(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("Product not found");

        vi.spyOn(DatabaseClient.prototype, "getClient").mockReturnValue(
            mockPrismaClient,
        );
    });

    it("should update a product with its data", async () => {
        const req = {} as any as Request;
        req.body = {
            name: "Prisma Fan New",
            price: 10,
            description: "Prisma Desc",
            merchantId: 1,
            type: ProductType.ELECTRONICS,
        };
        req.params = { id: "1" };

        await ProductController.update(req, res);
        expect(res.json).toHaveBeenCalledWith({
            name: "Prisma Fan New",
            price: 10,
            description: "Prisma Desc",
            merchantId: 1,
            type: ProductType.ELECTRONICS,
            id: 2,
        });
    });

    it("should handle errors when updating a product", async () => {
        const req = {} as any as Request;
        req.body = {
            name: "Prisma Fan New",
            price: 10,
            description: "Prisma Desc",
            merchantId: 1,
            type: ProductType.ELECTRONICS,
        };
        req.params = { id: "1" };

        (mockPrismaClient.product.update as any).mockRejectedValueOnce(
            new Error("Update error"),
        );

        await ProductController.update(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            status: "Internal Server Error",
            message: "An unknown error occurred",
        });
    });

    it("should delete a product with its id", async () => {
        const req = {} as any as Request;
        req.params = { id: "1" };

        await ProductController.remove(req, res);
        expect(res.send).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(204);
    });

    it("should handle errors when deleting a product", async () => {
        const req = {} as any as Request;
        req.params = { id: "1" };

        (mockPrismaClient.product.delete as any).mockRejectedValueOnce(
            new Error("Delete error"),
        );

        await ProductController.remove(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            status: "Internal Server Error",
            message: "An unknown error occurred",
        });
    });

    it("should get all existing products", async () => {
        const req = {} as any as Request;

        await ProductController.getAll(req, res);
        expect(res.json).toHaveBeenCalledWith([
            {
                name: "Prisma Fan",
                price: 1,
                description: "Prisma Desc",
                merchantId: 1,
                type: ProductType.ELECTRONICS,
                id: 1,
            },
            {
                name: "Prisma Fan",
                price: 1,
                description: "Prisma Desc",
                merchantId: 1,
                type: ProductType.ELECTRONICS,
                id: 2,
            },
        ]);
    });

    it("should handle errors when getting all products", async () => {
        const req = {} as any as Request;

        (mockPrismaClient.product.findMany as any).mockRejectedValueOnce(
            new Error("Find error"),
        );

        await ProductController.getAll(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            status: "Internal Server Error",
            message: "An unknown error occurred",
        });
    });

    it("should get all products from a merchant", async () => {
        const req = {} as any as Request;
        req.params = { id: "1" };

        await ProductController.getByMerchantId(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({
            status: "success",
            data: [
                {
                    name: "Prisma Fan",
                    price: 1,
                    description: "Prisma Desc",
                    merchantId: 1,
                    type: ProductType.ELECTRONICS,
                    id: 1,
                },
                {
                    name: "Prisma Fan",
                    price: 1,
                    description: "Prisma Desc",
                    merchantId: 1,
                    type: ProductType.ELECTRONICS,
                    id: 2,
                },
            ],
        });
    });

    it("should fail to find products from an invalid merchant id", async () => {
        const mockProductMethods = {
            findMany: vi.fn().mockResolvedValue(undefined),
        };

        const specialPrismaClient = mockDeep<PrismaClient>();
        (specialPrismaClient as any).product = mockProductMethods;

        vi.spyOn(DatabaseClient.prototype, "getClient").mockReturnValue(
            specialPrismaClient,
        );

        const req = {} as any as Request;
        req.params = { id: "2" };

        await ProductController.getByMerchantId(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("Products not found");

        vi.spyOn(DatabaseClient.prototype, "getClient").mockReturnValue(
            mockPrismaClient,
        );
    });

    it("should handle errors when getting products by merchant id", async () => {
        const req = {} as any as Request;
        req.params = { id: "1" };

        (mockPrismaClient.product.findMany as any).mockRejectedValueOnce(
            new Error("Find error"),
        );

        await ProductController.getByMerchantId(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            status: "Internal Server Error",
            message: "An unknown error occurred",
        });
    });

    it("should delete all products with merchant id", async () => {
        const req = {} as any as Request;
        req.params = { id: "1" };

        await ProductController.deleteByMerchantId(req, res);
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalledWith(1);
    });

    it("should handle errors when deleting products by merchant id", async () => {
        const req = {} as any as Request;
        req.params = { id: "1" };

        (mockPrismaClient.product.deleteMany as any).mockRejectedValueOnce(
            new Error("Delete error"),
        );

        await ProductController.deleteByMerchantId(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            status: "Internal Server Error",
            message: "An unknown error occurred",
        });
    });

    it("should delete all products", async () => {
        const req = {} as any as Request;

        await ProductController.deleteAll(req, res);
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });

    it("should handle errors when deleting all products", async () => {
        const req = {} as any as Request;

        (mockPrismaClient.product.deleteMany as any).mockRejectedValueOnce(
            new Error("Delete error"),
        );

        await ProductController.deleteAll(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            status: "Internal Server Error",
            message: "An unknown error occurred",
        });
    });
});
