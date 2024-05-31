import {
	Action,
	AuthAction,
	AuthedUser,
	AuthReducer,
	FillUserAction,
	UpdateTpeAction,
} from './types';

const configReducer: AuthReducer = {
	[AuthAction.FILL_USER]: (_: AuthedUser, action: Action) => {
		return {
			...(action as FillUserAction).user,
			tpeId: (action as FillUserAction).tpeId,
		};
	},
	[AuthAction.LOGOUT]: (_s: AuthedUser, _a: Action) => {
		return { id: -1, name: '', tpeId: '' };
	},
	[AuthAction.UPDATE_TPE]: (state: AuthedUser, action: Action) => {
		const newState = JSON.parse(JSON.stringify(state)) as AuthedUser;
		newState.tpeId = (action as UpdateTpeAction).tpeId;
		return newState;
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
