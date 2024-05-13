import { useCallback, useState } from 'react';

interface Auth {
	username: string;
	password: string;
	tpeId: string;
}

export const useSettings = () => {
	const [auth, setAuth] = useState<Auth>({
		username: '',
		password: '',
		tpeId: '',
	});

	const setUsername = useCallback((username: string) => {
		setAuth(oldState => {
			const newState: Auth = JSON.parse(JSON.stringify(oldState));
			newState.username = username;
			return newState;
		});
	}, []);

	const setPassword = useCallback((password: string) => {
		setAuth(oldState => {
			const newState: Auth = JSON.parse(JSON.stringify(oldState));
			newState.password = password;
			return newState;
		});
	}, []);

	const setTpeId = useCallback((tpeId: string) => {
		setAuth(oldState => {
			const newState: Auth = JSON.parse(JSON.stringify(oldState));
			newState.tpeId = tpeId;
			return newState;
		});
	}, []);

	return { auth, setUsername, setPassword, setTpeId };
};
