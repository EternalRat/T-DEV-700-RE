import { API_URL } from '@env';
import axios from 'axios';

export const loginAPI = async (username: string, password: string) => {
	return await axios({
		method: 'post',
		url: 'http://' + API_URL + '/api/auth/login',
		data: { username: username, password: password },
	});
};

export const loginHealth = async () => {
	return await axios({
		method: 'get',
		url: 'http://' + API_URL + '/api/auth',
	});
};
