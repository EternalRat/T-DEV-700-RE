import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useContext } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

import { WebsocketContext } from '../domains/Websocket/Websocket';
import { RootStackParamList, Routes } from '../router/routesName';

NfcManager.start();

export const NFC = ({
	navigation,
}: NativeStackScreenProps<RootStackParamList, Routes.NFC>) => {
	const { metadata, sendMessage } = useContext(WebsocketContext);

	const readNdef = useCallback(async () => {
		try {
			await NfcManager.requestTechnology(NfcTech.Ndef);
			const tag = await NfcManager.getTag();
			if (tag) {
				sendMessage('payment', {
					merchantId: metadata.merchantId,
					price: metadata.price,
					nfc: tag.id,
				});
				navigation.navigate(Routes.HOME);
			}
		} catch (ex) {
			console.warn('Oops!', ex);
		}
		NfcManager.cancelTechnologyRequest();
	}, []);

	return (
		<View>
			<TouchableOpacity onPress={readNdef}>
				<Text>Scan a Tag</Text>
			</TouchableOpacity>
		</View>
	);
};
