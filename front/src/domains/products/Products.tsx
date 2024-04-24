import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useReducer,
} from 'react';
import { ActionTypeProducts, ProductStore } from './types';
import { reducer } from './reducer';
import { getProductsByMerchantID } from '../../api/product.api';
import { MessageContext, MessageStore } from '../message/Context';
import { ActionTypeMessage } from '../message/types';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList, Routes } from '../../router/routesName';

const defaultProductStore: ProductStore = {
	productStore: [],
	getProducts: async (
		_: number,
		_navigation: DrawerNavigationProp<
			RootStackParamList,
			Routes.SETTINGS,
			undefined
		>
	) => {},
};

export const ProductContext = createContext<ProductStore>(defaultProductStore);

export const ProductWrapper = ({ children }: { children: React.ReactNode }) => {
	const [productStore, dispatch] = useReducer(
		reducer,
		defaultProductStore.productStore
	);
	const { dispatch: dispatchMessage } =
		useContext<MessageStore>(MessageContext);

	const getProducts = useCallback(
		(
			merchantId: number,
			navigation: DrawerNavigationProp<
				RootStackParamList,
				Routes.SETTINGS,
				undefined
			>
		) => {
			getProductsByMerchantID(merchantId)
				.then(response => {
					const { data } = response;
					const { status, data: dataContainer } = data;
					if (status !== 'success') {
						dispatchMessage({
							code: 'GET_PRODUCTS_FAILED',
							type: ActionTypeMessage.ADD_ERROR,
							duration: 3000,
						});
						return;
					}
					dispatch({
						type: ActionTypeProducts.GET_PRODUCTS,
						products: dataContainer,
					});
					navigation.navigate(Routes.SHOP);
				})
				.catch(err => {});
		},
		[]
	);

	const value = useMemo(
		() => ({ productStore, getProducts }),
		[productStore]
	);

	return (
		<ProductContext.Provider value={value}>
			{children}
		</ProductContext.Provider>
	);
};
