import { MessageType } from '../types';

export enum DisplayMode {
	BACKGROUND_COLOR,
	TEXT_COLOR,
}

export interface SnackBarProps {
	isVisible: boolean;
	onPress?: () => void;
	text: string;
	type: MessageType;
	mode: DisplayMode;
	colorStyle?: MessageType;
}
export type ContentMode = 'background' | 'text';