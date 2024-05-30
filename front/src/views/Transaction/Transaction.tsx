import { DrawerScreenProps } from '@react-navigation/drawer';
import { useContext, useEffect } from 'react';
import { View } from 'react-native';

import { MessageContext, MessageStore } from '../../domains/Message/Context';
import { ActionTypeMessage, MessageType } from '../../domains/Message/types';
import { Title } from '../../domains/Templating/texts/Title';
import { WebsocketContext } from '../../domains/Websocket/Websocket';
import { RootStackParamList, Routes } from '../../router/routesName';

export const Transaction = ({
	navigation,
}: DrawerScreenProps<RootStackParamList, Routes.TRANSACTION>) => {
	const { awaitingPayment } = useContext(WebsocketContext);
	const { dispatch: dispatchMessage } =
		useContext<MessageStore>(MessageContext);

	useEffect(() => {
		if (!awaitingPayment) {
			dispatchMessage({
				typeMessage: MessageType.SUCCESS,
				type: ActionTypeMessage.ADD_GENERIC_MESSAGE,
				message: 'Paiement effectué. Redirection dans 3 secondes',
				duration: 3000,
			});
			setTimeout(() => {
				navigation.navigate(Routes.SHOP);
			}, 3000);
		}
	}, [awaitingPayment]);

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
				{awaitingPayment
					? 'En attente du paiement...'
					: 'Paiement effectué.'}
			</Title>
		</View>
	);
};
