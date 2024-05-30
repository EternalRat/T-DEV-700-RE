import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useReducer,
} from 'react';

import {
	getMerchantSettings,
	updateMerchantSettings,
} from '../../api/settings.api';
import { MessageContext, MessageStore } from '../message/Context';
import { ActionTypeMessage } from '../message/types';
import { reducer } from './reducer';
import { ActionTypeSettings, SettingsStore } from './types';

const defaultSettingsStore: SettingsStore = {
	settings: [],
	getSettings: () => Promise.resolve(),
	updateSettings: (_: number, __: string, ___: number) => Promise.resolve(),
};

export const SettingsContext =
	createContext<SettingsStore>(defaultSettingsStore);

export const SettingsWrapper = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [settings, dispatch] = useReducer(
		reducer,
		defaultSettingsStore.settings
	);
	const { dispatch: dispatchMessage } =
		useContext<MessageStore>(MessageContext);

	const getSettings = useCallback(async () => {
		try {
			const response = await getMerchantSettings();
			const { data } = response;
			dispatch({ type: ActionTypeSettings.GET_SETTINGS, settings: data });
		} catch {
			dispatchMessage({
				type: ActionTypeMessage.ADD_ERROR,
				code: 'Get settings failed',
				duration: 3000,
			});
		}
	}, []);

	const updateSettings = useCallback(
		async (id: number, property: string, value: number) => {
			try {
				await updateMerchantSettings(id, property, value);
				dispatch({
					type: ActionTypeSettings.UPDATE_SETTINGS,
					id,
					property,
					value,
				});
			} catch {
				dispatchMessage({
					type: ActionTypeMessage.ADD_ERROR,
					code: 'Update settings failed',
					duration: 3000,
				});
			}
		},
		[]
	);

	const value = useMemo(
		() => ({ settings, getSettings, updateSettings }),
		[settings]
	);

	return (
		<SettingsContext.Provider value={value}>
			{children}
		</SettingsContext.Provider>
	);
};
