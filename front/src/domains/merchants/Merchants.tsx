import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useReducer,
} from 'react';
import { ActionTypeMerchants, MerchantStore } from './types';
import { reducer } from './reducer';
import { getAllMerchants } from '../../api/merchant.api';
import { MessageContext, MessageStore } from '../message/Context';
import { ActionTypeMessage } from '../message/types';

const defaultMerchantStore: MerchantStore = {
	merchantStore: [],
	getMerchants: async (_: number) => {},
};

export const MerchantContext = createContext<MerchantStore>(defaultMerchantStore);

export const MerchantWrapper = ({ children }: { children: React.ReactNode }) => {
	const [merchantStore, dispatch] = useReducer(
		reducer,
		defaultMerchantStore.merchantStore
	);
	const { dispatch: dispatchMessage } =
		useContext<MessageStore>(MessageContext);

	const getMerchants = useCallback((merchantId: number) => {
		getAllMerchants(merchantId)
			.then(response => {
				const { data } = response;
				const { status, data: dataContainer } = data;
				if (status !== 'success') {
					dispatchMessage({
						code: 'GET_MERCHANTS_FAILED',
						type: ActionTypeMessage.ADD_ERROR,
						duration: 3000,
					});
					return;
				}
				dispatch({
					type: ActionTypeMerchants.GET_MERCHANTS,
					merchants: dataContainer,
				});
			})
			.catch(err => {});
	}, []);

	const value = useMemo(
		() => ({ merchantStore, getMerchants }),
		[merchantStore]
	);

	return (
		<MerchantContext.Provider value={value}>
			{children}
		</MerchantContext.Provider>
	);
};
