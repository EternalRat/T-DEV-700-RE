import { API_URL } from '@env';
import axios from 'axios';

import { ProductType } from '../domains/product/types';

export const getProductsByMerchantID = async (merchantId: number) => {
	return await axios({
		method: 'get',
		url: API_URL + '/api/product/merchant/' + merchantId,
	});
};

export const createProduct = async (
	productName: string,
	description: string,
	price: number,
	type: ProductType,
	merchantId: number
) => {
	return await axios({
		method: 'post',
		url: API_URL + '/api/product',
		data: {
			name: productName,
			description,
			price,
			type,
			merchantId,
		},
	});
};

export const updateProduct = async (
	id: number,
	productName: string,
	description: string,
	price: number,
	type: ProductType,
	merchantId: number
) => {
	return await axios({
		method: 'put',
		url: API_URL + '/api/product/' + id,
		data: {
			name: productName,
			description,
			price,
			type,
			merchantId,
		},
	});
};
