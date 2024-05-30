import React, { Dispatch, ReactNode, useMemo, useReducer } from 'react';

import { reducer } from './reducer';
import { Action, MessageState, MessageType } from './types';

export interface MessageStore {
	message: MessageState;
	dispatch: Dispatch<Action>;
}
export const defaultState: MessageStore = {
	message: {
		message: '',
		type: MessageType.ERROR,
		duration: -1,
		colorStyle: MessageType.ERROR,
	},
	dispatch: () => null,
};

export const MessageContext = React.createContext<MessageStore>(defaultState);

export const MessageWrapper = ({ children }: { children: ReactNode }) => {
	const [message, dispatch] = useReducer(reducer, defaultState.message);

	const value = useMemo(
		() => ({
			message,
			dispatch,
		}),
		[
			message,
			// deletAsync,
			dispatch,
		]
	);
	return (
		<MessageContext.Provider value={value}>
			{children}
		</MessageContext.Provider>
	);
};
