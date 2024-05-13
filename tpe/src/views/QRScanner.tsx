import { useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import {
	Camera,
	useCameraDevice,
	useCameraPermission,
	useCodeScanner,
} from 'react-native-vision-camera';
import { WebsocketContext } from '../domains/Websocket/Websocket';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../router/routesName';

export const QRSCanner = ({
	navigation,
}: NativeStackScreenProps<RootStackParamList, Routes.QRSCANNER>) => {
	const { metadata, sendMessage } = useContext(WebsocketContext);
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
				if (cardNumber) {
					sendMessage('payment', {
						merchantId: metadata.merchantId,
						price: metadata.price,
						qrcode: cardNumber,
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
