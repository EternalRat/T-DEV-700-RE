import {
	Action,
	ActionTypeMerchants,
	GetMerchantsAction,
	Merchant,
	MerchantsReducer,
} from './types';

const configReducer: MerchantsReducer = {
	[ActionTypeMerchants.GET_MERCHANTS]: (state: Merchant[], action: Action) =>
		(action as GetMerchantsAction).merchants,
};

export const reducer = (state: Merchant[], action: Action): Merchant[] => {
	try {
		return configReducer[action.type](state, action);
	} catch (error) {
		console.error('reducer:error', error);
		return state;
	}
};
