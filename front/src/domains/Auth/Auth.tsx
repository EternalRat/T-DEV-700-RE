import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useReducer,
} from 'react';
import { AuthAction, AuthStore } from './types';
import { reducer } from './reducer';
import { MessageContext, MessageStore } from '../message/Context';
import { loginAPI } from '../../api/auth.api';
import { ActionTypeMessage, MessageType } from '../message/types';
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
		_n: DrawerNavigationProp<RootStackParamList, Routes.SETTINGS, undefined>
	) => {},
	logout: () => {},
};

export const AuthContext = createContext<AuthStore>(defaultAuth);

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
	const [loggedUser, dispatch] = useReducer(reducer, defaultAuth.loggedUser);
	const { dispatch: dispatchMessage } =
		useContext<MessageStore>(MessageContext);
	const { getProducts } = useContext<ProductStore>(ProductContext);
	const { sendMessage } = useContext(WebsocketContext);

	const login = useCallback(
		(
			username: string,
			password: string,
			navigation: DrawerNavigationProp<
				RootStackParamList,
				Routes.SETTINGS,
				undefined
			>
		) => {
			loginAPI(username, password)
				.then(res => {
					const { status, data } = res;
					if (status === 200) {
						const { user } = data;
						localStorage.setItem('token', user.token);
						dispatch({ type: AuthAction.FILL_USER, user });
						dispatchMessage({
							type: ActionTypeMessage.ADD_GENERIC_MESSAGE,
							message: 'Vous êtes connectés',
							typeMessage: MessageType.SUCCESS,
						});
						getProducts(user.id, navigation);
						sendMessage('connect-client', {
							isUser: true,
							merchantId: user.id,
						});
						return;
					}
					dispatchMessage({
						type: ActionTypeMessage.ADD_ERROR,
						code: 'LOGIN_FAILED ' + data.message,
					});
				})
				.catch(err => {
					dispatchMessage({
						type: ActionTypeMessage.ADD_ERROR,
						code: 'LOGIN_FAILED ' + err.message,
					});
				});
		},
		[]
	);

	const logout = useCallback(() => {
		dispatch({ type: AuthAction.LOGOUT });
		localStorage.removeItem('token');
	}, []);

	const value = useMemo(
		() => ({
			loggedUser,
			login,
			logout,
		}),
		[loggedUser]
	);

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};
