import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import {
	Camera,
	useCameraDevice,
	useCameraPermission,
	useCodeScanner,
} from 'react-native-vision-camera';

import { MessageContext, MessageStore } from '../domains/Message/Context';
import { ActionTypeMessage, MessageType } from '../domains/Message/types';
import { WebsocketContext } from '../domains/Websocket/Websocket';
import { RootStackParamList, Routes } from '../router/routesName';

export const QRSCanner = ({
	navigation,
}: NativeStackScreenProps<RootStackParamList, Routes.QRSCANNER>) => {
	const { metadata, sendMessage } = useContext(WebsocketContext);
	const { dispatch } = useContext<MessageStore>(MessageContext);
	const device = useCameraDevice('back');
	const { hasPermission, requestPermission } = useCameraPermission();
	const codeScanner = useCodeScanner({
		codeTypes: ['qr', 'ean-13'],
		onCodeScanned: codes => {
			const code = codes[0];
			const value = code.value;
			if (value) {
				const parsedValue = JSON.parse(value.replace(/'/gi, '"'));
				const cardNumber: string = parsedValue.hasOwnProperty(
					'cardNumber'
				)
					? parsedValue.cardNumber
					: undefined;
				const amount: number = parsedValue.hasOwnProperty('price')
					? parsedValue.price
					: undefined;
				if (cardNumber) {
					sendMessage('payment', {
						merchantId: metadata.merchantId,
						price: metadata.price,
						qrcode: cardNumber,
					});
					dispatch({
						type: ActionTypeMessage.ADD_GENERIC_MESSAGE,
						message: `Paiement en cours de ${amount}... Reprenez le client.`,
						typeMessage: MessageType.SUCCESS,
						duration: 3000,
					});
					navigation.navigate(Routes.HOME);
				}
			}
		},
	});

	useEffect(() => {
		if (!hasPermission) {
			requestPermission();
		}
	}, [hasPermission]);

	if (device == null || !hasPermission) return <></>;
	return (
		<Camera
			style={StyleSheet.absoluteFill}
			device={device}
			isActive={true}
			codeScanner={codeScanner}
			enableZoomGesture
		/>
	);
};
