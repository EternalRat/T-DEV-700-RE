import axios from 'axios';
import { API_URL } from '@env';

export const getProductsByMerchantID = (merchantId: number) => {
	return axios.get(
		'http://' + API_URL + '/api/product/merchant/' + merchantId
	);
};
