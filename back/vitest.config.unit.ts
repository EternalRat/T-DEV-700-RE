import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["src/**/*.test.ts"],
        coverage: {
            all: true, // Couvre tous les fichiers de test
            // you can include other reporters, but 'json-summary' is required, json is recommended
            reporter: [
                "text",
                [
                    "json",
                    {
                        subdir: "./",
                        file: "coverage.json",
                    },
                ],
            ],
            // If you want a coverage reports even if your tests are failing, include the reportOnFailure option
            reportOnFailure: true,
            thresholds: {
                lines: 80,
                branches: 80,
                functions: 80,
                statements: 80,
            },
            exclude: [
                "src/__tests__/**",
                "*.js",
                "src/**/jwt.class.ts",
                "src/**/websocket.class.ts",
                "src/routes/**/*.ts",
                "build/**",
                "prisma/**",
                "src/index.ts",
            ],
        },
        globals: true,
        environment: "node",
        clearMocks: true,
    },
    resolve: {
        alias: {
            user: "/src/class/user.class",
            merchant: "/src/class/merchant.class",
            product: "/src/class/product.class",
        },
    },
});
