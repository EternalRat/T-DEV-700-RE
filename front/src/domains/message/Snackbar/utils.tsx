import { MessageType } from '../types';
import { ContentMode, DisplayMode } from './type';

export const configStyle: Record<DisplayMode, Record<ContentMode, any>> = {
	[DisplayMode.TEXT_COLOR]: {
		background: (color: string) => ({
			backgroundColor: '#000',
			borderColor: color,
			borderWidth: 2,
		}),
		text: (color: string) => ({
			color,
		}),
	},
	[DisplayMode.BACKGROUND_COLOR]: {
		background: (color: string) => ({
			backgroundColor: color,
		}),
		text: () => ({
			color: '#fff',
		}),
	},
};

export const getColorStyle = (style?: MessageType) => {
	if (style === MessageType.ERROR) {
		return '#ff8c8c';
	}
	if (style === MessageType.SUCCESS) {
		return 'palegreen';
	}
	return '#AAABB5';
};
