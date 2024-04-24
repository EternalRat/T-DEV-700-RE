import {
	Action,
	AddProductCartAction,
	CartAction,
	CartReducer,
	ProductCart,
	RemoveProductCartAction,
} from './types';

const configReducer: CartReducer = {
	[CartAction.ADD_PRODUCT]: (state: ProductCart[], action: Action) => {
		const newState: ProductCart[] = JSON.parse(JSON.stringify(state));
		const product = (action as AddProductCartAction).product;
		const index = newState.findIndex(
			p => p.id === product.id
		);
		if (index === -1) {
			newState.push(product);
		} else {
			newState[index].quantity += product.quantity;
			newState[index].price += product.price;
		}
		return newState;
	},
	[CartAction.REMOVE_PRODUCT]: (state: ProductCart[], action: Action) => {
		const newState: ProductCart[] = JSON.parse(JSON.stringify(state));
		const product_id = (action as RemoveProductCartAction).product_id;
		const index = newState.findIndex(p => p.id === product_id);
        if (index !== -1) {
            newState[index].price -= (newState[index].price / newState[index].quantity);
            newState[index].quantity -= 1;
        }
        if (newState[index].quantity === 0) {
            newState.splice(index, 1);
        }
		return newState;
	},
    [CartAction.CLEAR_CART]: (state: ProductCart[], action: Action) => {
        return [];
    },
};

export const reducer = (state: ProductCart[], action: Action): ProductCart[] => {
    try {
        return configReducer[action.type](state, action);
    } catch (error) {
        console.error('reducer:error', error);
        return state;
    }
}