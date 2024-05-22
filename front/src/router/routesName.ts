export enum Routes {
	SETTINGS = 'Settings',
	SHOP = 'Shop',
	CHECKOUT = 'Checkout',
	TRANSACTION = 'Transaction',
	ADMIN_PANEL = 'AdminPanel',
}

export type RootStackParamList = {
	[Routes.SETTINGS]: undefined;
	[Routes.SHOP]: undefined;
	[Routes.CHECKOUT]: undefined;
	[Routes.TRANSACTION]: undefined;
	[Routes.ADMIN_PANEL]: undefined;
};
