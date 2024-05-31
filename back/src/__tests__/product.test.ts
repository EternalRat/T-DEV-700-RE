require('dotenv').config();
import { PrismaClient, ProductType } from '@prisma/client';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'; // 👈🏻 Added the `vi` import
import { mockDeep, mockReset } from 'vitest-mock-extended';

import DatabaseClient from '../class/database.class';
import CMProduct from '../class/product.class';

describe('User class', () => {
	let mockPrismaClient: PrismaClient;
	beforeAll(() => {
		// Création d'un faux PrismaClient
		mockPrismaClient = mockDeep<PrismaClient>();

		// Créez un objet pour représenter les méthodes user
		const mockProductMethods = {
			create: vi.fn().mockResolvedValue({
				name: 'Prisma Fan',
				price: 1,
				description: 'Prisma Desc',
				merchantId: 1,
				type: ProductType.ELECTRONICS,
				id: 1,
			}),
			update: vi.fn().mockResolvedValue({
				name: 'Prisma Fan New',
				price: 10,
				description: 'Prisma Desc',
				merchantId: 1,
				type: ProductType.ELECTRONICS,
				id: 2,
			}),
			delete: vi.fn().mockResolvedValue({
				name: 'Prisma Fan',
				price: 1,
				description: 'Prisma Desc',
				merchantId: 1,
				type: ProductType.ELECTRONICS,
				id: 1,
			}),
			deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
			findUnique: vi.fn().mockResolvedValue({
				name: 'Prisma Fan',
				price: 1,
				description: 'Prisma Desc',
				merchantId: 1,
				type: ProductType.ELECTRONICS,
				id: 1,
			}),
			findMany: vi.fn().mockResolvedValue([
				{
					name: 'Prisma Fan',
					price: 1,
					description: 'Prisma Desc',
					merchantId: 1,
					type: ProductType.ELECTRONICS,
					id: 1,
				},
				{
					name: 'Prisma Fan',
					price: 1,
					description: 'Prisma Desc',
					merchantId: 1,
					type: ProductType.ELECTRONICS,
					id: 2,
				},
			]),
		};

		// Assignez l'objet des méthodes user à la propriété user de mockPrismaClient
		(mockPrismaClient as any).product = mockProductMethods;

		vi.spyOn(DatabaseClient.prototype, 'getClient').mockReturnValue(
			mockPrismaClient
		);
	});

	afterAll(() => {
		mockReset(mockPrismaClient); // Réinitialiser les mocks après chaque test
	});

	it('should return the setted description', async () => {
		const product = new CMProduct();
		product.setDescription('1');
		expect(product.getDescription()).toStrictEqual('1');
	});

	it('should return the setted id', async () => {
		const product = new CMProduct();
		product.setId(1);
		expect(product.getId()).toStrictEqual(1);
	});

	it('should return the setted merchantId', async () => {
		const product = new CMProduct();
		product.setMerchantId(1);
		expect(product.getMerchantId()).toStrictEqual(1);
	});

	it('should return the setted name', async () => {
		const product = new CMProduct();
		product.setName('Prisma Client');
		expect(product.getName()).toStrictEqual('Prisma Client');
	});

	it('should return the setted price', async () => {
		const product = new CMProduct();
		product.setPrice(1);
		expect(product.getPrice()).toStrictEqual(1);
	});

	it('should return the setted type', async () => {
		const product = new CMProduct();
		product.setType(ProductType.ELECTRONICS);
		expect(product.getType()).toStrictEqual(ProductType.ELECTRONICS);
	});

	const newProduct = {
		name: 'Prisma Fan',
		price: 1,
		description: 'Prisma Desc',
		merchantId: 1,
		type: ProductType.ELECTRONICS,
	};

	it('should return the newly created product', async () => {
		const product = CMProduct.fromJSON(newProduct);
		const newRegisteredUser = await product.save();
		expect(newRegisteredUser).toStrictEqual({ ...newProduct, id: 1 });
	});

	it('should return the modified product', async () => {
		let product = CMProduct.fromJSON(newProduct);
		const newRegisteredUser = await product.save();
		expect(newRegisteredUser).toStrictEqual({
			...newProduct,
			id: 1,
		});
		const updatedProduct = {
			...newProduct,
			price: 10,
			name: 'Prisma Fan New',
		};
		product = CMProduct.fromJSON(updatedProduct);
		const updatedUser = await product.update();
		expect(updatedUser).toStrictEqual({
			...updatedProduct,
			id: 2,
		});
	});

	it('should delete the product', async () => {
		const product = CMProduct.fromJSON({ ...newProduct, id: 1 });
		const newRegisteredUser = await product.delete();
		expect(newRegisteredUser).toStrictEqual({
			...newProduct,
			id: 1,
		});
	});

	it('should delete all product by merchantId', async () => {
		const newRegisteredUser = await CMProduct.deleteByMerchantId(1);
		expect(newRegisteredUser).toStrictEqual(1);
	});

	it('should find the product with id 1', async () => {
		const newProduct = await CMProduct.fetchById(1);
		expect(newProduct).toStrictEqual({
			...newProduct,
			id: 1,
		});
	});

	it('should find the product with merchantId 1', async () => {
		const findProduct = await CMProduct.fetchByMerchantId(1);
		expect(findProduct).toStrictEqual([
			{
				...newProduct,
				id: 1,
			},
			{
				...newProduct,
				id: 2,
			},
		]);
	});

	it('should find all users', async () => {
		const users = await CMProduct.fetchAll();
		expect(users).toStrictEqual([
			{
				name: 'Prisma Fan',
				price: 1,
				description: 'Prisma Desc',
				merchantId: 1,
				type: ProductType.ELECTRONICS,
				id: 1,
			},
			{
				name: 'Prisma Fan',
				price: 1,
				description: 'Prisma Desc',
				merchantId: 1,
				type: ProductType.ELECTRONICS,
				id: 2,
			},
		]);
	});

	it('should create an product from json and return the same json', async () => {
		const product = CMProduct.fromJSON({
			id: 1,
			...newProduct,
		});
		expect(product.toJSON()).toStrictEqual({
			id: 1,
			...newProduct,
		});
	});

	it('should make sure that the deleteAll has been called', async () => {
		await CMProduct.deleteAll();
		expect(mockPrismaClient.product.deleteMany).toHaveBeenCalledOnce();
	});
});
