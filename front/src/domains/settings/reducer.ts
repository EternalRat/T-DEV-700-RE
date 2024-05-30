import {
	Action,
	ActionTypeSettings,
	GetSettingsAction,
	Settings,
	SettingsReducer,
	UpdateSettingsAction,
} from './types';

const configReducer: SettingsReducer = {
	[ActionTypeSettings.GET_SETTINGS]: (state: Settings[], action: Action) =>
		(action as GetSettingsAction).settings,
	[ActionTypeSettings.UPDATE_SETTINGS]: (
		state: Settings[],
		action: Action
	) => {
		const oldState = state.slice();
		const settingIndex = oldState.findIndex(
			setting => setting.id === (action as UpdateSettingsAction).id
		);
		const newSetting = {
			...oldState[settingIndex],
			...(action as UpdateSettingsAction),
		};
		oldState[settingIndex] = newSetting;
		return oldState;
	},
};

export const reducer = (state: Settings[], action: Action): Settings[] => {
	try {
		return configReducer[action.type](state, action);
	} catch (error) {
		console.error('reducer:error', error);
		return state;
	}
};
