import { DrawerNavigationProp } from '@react-navigation/drawer';
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useReducer,
} from 'react';

import { loginAPI, loginHealth, panelAdmin } from '../../api/auth.api';
import { RootStackParamList, Routes } from '../../router/routesName';
import { MessageContext, MessageStore } from '../Messages/Context';
import { ActionTypeMessage, MessageType } from '../Messages/types';
import { ProductContext } from '../Products/Products';
import { ProductStore } from '../Products/types';
import { WebsocketContext } from '../Websocket/Websocket';
import { reducer } from './reducer';
import { AuthAction, AuthStore } from './types';

export const defaultAuth: AuthStore = {
	loggedUser: { id: -1, name: '' },
	login: (
		_: string,
		_p: string,
		_t: string,
		_n: DrawerNavigationProp<RootStackParamList, Routes.SETTINGS, undefined>
	) => Promise.resolve(),
	logout: () => {},
	health: (
		_n: DrawerNavigationProp<RootStackParamList, Routes.SETTINGS, undefined>
	) => {},
	accessPanelAdmin: (_: string) => Promise.resolve(false),
};

export const AuthContext = createContext<AuthStore>(defaultAuth);

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
	const [loggedUser, dispatch] = useReducer(reducer, defaultAuth.loggedUser);
	const { dispatch: dispatchMessage } =
		useContext<MessageStore>(MessageContext);
	const { getProducts } = useContext<ProductStore>(ProductContext);
	const { sendMessage } = useContext(WebsocketContext);

	const login = useCallback(
		async (
			username: string,
			password: string,
			tpeId: string,
			navigation: DrawerNavigationProp<
				RootStackParamList,
				Routes.SETTINGS,
				undefined
			>
		) => {
			try {
				const { status, data } = await loginAPI(username, password);
				if (status === 200) {
					const { user } = data;
					sendMessage('connect-client', {
						isUser: true,
						merchantId: user.id,
						tpeId,
					});
					await getProducts(user.id, navigation);
					dispatch({ type: AuthAction.FILL_USER, user });
					dispatchMessage({
						type: ActionTypeMessage.ADD_GENERIC_MESSAGE,
						message: 'Vous êtes connectés',
						typeMessage: MessageType.SUCCESS,
						duration: 3000,
					});
					return;
				}
				dispatchMessage({
					type: ActionTypeMessage.ADD_ERROR,
					code: 'LOGIN_FAILED ' + data.message,
					duration: 3000,
				});
			} catch (err: any) {
				console.error(err);
				dispatchMessage({
					type: ActionTypeMessage.ADD_ERROR,
					code: 'LOGIN_FAILED ' + err.message,
					duration: 3000,
				});
			}
		},
		[]
	);

	const accessPanelAdmin = useCallback(async (secretPassword: string) => {
		try {
			const { status } = await panelAdmin(secretPassword);
			if (status === 200) {
				return true;
			}
			return false;
		} catch (err) {
			return false;
		}
	}, []);

	const logout = useCallback(() => {
		dispatch({ type: AuthAction.LOGOUT });
		localStorage.removeItem('token');
	}, []);

	const health = useCallback(
		(
			navigation: DrawerNavigationProp<
				RootStackParamList,
				Routes.SETTINGS,
				undefined
			>
		) => {
			loginHealth()
				.then(res => {
					const { status, data } = res;
					if (status === 200) {
						const { user } = data;
						dispatch({ type: AuthAction.FILL_USER, user });
						return;
					}
					dispatchMessage({
						type: ActionTypeMessage.ADD_ERROR,
						code: 'LOGIN_FAILED ' + data.message,
						duration: 3000,
					});
					navigation.navigate(Routes.SETTINGS);
				})
				.catch(err => {
					dispatchMessage({
						type: ActionTypeMessage.ADD_ERROR,
						code: 'LOGIN_FAILED ' + err.message,
						duration: 3000,
					});
					navigation.navigate(Routes.SETTINGS);
				});
		},
		[]
	);

	const value = useMemo(
		() => ({
			loggedUser,
			login,
			logout,
			health,
			accessPanelAdmin,
		}),
		[loggedUser]
	);

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};
