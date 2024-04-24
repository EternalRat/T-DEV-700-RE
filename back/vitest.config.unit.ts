import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['src/**/*.test.ts'],
        coverage: { exclude: ['src/__tests__/**', '*.js'] },
        globals: true,
        environment: 'node',
        clearMocks: true,
    },
    resolve: {
        alias: {
            user: '/src/class/user.class',
            merchant: '/src/class/merchant.class',
            product: '/src/class/product.class',
        },
    },
});
