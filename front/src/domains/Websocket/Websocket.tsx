import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { API_URL } from '@env';
import { io, Socket } from 'socket.io-client';
import { CartContext } from '../Cart/Cart';
import { CartStore } from '../Cart/types';
import { MessageContext, MessageStore } from '../Message/Context';
import { ActionTypeMessage, MessageType } from '../Message/types';

type TpeId = string;

export const WebsocketContext = createContext<{
	sendMessage: (eventName: string, _: any) => void;
	awaitingPayment: boolean;
	tpeInformations: TpeId[];
}>({
	sendMessage: (eventName: string, _: any) => {},
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
			console.log('connected');
			socket.emit('link-client');
		});

		socket.on('connect_error', err => {
			console.log(`connect_error due to ${err.message}`);
		});

		socket.on('payment-client', data => {
			console.log('payment-client');
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
			console.log('new-tpe', args);
			setTpeInformations(args.allTpe);
		});

		socket.on('client-connected', () => {
			console.log('client-connected');
			dispatchMessage({
				message: 'Connexion au TPE réussit',
				typeMessage: MessageType.SUCCESS,
				type: ActionTypeMessage.ADD_GENERIC_MESSAGE,
				duration: 3000,
			});
		});

		socket.on('payment-error', () => {
			console.log('payment-error');
			dispatchMessage({
				type: ActionTypeMessage.ADD_ERROR,
				code: 'La validation du paiement a échoué',
				duration: 3000,
			});
			setAwaitingPayment(false);
		});

		socket.on('payment-validated', () => {
			console.log('payment-validated');
			dispatchMessage({
				message: 'Dirigez-vous vers le TPE.',
				typeMessage: MessageType.SUCCESS,
				type: ActionTypeMessage.ADD_GENERIC_MESSAGE,
				duration: 3000,
			});
		});

		socket.on('disconnect', () => {
			console.log('disconnected');
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
