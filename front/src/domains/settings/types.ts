import { ReducerType } from '../reducer';

export interface Settings {
	id: number;
	property: string;
	value: number;
	merchantId: number;
}

export interface SettingsStore {
	settings: Settings[];
	getSettings: () => Promise<void>;
	updateSettings: (
		id: number,
		property: string,
		value: number
	) => Promise<void>;
}

export enum ActionTypeSettings {
	GET_SETTINGS = 'GET_SETTINGS',
	UPDATE_SETTINGS = 'UPDATE_SETTINGS',
}

export interface GetSettingsAction {
	settings: Settings[];
}

export interface UpdateSettingsAction {
	id: number;
	property: string;
	value: number;
}

export type Action =
	| ({
			type: ActionTypeSettings.GET_SETTINGS;
	  } & GetSettingsAction)
	| ({
			type: ActionTypeSettings.UPDATE_SETTINGS;
	  } & UpdateSettingsAction);

export type SettingsReducer = ReducerType<
	ActionTypeSettings,
	Action,
	Settings[]
>;
