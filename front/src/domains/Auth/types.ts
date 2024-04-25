import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList, Routes } from '../../router/routesName';
import { ReducerType } from '../reducer';

export interface AuthedUser {
	id: number;
	name: string;
}

export interface AuthStore {
	loggedUser: AuthedUser;
	login: (
		username: string,
		password: string,
		navigation: DrawerNavigationProp<
			RootStackParamList,
			Routes.SETTINGS,
			undefined
		>
	) => void;
	logout: () => void;
}

export enum AuthAction {
	FILL_USER = 'FILL_USER',
	LOGOUT = 'LOGOUT',
}

export interface FillUserAction {
	user: AuthedUser;
}

export type Action =
	| ({
			type: AuthAction.FILL_USER;
	  } & FillUserAction)
	| {
			type: AuthAction.LOGOUT;
	  };

export type AuthReducer = ReducerType<AuthAction, Action, AuthedUser>;
