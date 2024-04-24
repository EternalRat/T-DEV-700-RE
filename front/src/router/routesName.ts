export enum Routes {
	SETTINGS = 'Settings',
	SHOP = 'Shop',
	CHECKOUT = 'Checkout',
	TRANSACTION = 'Transaction',
}

export type RootStackParamList = {
	[Routes.SETTINGS]: undefined;
	[Routes.SHOP]: undefined;
	[Routes.CHECKOUT]: undefined;
	[Routes.TRANSACTION]: undefined;
};
