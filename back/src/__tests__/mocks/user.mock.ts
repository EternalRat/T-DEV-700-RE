import { User } from "@prisma/client";
import CMUser from "../../class/user.class";
import { vi } from "vitest";

export default class MockCMUser extends CMUser {
    constructor() {
        super();
        vi.spyOn(MockCMUser.prototype, "save").mockReturnValue({
            name: "Prisma Fan",
            id: 1,
            cartId: "1",
        } as unknown as Promise<User>);
    }
}
