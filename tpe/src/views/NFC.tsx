import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useContext } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

import { MessageContext, MessageStore } from '../domains/Message/Context';
import { ActionTypeMessage, MessageType } from '../domains/Message/types';
import { WebsocketContext } from '../domains/Websocket/Websocket';
import { RootStackParamList, Routes } from '../router/routesName';

NfcManager.start();

export const NFC = ({
	navigation,
}: NativeStackScreenProps<RootStackParamList, Routes.NFC>) => {
	const { metadata, sendMessage } = useContext(WebsocketContext);
	const { dispatch } = useContext<MessageStore>(MessageContext);

	const readNdef = useCallback(async () => {
		try {
			await NfcManager.requestTechnology(NfcTech.Ndef);
			const tag = await NfcManager.getTag();
			if (tag) {
				dispatch({
					type: ActionTypeMessage.ADD_GENERIC_MESSAGE,
					message: `Paiement en cours de ${metadata.price}€... Reprenez le client.`,
					typeMessage: MessageType.SUCCESS,
					duration: 3000,
				});
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
