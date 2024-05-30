import { API_URL } from '@env';
import axios from 'axios';

export const getMerchantSettings = async () => {
	return await axios({
		method: 'get',
		url: API_URL + '/api/settings',
	});
};

export const updateMerchantSettings = async (
	id: number,
	property: string,
	value: number
) => {
	return await axios({
		method: 'patch',
		url: API_URL + '/api/settings',
		data: {
			settings: {
				id,
				property,
				value,
			},
		},
	});
};
