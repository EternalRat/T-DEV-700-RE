import { API_URL } from '@env';
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { io, Socket } from 'socket.io-client';

import { CartContext } from '../Cart/Cart';
import { CartStore } from '../Cart/types';
import { MessageContext, MessageStore } from '../Messages/Context';
import { ActionTypeMessage, MessageType } from '../Messages/types';

type TpeId = string;

export const WebsocketContext = createContext<{
	sendMessage: (_e: string, _: any) => void;
	awaitingPayment: boolean;
	tpeInformations: TpeId[];
}>({
	sendMessage: (_e: string, _: any) => {},
	awaitingPayment: false,
	tpeInformations: [],
});

export const WebsocketWrapper = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [awaitingPayment, setAwaitingPayment] = useState<boolean>(false);
	const { clearCart } = useContext<CartStore>(CartContext);
	const { dispatch: dispatchMessage } =
		useContext<MessageStore>(MessageContext);
	const [tpeInformations, setTpeInformations] = useState<TpeId[]>([]);
	const socket = useMemo<Socket>(
		() =>
			io(API_URL, {
				transports: ['websocket'],
				autoConnect: false,
			}),
		[]
	);

	useEffect(() => {
		socket.connect();

		socket.on('connect', () => {
			console.info('connected');
			socket.emit('link-client');
		});

		socket.on('connect_error', err => {
			console.error(`connect_error due to ${err.message}`);
		});

		socket.on('payment-client', data => {
			console.info('payment-client');
			if (data.status === 'success') {
				clearCart();
				setAwaitingPayment(false);
				dispatchMessage({
					message: 'Paiement effectué',
					typeMessage: MessageType.SUCCESS,
					type: ActionTypeMessage.ADD_GENERIC_MESSAGE,
					duration: 3000,
				});
			} else {
				dispatchMessage({
					type: ActionTypeMessage.ADD_ERROR,
					code: data.message,
					duration: 3000,
				});
			}
		});

		socket.on('new-tpe', args => {
			console.info('new-tpe', args);
			setTpeInformations(args.allTpe);
		});

		socket.on('client-connected', () => {
			console.info('client-connected');
			dispatchMessage({
				message: 'Connexion au TPE réussit',
				typeMessage: MessageType.SUCCESS,
				type: ActionTypeMessage.ADD_GENERIC_MESSAGE,
				duration: 3000,
			});
		});

		socket.on('payment-error', () => {
			console.error('payment-error');
			dispatchMessage({
				type: ActionTypeMessage.ADD_ERROR,
				code: 'La validation du paiement a échoué',
				duration: 3000,
			});
			setAwaitingPayment(false);
		});

		socket.on('client-waiting', () => {
			console.info('client-waiting');
			dispatchMessage({
				type: ActionTypeMessage.ADD_ERROR,
				code: 'Un client attend déjà une validation de paiement',
				duration: 3000,
			});
			setAwaitingPayment(false);
		});

		socket.on('payment-validated', () => {
			console.info('payment-validated');
			dispatchMessage({
				message: 'Dirigez-vous vers le TPE.',
				typeMessage: MessageType.SUCCESS,
				type: ActionTypeMessage.ADD_GENERIC_MESSAGE,
				duration: 3000,
			});
		});

		socket.on('disconnect', () => {
			console.info('disconnected');
		});

		return () => {
			socket.close();
		};
	}, []);

	const sendMessage = useCallback(
		(eventName: string, message: any) => {
			if (socket) {
				socket.emit(eventName, message);
				if (eventName === 'validate-payment') setAwaitingPayment(true);
			}
		},
		[socket]
	);

	const value = useMemo(
		() => ({ sendMessage, awaitingPayment, tpeInformations }),
		[tpeInformations, awaitingPayment]
	);

	return (
		<WebsocketContext.Provider value={value}>
			{children}
		</WebsocketContext.Provider>
	);
};
