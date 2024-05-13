import { PrismaClient, Product, ProductType } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";

const products: Product[] = [
    {
        id: 1,
        name: "Haut",
        description: "Haut basic",
        merchantId: 1,
        price: 1.8,
        type: ProductType.CLOTHINGS,
    },
    {
        id: 2,
        name: "Jean",
        description: "Jean basic",
        merchantId: 1,
        price: 3.5,
        type: ProductType.CLOTHINGS,
    },
    {
        id: 3,
        name: "Shoes",
        description: "Shoes basic",
        merchantId: 1,
        price: 0.8,
        type: ProductType.CLOTHINGS,
    },
    {
        id: 4,
        name: "Skirt",
        description: "Skirt basic",
        merchantId: 1,
        price: 2.5,
        type: ProductType.CLOTHINGS,
    },
    {
        id: 5,
        name: "Pull",
        description: "Pull basic",
        merchantId: 1,
        price: 5.8,
        type: ProductType.CLOTHINGS,
    },
    {
        id: 6,
        name: "Coca",
        description: "Coca Cola",
        merchantId: 1,
        price: 1,
        type: ProductType.DRINKS,
    },
    {
        id: 7,
        name: "Kebab",
        description: "Kebab basic",
        merchantId: 1,
        price: 6.5,
        type: ProductType.FOODS,
    },
    {
        id: 8,
        name: "iPhone 12",
        description: "Beautiful iPhone 12",
        merchantId: 1,
        price: 199.8,
        type: ProductType.ELECTRONICS,
    },
    {
        id: 9,
        name: "Bed",
        description: "White bed",
        merchantId: 1,
        price: 100.8,
        type: ProductType.OTHERS,
    },
    {
        id: 10,
        name: "Bed",
        description: "Red bed",
        merchantId: 1,
        price: 101.8,
        type: ProductType.OTHERS,
    },
];

async function main() {
    const hash1 = await bcrypt.hash("Sells", 10);
    const hash2 = await bcrypt.hash("Sellsnew", 10);
    const mainMerchant = await prisma.merchant.upsert({
        where: { name: "Epices" },
        update: {},
        create: {
            name: "Epices",
            password: hash1,
        },
    });
    const clothesMerchant = await prisma.merchant.upsert({
        where: { name: "Clothes" },
        update: {},
        create: {
            name: "Clothes",
            password: hash2,
        },
    });
    for (const product of products) {
        await prisma.product.upsert({
            where: { id: product.id },
            update: {},
            create: {
                description: product.description,
                name: product.name,
                price: product.price,
                type: product.type,
                merchantId: product.merchantId,
            },
        });
    }
    await prisma.user.upsert({
        where: { id: 1 },
        update: {},
        create: {
            qrCode: "040842BA926781",
            name: "Benjamin",
            nfc: "04A2F3DA926780",
            amount: 999999999,
        },
    });
    console.log(mainMerchant, clothesMerchant);
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
    });
