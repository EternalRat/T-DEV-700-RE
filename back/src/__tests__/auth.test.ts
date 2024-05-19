require("dotenv").config();
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"; // 👈🏻 Added the `vi` import
import { mockDeep, mockReset } from "vitest-mock-extended";
import DatabaseClient from "../class/database.class";
import { PrismaClient, Product, ProductType } from "@prisma/client";
import CMAuth from "../class/auth.class";

describe("User class", () => {
    let mockPrismaClient;
    beforeAll(() => {
        // Création d'un faux PrismaClient
        mockPrismaClient = mockDeep<PrismaClient>();

        // Créez un objet pour représenter les méthodes user
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

        const mockAuthMethods = {
            create: vi.fn().mockResolvedValue({
                name: "newUser",
                password: "new",
                id: 1,
                products: [],
            }),
            findUnique: vi.fn().mockResolvedValue({
                name: "newUser",
                password: "new",
                products: [],
                id: 1,
            }),
            findMany: vi.fn().mockResolvedValue([
                {
                    name: "newUser",
                    password: "new",
                    products: [],
                    id: 1,
                },
                {
                    name: "newUser",
                    password: "new",
                    products: [],
                    id: 2,
                },
            ]),
            update: vi.fn().mockResolvedValue({
                id: 2,
                name: "newUserNew",
                password: "newPassword",
                products: [],
            }),
            delete: vi.fn().mockResolvedValue({
                name: "newUser",
                password: "new",
                products: [],
                id: 1,
            }),
        };

        // Assignez l'objet des méthodes user à la propriété user de mockPrismaClient
        (mockPrismaClient as any).product = mockProductMethods;
        (mockPrismaClient as any).merchant = mockAuthMethods;

        vi.spyOn(DatabaseClient.prototype, "getClient").mockReturnValue(
            mockPrismaClient,
        ); 
    });

    afterAll(() => {
        mockReset(mockPrismaClient); // Réinitialiser les mocks après chaque test
    });

    it("should return the setted name", async () => {
        const auth = new CMAuth();
        auth.setName("1");
        expect(auth.getName()).toStrictEqual("1");
    });

    it("should return the setted id", async () => {
        const auth = new CMAuth();
        auth.setId(1);
        expect(auth.getId()).toStrictEqual(1);
    });

    it("should return the setted merchantId", async () => {
        const auth = new CMAuth();
        auth.setPassword("pass");
        expect(auth.getPassword()).toStrictEqual("pass");
    });

    it("should return the setted name", async () => {
        const auth = new CMAuth();
        auth.setProducts([
            {
                description: "tt",
                id: 1,
                merchantId: 1,
                name: "tt",
                price: 1,
                type: ProductType.ELECTRONICS,
            },
        ]);
        expect(auth.getProducts()).toStrictEqual([
            {
                description: "tt",
                id: 1,
                merchantId: 1,
                name: "tt",
                price: 1,
                type: ProductType.ELECTRONICS,
            },
        ]);
    });

    const newMerchant = {
        name: "newUser",
        password: "new",
        products: [],
    };

    it("should return the newly created merchant", async () => {
        const merchant = CMAuth.fromJSON(newMerchant);
        const newRegisteredUser = await merchant.save();
        expect(newRegisteredUser).toStrictEqual({ ...newMerchant, id: 1 });
    });

    it("should return the modified merchant", async () => {
        let merchant = CMAuth.fromJSON(newMerchant);
        const newRegisteredUser = await merchant.save();
        expect(newRegisteredUser).toStrictEqual({
            ...newMerchant,
            id: 1,
        });
        const updatedMerchant = {
            ...newMerchant,
            name: "newUserNew",
            password: "newPassword",
        };
        merchant = CMAuth.fromJSON(updatedMerchant);
        const updatedUser = await merchant.update();
        expect(updatedUser).toStrictEqual({
            ...updatedMerchant,
            id: 2,
        });
    });

    it("should delete the merchant", async () => {
        const merchant = CMAuth.fromJSON({ ...newMerchant, id: 1 });
        const newRegisteredUser = await merchant.delete();
        expect(newRegisteredUser).toStrictEqual({
            ...newMerchant,
            id: 1,
        });
    });

    it("should find the product with id 1", async () => {
        const newMerchant = await CMAuth.fetchById(1);
        expect(newMerchant).toStrictEqual({
            ...newMerchant,
            id: 1,
        });
    });

    it("should find the product with username newUser", async () => {
        const newMerchant = await CMAuth.fetchByUsername("newUser");
        expect(newMerchant).toStrictEqual({
            ...newMerchant,
            id: 1,
        });
    });

    it("should find all merchants", async () => {
        const users = await CMAuth.fetchAll();
        expect(users).toStrictEqual([
            {
                name: "newUser",
                password: "new",
                products: [],
                id: 1,
            },
            {
                name: "newUser",
                password: "new",
                products: [],
                id: 2,
            },
        ]);
    });

    it("should create a merchant from json and return the same json", async () => {
        const merchant = CMAuth.fromJSON({
            id: 1,
            ...newMerchant,
        });
        expect(merchant.toJSON()).toStrictEqual({
            id: 1,
            name: newMerchant.name,
            products: newMerchant.products,
        });
    });

    it("should create a product with a merchantId", async () => {
        const merchant = CMAuth.fromJSON({
            id: 1,
            ...newMerchant,
        });
        const product = await merchant.addProduct({
            name: "Prisma Fan",
            price: 1,
            description: "Prisma Desc",
            merchantId: 1,
            type: ProductType.ELECTRONICS,
        } as Product);
        expect(product).toStrictEqual({
            name: "Prisma Fan",
            price: 1,
            description: "Prisma Desc",
            merchantId: 1,
            type: ProductType.ELECTRONICS,
            id: 1,
        });
    });

    it("should delete a product with a merchantId", async () => {
        const merchant = new CMAuth();
        const product = await merchant.removeProduct({
            name: "Prisma Fan",
            price: 1,
            description: "Prisma Desc",
            merchantId: 1,
            type: ProductType.ELECTRONICS,
        } as Product);
        expect(product).toStrictEqual({
            name: "Prisma Fan",
            price: 1,
            description: "Prisma Desc",
            merchantId: 1,
            type: ProductType.ELECTRONICS,
            id: 1,
        });
    });

    it("should update a product with a merchantId", async () => {
        const merchant = new CMAuth();
        const product = await merchant.updateProduct({
            name: "Prisma Fan New",
            price: 10,
            description: "Prisma Desc",
            merchantId: 1,
            type: ProductType.ELECTRONICS,
            id: 2,
        } as Product);
        expect(product).toStrictEqual({
            name: "Prisma Fan New",
            price: 10,
            description: "Prisma Desc",
            merchantId: 1,
            type: ProductType.ELECTRONICS,
            id: 2,
        });
    });

    it("should update a product with a merchantId", async () => {
        const product = await CMAuth.fetchProductsByMerchantId(1);
        expect(product).toStrictEqual([
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
});
