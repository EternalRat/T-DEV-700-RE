import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ReducerType } from '../reducer';
import { RootStackParamList, Routes } from '../../router/routesName';

enum ProductType {
	ELECTRONICS,
	CLOTHINGS,
	FOODS,
	DRINKS,
	OTHERS,
}

export interface Product {
	id: number;
	name: string;
	description: string;
	price: number;
	merchantId: number;
	type: ProductType;
}

export interface ProductStore {
	productStore: Product[];
	getProducts: (
		merchantId: number,
		navigation: DrawerNavigationProp<
			RootStackParamList,
			Routes.SETTINGS,
			undefined
		>
	) => void;
}

export enum ActionTypeProducts {
	GET_PRODUCTS = 'GET_PRODUCTS',
}

export interface GetProductsAction {
	products: Product[];
}

export type Action = {
	type: ActionTypeProducts.GET_PRODUCTS;
} & GetProductsAction;

export type ProductsReducer = ReducerType<
	ActionTypeProducts,
	Action,
	Product[]
>;
