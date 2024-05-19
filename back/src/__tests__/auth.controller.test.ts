import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { Request, Response } from "express";
import { mockDeep, mockReset } from "vitest-mock-extended";
import { PrismaClient } from "@prisma/client";
import DatabaseClient from "../class/database.class";
import { AuthController } from "../controllers/auth.controller";
import bcrypt from "bcrypt";

describe("Auth Controller", () => {
    const res = {} as any as Response;
    const mockPrismaClient = mockDeep<PrismaClient>();

    beforeAll(() => {
        res.send = vi.fn();
        res.status = vi.fn(() => res);
        res.cookie = vi.fn(() => res);
        res.json = vi.fn();

        const mockAuthMethods = {
            create: vi.fn().mockResolvedValue({
                name: "newUser",
                password: bcrypt.hashSync("new", 10),
                id: 1,
                products: [],
            }),
            findUnique: vi.fn().mockResolvedValue({
                name: "newUser",
                password: bcrypt.hashSync("new", 10),
                products: [],
                id: 1,
            }),
            findMany: vi.fn().mockResolvedValue([
                {
                    name: "newUser",
                    password: bcrypt.hashSync("new", 10),
                    products: [],
                    id: 1,
                },
                {
                    name: "newUser",
                    password: bcrypt.hashSync("new", 10),
                    products: [],
                    id: 2,
                },
            ]),
            update: vi.fn().mockResolvedValue({
                id: 2,
                name: "newUserNew",
                password: bcrypt.hashSync("newPassword", 10),
                products: [],
            }),
            delete: vi.fn().mockResolvedValue({
                name: "newUser",
                password: bcrypt.hashSync("new", 10),
                products: [],
                id: 1,
            }),
        };

        // Assignez l'objet des méthodes user à la propriété user de mockPrismaClient
        (mockPrismaClient as any).merchant = mockAuthMethods;

        vi.spyOn(DatabaseClient.prototype, "getClient").mockReturnValue(
            mockPrismaClient,
        );
    });

    afterAll(() => {
        mockReset(mockPrismaClient); // Réinitialiser les mocks après chaque test
    });

    it("should refuse login since password is missing", async () => {
        const req = {} as any as Request;
        req.body = {
            username: "newUser",
        };

        await AuthController.login(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith({
            status: "error",
            message: "Missing username or password.",
        });
    });

    it("should refuse login since password is incorrect", async () => {
        const req = {} as any as Request;
        req.body = {
            username: "newUser",
            password: "newOkok",
        };

        await AuthController.login(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith({
            status: "error",
            message: "Invalid password.",
        });
    });

    it("should refuse login since password is incorrect", async () => {
        const req = {} as any as Request;
        req.body = {
            username: "newUser",
            password: "newOkok",
        };

        await AuthController.login(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith({
            status: "error",
            message: "Invalid password.",
        });
    });

    it("should return the logged user", async () => {
        const req = {} as any as Request;
        req.user = {
            username: "newUser",
            id: 1,
        };

        await AuthController.getAuthedUser(req, res);
        expect(res.send).toHaveBeenCalledWith({
            message: "User found",
            data: req.user,
        });
    });

    it("should return that no user is logged in", async () => {
        const req = {} as any as Request;

        await AuthController.getAuthedUser(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: "No user found",
            status: 404,
        });
    });

    it("should refuse login since username is incorrect", async () => {
        const mockAuthMethods = {
            findUnique: vi.fn().mockResolvedValue(undefined),
        };

        const specialPrismaClient = mockDeep<PrismaClient>();
        // Assignez l'objet des méthodes user à la propriété user de mockPrismaClient
        (specialPrismaClient as any).merchant = mockAuthMethods;

        vi.spyOn(DatabaseClient.prototype, "getClient").mockReturnValue(
            specialPrismaClient,
        );

        const req = {} as any as Request;
        req.body = {
            username: "newUserNew",
            password: "new",
        };

        await AuthController.login(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith({
            status: "error",
            message: "No user found with that username.",
        });

        vi.spyOn(DatabaseClient.prototype, "getClient").mockReturnValue(
            mockPrismaClient,
        );
    });

    it("should allow login using the user newUser and the password pass", async () => {
        const req = {} as any as Request;
        req.body = {
            username: "newUser",
            password: "new",
        };

        await AuthController.login(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({
            status: 200,
            user: {
                name: "newUser",
                id: 1,
            },
        });
    });
});
