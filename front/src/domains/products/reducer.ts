import {
	Action,
	ActionTypeProducts,
	AddProductAction,
	EditProductAction,
	GetProductsAction,
	Product,
	ProductsReducer,
} from './types';

const configReducer: ProductsReducer = {
	[ActionTypeProducts.GET_PRODUCTS]: (state: Product[], action: Action) =>
		(action as GetProductsAction).products,
	[ActionTypeProducts.ADD_PRODUCT]: (state: Product[], action: Action) => {
		const oldState = state.slice();
		oldState.push((action as AddProductAction).product);
		return oldState;
	},
	[ActionTypeProducts.EDIT_PRODUCT]: (state: Product[], action: Action) => {
		const oldState = state.slice();
		const productIndex = oldState.findIndex(
			product => product.id === (action as EditProductAction).id
		);
		const newProduct = {
			...oldState[productIndex],
			...(action as EditProductAction).product,
		};
		oldState[productIndex] = newProduct;
		return oldState;
	},
};

export const reducer = (state: Product[], action: Action): Product[] => {
	try {
		return configReducer[action.type](state, action);
	} catch (error) {
		console.error('reducer:error', error);
		return state;
	}
};
