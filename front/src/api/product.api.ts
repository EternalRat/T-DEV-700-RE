import axios from 'axios';
import { API_URL } from '@env';

export const getProductsByMerchantID = (merchantId: number) => {
	return axios.get(API_URL + '/product/merchant/' + merchantId);
};
