import {
	Action,
	AuthAction,
	AuthedUser,
	AuthReducer,
	FillUserAction,
} from './types';

const configReducer: AuthReducer = {
	[AuthAction.FILL_USER]: (state: AuthedUser, action: Action) => {
		return (action as FillUserAction).user;
	},
	[AuthAction.LOGOUT]: (state: AuthedUser, action: Action) => {
		return { id: -1, name: '' };
	},
};

export const reducer = (state: AuthedUser, action: Action): AuthedUser => {
	try {
		return configReducer[action.type](state, action);
	} catch (error) {
		console.error('reducer:error', error);
		return state;
	}
};
