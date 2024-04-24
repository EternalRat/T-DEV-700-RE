import {
	Action,
	ActionTypeProducts,
	GetProductsAction,
	Product,
	ProductsReducer,
} from './types';

const configReducer: ProductsReducer = {
	[ActionTypeProducts.GET_PRODUCTS]: (state: Product[], action: Action) =>
		(action as GetProductsAction).products,
};

export const reducer = (state: Product[], action: Action): Product[] => {
	try {
		return configReducer[action.type](state, action);
	} catch (error) {
		console.error('reducer:error', error);
		return state;
	}
};
