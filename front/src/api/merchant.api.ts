import axios from 'axios';
import { API_URL } from '@env';

export const getAllMerchants = (merchantId: number) => {
	return axios.get(API_URL + '/merchant');
};
