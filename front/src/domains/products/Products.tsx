import { DrawerNavigationProp } from '@react-navigation/drawer';
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useReducer,
} from 'react';

import {
	createProduct,
	getProductsByMerchantID,
	updateProduct,
} from '../../api/product.api';
import { RootStackParamList, Routes } from '../../router/routesName';
import { MessageContext, MessageStore } from '../Messages/Context';
import { ActionTypeMessage, MessageType } from '../Messages/types';
import { reducer } from './reducer';
import { ActionTypeProducts, ProductStore, ProductType } from './types';

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
	addProduct: (
		_productName: string,
		_description: string,
		_price: number,
		_type: ProductType,
		_merchantId: number
	) => Promise.resolve(),
	editProduct: (
		_id: number,
		_productName: string,
		_description: string,
		_price: number,
		_type: ProductType,
		_merchantId: number
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
				const {
					data: { status, data: dataContainer },
				} = await getProductsByMerchantID(merchantId);
				if (status !== 'success') {
					dispatchMessage({
						code: 'Get products failed',
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
				console.error(err);
			}
		},
		[]
	);

	const addProduct = useCallback(
		async (
			productName: string,
			description: string,
			price: number,
			type: ProductType,
			merchantId: number
		) => {
			try {
				const {
					data: { status, id },
				} = await createProduct(
					productName,
					description,
					price,
					type,
					merchantId
				);
				if (status !== 'success') {
					dispatchMessage({
						code: 'Add product failed',
						type: ActionTypeMessage.ADD_ERROR,
						duration: 3000,
					});
					return;
				}
				dispatch({
					type: ActionTypeProducts.ADD_PRODUCT,
					product: {
						name: productName,
						description,
						price,
						type,
						id,
						merchantId,
					},
				});
				dispatchMessage({
					message: 'Add product succeeded',
					type: ActionTypeMessage.ADD_GENERIC_MESSAGE,
					typeMessage: MessageType.SUCCESS,
					duration: 3000,
				});
			} catch {
				dispatchMessage({
					code: 'Add product failed',
					type: ActionTypeMessage.ADD_ERROR,
					duration: 3000,
				});
			}
		},
		[]
	);

	const editProduct = useCallback(
		async (
			id: number,
			productName: string,
			description: string,
			price: number,
			type: ProductType,
			merchantId: number
		) => {
			try {
				const { data } = await updateProduct(
					id,
					productName,
					description,
					price,
					type,
					merchantId
				);
				if (data.status !== 'success') {
					dispatchMessage({
						code: 'Add product failed',
						type: ActionTypeMessage.ADD_ERROR,
						duration: 3000,
					});
					return;
				}
				dispatch({
					type: ActionTypeProducts.EDIT_PRODUCT,
					id,
					product: {
						name: productName,
						description,
						price,
						type,
						id,
						merchantId,
					},
				});
				dispatchMessage({
					message: 'Add product succeeded',
					type: ActionTypeMessage.ADD_GENERIC_MESSAGE,
					typeMessage: MessageType.SUCCESS,
					duration: 3000,
				});
			} catch (err) {
				dispatchMessage({
					code: 'Edit product failed',
					type: ActionTypeMessage.ADD_ERROR,
					duration: 3000,
				});
			}
		},
		[]
	);

	const value = useMemo(
		() => ({ productStore, getProducts, addProduct, editProduct }),
		[productStore]
	);

	return (
		<ProductContext.Provider value={value}>
			{children}
		</ProductContext.Provider>
	);
};
