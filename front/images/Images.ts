import {
	AndroidFileType,
	IosFileType,
} from '@chouicgames/react-native-images-to-native-images/src/types';

import { Files, FilesInfos } from './ImagesTypes';

export const appName: string = 'cash_manager'; // <------ change to your app name (in YourProject/ios/YourAppName)

export const Images: FilesInfos = {
	[Files.key]: {
		path: './files/key.svg',
		source: { uri: 'key' },
		android: { type: AndroidFileType.Vector },
		ios: { type: IosFileType.Pdf },
	},
	[Files.user]: {
		path: './files/user.svg',
		source: { uri: 'user' },
		android: { type: AndroidFileType.Vector },
		ios: { type: IosFileType.Pdf },
	},
	[Files.back]: {
		path: './files/back.svg',
		source: { uri: 'back' },
		android: { type: AndroidFileType.Vector },
		ios: { type: IosFileType.Pdf },
	},
	[Files.hamburger]: {
		path: './files/hamburger.svg',
		source: { uri: 'hamburger' },
		android: { type: AndroidFileType.Vector },
		ios: { type: IosFileType.Pdf },
	},
};

export default Images;

export { Files };
