import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useReducer,
} from 'react';
import { AuthAction, AuthStore } from './types';
import { reducer } from './reducer';
import { MessageContext, MessageStore } from '../Message/Context';
import { loginAPI, loginHealth } from '../../api/auth.api';
import { ActionTypeMessage, MessageType } from '../Message/types';
import { ProductStore } from '../Products/types';
import { ProductContext } from '../Products/Products';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList, Routes } from '../../router/routesName';
import { WebsocketContext } from '../Websocket/Websocket';

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
				const response = await loginAPI(username, password);
				const { status, data } = response;
				if (status === 200) {
					const { user } = data;
					console.log(user);
					sendMessage('connect-client', {
						isUser: true,
						merchantId: user.id,
						tpeId,
					});
					await getProducts(user.id, navigation);
					console.log('success getProducts')
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
				console.log(err)
				dispatchMessage({
					type: ActionTypeMessage.ADD_ERROR,
					code: 'LOGIN_FAILED ' + err.message,
					duration: 3000,
				});
			}
		},
		[]
	);

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
		}),
		[loggedUser]
	);

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};
