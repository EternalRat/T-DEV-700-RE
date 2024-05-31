import { DrawerScreenProps } from '@react-navigation/drawer';
import { useContext, useEffect } from 'react';
import { View } from 'react-native';

import { MessageContext, MessageStore } from '../../domains/message/Context';
import { ActionTypeMessage, MessageType } from '../../domains/message/types';
import { WebsocketContext } from '../../domains/socket/Websocket';
import { Title } from '../../domains/templating/texts/Title';
import { RootStackParamList, Routes } from '../../router/routesName';

export const Transaction = ({
	navigation,
}: DrawerScreenProps<RootStackParamList, Routes.TRANSACTION>) => {
	const { paymentDetail } = useContext(WebsocketContext);
	const { dispatch: dispatchMessage } =
		useContext<MessageStore>(MessageContext);

	useEffect(() => {
		if (
			!paymentDetail.waiting &&
			!paymentDetail.error &&
			!paymentDetail.alreadyWaiting
		) {
			dispatchMessage({
				typeMessage: MessageType.SUCCESS,
				type: ActionTypeMessage.ADD_GENERIC_MESSAGE,
				message: 'Paiement effectué. Redirection dans 3 secondes',
				duration: 3000,
			});
			setTimeout(() => {
				navigation.navigate(Routes.SHOP);
			}, 3000);
		} else if (!paymentDetail.waiting && paymentDetail.error) {
			dispatchMessage({
				typeMessage: MessageType.ERROR,
				type: ActionTypeMessage.ADD_GENERIC_MESSAGE,
				message: 'Erreur lors du paiement',
				duration: 3000,
			});
			setTimeout(() => {
				navigation.navigate(Routes.CHECKOUT);
			}, 3000);
		} else if (!paymentDetail.waiting && paymentDetail.alreadyWaiting) {
			dispatchMessage({
				typeMessage: MessageType.ERROR,
				type: ActionTypeMessage.ADD_GENERIC_MESSAGE,
				message: 'Une autre transaction est déjà en cours',
				duration: 3000,
			});
			setTimeout(() => {
				navigation.navigate(Routes.CHECKOUT);
			}, 3000);
		}
	}, [paymentDetail]);

	return (
		<View
			style={{
				width: '100%',
				height: '100%',
				backgroundColor: '#444',
				justifyContent: 'center',
				alignItems: 'center',
				flex: 1,
			}}>
			<Title>
				{paymentDetail.waiting
					? 'En attente du paiement...'
					: !paymentDetail.error && !paymentDetail.alreadyWaiting
					? 'Paiement effectué.'
					: "Une erreur s'est produite."}
			</Title>
		</View>
	);
};
