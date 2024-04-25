import { useCallback, useState } from 'react';

interface Auth {
	username: string;
	password: string;
}

export const useSettings = () => {
	const [auth, setAuth] = useState<Auth>({
		username: '',
		password: '',
	});

	const setUsername = useCallback((username: string) => {
		setAuth(oldState => {
			const newState = JSON.parse(JSON.stringify(oldState));
			newState.username = username;
			return newState;
		});
	}, []);

	const setPassword = useCallback((password: string) => {
		setAuth(oldState => {
			const newState = JSON.parse(JSON.stringify(oldState));
			newState.password = password;
			return newState;
		});
	}, []);

	return { auth, setUsername, setPassword };
};
