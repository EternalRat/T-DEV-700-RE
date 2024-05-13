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
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList, Routes } from '../../router/routesName';
import { MessageContext, MessageStore } from '../Message/Context';
import { ActionTypeMessage } from '../Message/types';

const defaultProductStore: ProductStore = {
	productStore: [],
	getProducts: (
		_: number,
		_navigation: DrawerNavigationProp<
			RootStackParamList,
			Routes.SETTINGS,
			undefined
		>
	) => Promise.resolve(),
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
		async (
			merchantId: number,
			navigation: DrawerNavigationProp<
				RootStackParamList,
				Routes.SETTINGS,
				undefined
			>
		) => {
			try {
				console.log('test getproducts');
				const response = await getProductsByMerchantID(merchantId);
				const { data } = response;
				const { status, data: dataContainer } = data;
				console.log(status, dataContainer);
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
			} catch (err) {
				console.log('ttttt', err);
			}
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
