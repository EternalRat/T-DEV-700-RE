import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useReducer,
} from 'react';
import { CartAction, CartStore, ProductCart } from './types';
import { reducer } from './reducer';
import { Product } from '../Products/types';
import { MessageContext, MessageStore } from '../message/Context';
import { ActionTypeMessage, MessageType } from '../message/types';

export const defaultCart: CartStore = {
	cartStore: [],
	addProduct: (_: Product) => {},
	removeProduct: (_: number) => {},
	clearCart: () => {},
};

export const CartContext = createContext<CartStore>(defaultCart);

export const CartWrapper = ({ children }: { children: React.ReactNode }) => {
	const [cartStore, dispatch] = useReducer(reducer, defaultCart.cartStore);
	const { dispatch: dispatchMessage } =
		useContext<MessageStore>(MessageContext);

	const addProduct = useCallback((product: Product) => {
		dispatch({
			type: CartAction.ADD_PRODUCT,
			product: {
				id: product.id,
				price: product.price,
				quantity: 1,
			},
		});
		dispatchMessage({
			message: 'ADD_PRODUCT',
			type: ActionTypeMessage.ADD_GENERIC_MESSAGE,
			typeMessage: MessageType.SUCCESS,
		});
	}, []);

	const removeProduct = useCallback((product_id: number) => {
		dispatch({ type: CartAction.REMOVE_PRODUCT, product_id });
		dispatchMessage({
			message: 'REMOVE_PRODUCT',
			type: ActionTypeMessage.ADD_GENERIC_MESSAGE,
			typeMessage: MessageType.SUCCESS,
		});
	}, []);

	const clearCart = useCallback(() => {
		dispatch({ type: CartAction.CLEAR_CART });
	}, []);

	const value = useMemo(
		() => ({ cartStore, addProduct, removeProduct, clearCart }),
		[cartStore]
	);

	return (
		<CartContext.Provider value={value}>{children}</CartContext.Provider>
	);
};
