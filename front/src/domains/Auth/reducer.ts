import {
	Action,
	AuthAction,
	AuthedUser,
	AuthReducer,
	FillUserAction,
} from './types';

const configReducer: AuthReducer = {
	[AuthAction.FILL_USER]: (_: AuthedUser, action: Action) => {
		return (action as FillUserAction).user;
	},
	[AuthAction.LOGOUT]: (_s: AuthedUser, _a: Action) => {
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
