import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useContext, useEffect } from 'react';
import { Text, View } from 'react-native';
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

	useEffect(() => {
		try {
			NfcManager.requestTechnology(NfcTech.Ndef)
				.then(async () => {
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
				})
				.catch(_ => {});
		} catch {
			console.warn('Oops!');
		}
		NfcManager.cancelTechnologyRequest();
	}, []);

	return (
		<View
			style={{
				backgroundColor: '#333',
				height: '100%',
				width: '100%',
				padding: 16,
				gap: 16,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}>
			<Text
				style={{
					fontSize: 32,
					textAlign: 'center',
					fontWeight: 'bold',
				}}>
				En attente d'une carte...
			</Text>
		</View>
	);
};
