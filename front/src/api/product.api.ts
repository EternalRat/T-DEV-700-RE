import axios from 'axios';
import { API_URL } from '@env';

export const getProductsByMerchantID = async (merchantId: number) => {
	return await axios({
		method: 'get',
		url: API_URL + '/api/product/merchant/' + merchantId,
	});
};
