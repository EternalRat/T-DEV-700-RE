import axios from 'axios';
import { API_URL } from '@env';

export const getProductsByMerchantID = async (merchantId: number) => {
	console.log('http://' + API_URL + '/api/product/merchant/' + merchantId);
	return await axios({
		method: 'get',
		url: 'http://' + API_URL + '/api/product/merchant/' + merchantId,
	});
};
