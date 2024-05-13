export enum Routes {
	HOME = 'Home',
	NFC = 'NFC',
	QRSCANNER = 'QRScanner',
}

export type RootStackParamList = {
	[Routes.HOME]: undefined;
	[Routes.NFC]: undefined;
	[Routes.QRSCANNER]: undefined;
};
