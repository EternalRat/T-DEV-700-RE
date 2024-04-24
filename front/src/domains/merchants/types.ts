import { ReducerType } from '../reducer';

enum MerchantType {
	ELECTRONICS,
	CLOTHINGS,
	FOODS,
	DRINKS,
	OTHERS,
}

export interface Merchant {
	id: number;
	name: string;
	description: string;
	price: number;
	merchantId: number;
	type: MerchantType;
}

export interface MerchantStore {
	merchantStore: Merchant[];
	getMerchants: (merchantId: number) => void;
}

export enum ActionTypeMerchants {
	GET_MERCHANTS = 'GET_MERCHANTS',
}

export interface GetMerchantsAction {
	merchants: Merchant[];
}

export type Action = {
	type: ActionTypeMerchants.GET_MERCHANTS;
} & GetMerchantsAction;

export type MerchantsReducer = ReducerType<
	ActionTypeMerchants,
	Action,
	Merchant[]
>;
