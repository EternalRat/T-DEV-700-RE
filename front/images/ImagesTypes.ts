import { File } from '@chouicgames/react-native-images-to-native-images/src/types';

export enum Files {
	key,
	user,
	back,
	hamburger,
	add,
}

export type FilesInfos = {
	[key: string]: File;
};
