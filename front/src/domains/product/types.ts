import { DrawerNavigationProp } from '@react-navigation/drawer';

import { RootStackParamList, Routes } from '../../router/routesName';
import { ReducerType } from '../reducer';

export enum ProductType {
	ELECTRONICS = 'ELECTRONICS',
	CLOTHINGS = 'CLOTHINGS',
	FOODS = 'FOODS',
	DRINKS = 'DRINKS',
	OTHERS = 'OTHERS',
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
	) => Promise<void>;
	addProduct: (
		productName: string,
		description: string,
		price: number,
		type: ProductType,
		merchantId: number
	) => Promise<void>;
	editProduct: (
		id: number,
		productName: string,
		description: string,
		price: number,
		type: ProductType,
		merchantId: number
	) => Promise<void>;
}

export enum ActionTypeProducts {
	GET_PRODUCTS = 'GET_PRODUCTS',
	ADD_PRODUCT = 'ADD_PRODUCT',
	EDIT_PRODUCT = 'EDIT_PRODUCT',
}

export interface GetProductsAction {
	products: Product[];
}

export interface AddProductAction {
	product: Product;
}

export interface EditProductAction extends AddProductAction {
	id: number;
}

export type Action =
	| ({
			type: ActionTypeProducts.GET_PRODUCTS;
	  } & GetProductsAction)
	| ({ type: ActionTypeProducts.ADD_PRODUCT } & AddProductAction)
	| ({ type: ActionTypeProducts.EDIT_PRODUCT } & EditProductAction);

export type ProductsReducer = ReducerType<
	ActionTypeProducts,
	Action,
	Product[]
>;
