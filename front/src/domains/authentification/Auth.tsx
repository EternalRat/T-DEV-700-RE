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
import { MessageContext, MessageStore } from '../message/Context';
import { ActionTypeMessage, MessageType } from '../message/types';
import { ProductContext } from '../product/Products';
import { ProductStore } from '../product/types';
import { SettingsContext } from '../settings/Settings';
import { SettingsStore } from '../settings/types';
import { WebsocketContext } from '../socket/Websocket';
import { reducer } from './reducer';
import { AuthAction, AuthStore } from './types';

export const defaultAuth: AuthStore = {
	loggedUser: { id: -1, name: '', tpeId: '' },
	login: (
		_: string,
		_p: string,
		_t: string,
		_n: DrawerNavigationProp<RootStackParamList, Routes.SETTINGS, undefined>
	) => Promise.resolve(),
	logout: () => {},
	health: (_n: DrawerNavigationProp<RootStackParamList, Routes>) => {},
	accessPanelAdmin: (_: string) => Promise.resolve(false),
	updateTPE: (_: string) => {},
};

export const AuthContext = createContext<AuthStore>(defaultAuth);

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
	const [loggedUser, dispatch] = useReducer(reducer, defaultAuth.loggedUser);
	const { dispatch: dispatchMessage } =
		useContext<MessageStore>(MessageContext);
	const { getProducts } = useContext<ProductStore>(ProductContext);
	const { sendMessage } = useContext(WebsocketContext);
	const { getSettings } = useContext<SettingsStore>(SettingsContext);

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
					await getSettings();
					dispatch({ type: AuthAction.FILL_USER, user, tpeId });
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
		(navigation: DrawerNavigationProp<RootStackParamList, Routes>) => {
			loginHealth()
				.then(res => {
					const { status, data } = res;
					if (status === 200) {
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
		[loggedUser]
	);

	const updateTPE = useCallback((tpeId: string) => {
		dispatch({ type: AuthAction.UPDATE_TPE, tpeId });
	}, []);

	const value = useMemo(
		() => ({
			loggedUser,
			login,
			logout,
			health,
			accessPanelAdmin,
			updateTPE,
		}),
		[loggedUser]
	);

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};
