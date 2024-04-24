require("dotenv").config();
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"; // 👈🏻 Added the `vi` import
import { mockDeep, mockReset } from "vitest-mock-extended";
import DatabaseClient from "../class/database.class";
import { PrismaClient } from "@prisma/client";
import MockCMUser from "./mocks/user.mock";

describe("User", () => {
    let mockDatabaseClient: DatabaseClient;
    let mockPrisma: PrismaClient;
    let user: MockCMUser;

    beforeEach(() => {
        mockDatabaseClient = mockDeep<DatabaseClient>();
        mockPrisma = mockDeep<PrismaClient>();
        vi.spyOn(DatabaseClient, "getDatabaseInstance").mockReturnValue(
            mockDatabaseClient,
        );
        vi.spyOn(DatabaseClient.prototype, "getClient").mockReturnValue(
            mockPrisma,
        );
    });

    afterEach(() => {
        mockReset(mockPrisma); // Réinitialiser les mocks après chaque test
        mockReset(mockDatabaseClient); // Réinitialiser les mocks après chaque test
    });

    test("createUser should return the generated user", async () => {
        const newUser = { cartId: "1", name: "Prisma Fan" };
        user = MockCMUser.fromJSON(newUser);
        const newRegisteredUser = await user.save();
        expect(newRegisteredUser).toStrictEqual({ ...newUser, id: 1 });
    });
});
