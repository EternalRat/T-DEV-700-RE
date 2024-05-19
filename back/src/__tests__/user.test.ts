require("dotenv").config();
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"; // 👈🏻 Added the `vi` import
import { mockDeep, mockReset } from "vitest-mock-extended";
import DatabaseClient from "../class/database.class";
import { PrismaClient } from "@prisma/client";
import CMUser from "../class/user.class";

describe("User class", () => {
    let mockPrismaClient;
    beforeAll(() => {
        // Création d'un faux PrismaClient
        mockPrismaClient = mockDeep<PrismaClient>();

        // Créez un objet pour représenter les méthodes user
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

    it("should return the setted amount", async () => {
        const user = new CMUser();
        user.setAmount(1);
        expect(user.getAmount()).toStrictEqual(1);
    });

    it("should return the setted id", async () => {
        const user = new CMUser();
        user.setId(1);
        expect(user.getId()).toStrictEqual(1);
    });

    it("should return the setted nfc", async () => {
        const user = new CMUser();
        user.setNFC("1");
        expect(user.getNFC()).toStrictEqual("1");
    });

    it("should return the setted name", async () => {
        const user = new CMUser();
        user.setName("Prisma Client");
        expect(user.getName()).toStrictEqual("Prisma Client");
    });

    it("should return the setted qrCode", async () => {
        const user = new CMUser();
        user.setQRCode("1");
        expect(user.getQRCode()).toStrictEqual("1");
    });

    it("should return the newly created user", async () => {
        const newUser = { cartId: "1", name: "Prisma Fan" };
        const user = CMUser.fromJSON(newUser);
        const newRegisteredUser = await user.save();
        expect(newRegisteredUser).toStrictEqual({ ...newUser, id: 1 });
    });

    it("should return the modified user", async () => {
        let user = CMUser.fromJSON({ cartId: "1", name: "Prisma Fan" });
        const newRegisteredUser = await user.save();
        expect(newRegisteredUser).toStrictEqual({
            ...{ cartId: "1", name: "Prisma Fan" },
            id: 1,
        });
        const newUser = { cartId: "2", name: "Prisma Fan New" };
        user = CMUser.fromJSON(newUser);
        const updatedUser = await user.update();
        expect(updatedUser).toStrictEqual({
            ...{ cartId: "2", name: "Prisma Fan New" },
            id: 2,
        });
    });

    it("should delete the user", async () => {
        const user = CMUser.fromJSON({ cartId: "1", name: "Prisma Fan" });
        const newRegisteredUser = await user.delete();
        expect(newRegisteredUser).toStrictEqual({
            ...{ cartId: "1", name: "Prisma Fan" },
            id: 1,
        });
    });

    it("should find the user with id 1", async () => {
        const newUser = await CMUser.fetchById(1);
        expect(newUser).toStrictEqual({
            cartId: "1",
            name: "Prisma Fan",
            nfc: "Test",
            qrCode: "Test",
            id: 1,
        });
    });

    it("should find the user with nfc 1", async () => {
        const newUser = await CMUser.fetchByNFC("1");
        expect(newUser).toStrictEqual({
            cartId: "1",
            name: "Prisma Fan",
            nfc: "Test",
            qrCode: "Test",
            id: 1,
        });
    });

    it("should find the user with qrCode 1", async () => {
        const newUser = await CMUser.fetchByQRCode("1");
        expect(newUser).toStrictEqual({
            cartId: "1",
            name: "Prisma Fan",
            nfc: "Test",
            qrCode: "Test",
            id: 1,
        });
    });

    it("should find all users", async () => {
        const users = await CMUser.fetchAll();
        expect(users).toStrictEqual([
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

    it("should create an user from json and return the same json", async () => {
        const user = CMUser.fromJSON({
            id: 1,
            name: "Prisma Fan",
            qrCode: "Test",
            nfc: "Test",
            amount: 1,
        });
        expect(user.toJSON()).toStrictEqual({
            id: 1,
            name: "Prisma Fan",
            qrCode: "Test",
            nfc: "Test",
            amount: 1,
        });
    });

    it("should make sure that the deleteAll has been called", async () => {
        await CMUser.deleteAll();
        expect(mockPrismaClient.user.deleteMany).toHaveBeenCalledOnce();
    });
});
