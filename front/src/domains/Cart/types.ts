import { Product } from "../products/types";
import { ReducerType } from "../reducer";

export interface ProductCart {
	id: number;
	quantity: number;
	price: number;
}

export interface CartStore {
	cartStore: ProductCart[];
	addProduct: (product: Product) => void;
	removeProduct: (product_id: number) => void;
	clearCart: () => void;
}

export enum CartAction {
	ADD_PRODUCT = 'ADD_PRODUCT',
	REMOVE_PRODUCT = 'REMOVE_PRODUCT',
	CLEAR_CART = 'CLEAR_CART',
}

export interface AddProductCartAction {
	product: ProductCart;
}

export interface RemoveProductCartAction {
	product_id: number;
}

export type Action =
	| ({
			type: CartAction.ADD_PRODUCT;
	  } & AddProductCartAction)
	| ({
			type: CartAction.REMOVE_PRODUCT;
	  } & RemoveProductCartAction)
	| {
			type: CartAction.CLEAR_CART;
	  };

export type CartReducer = ReducerType<CartAction, Action, ProductCart[]>;
