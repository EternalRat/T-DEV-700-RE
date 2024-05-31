import { API_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { io, Socket } from 'socket.io-client';

import { Routes } from '../../router/routesName';
import { MessageContext, MessageStore } from '../message/Context';
import { ActionTypeMessage, MessageType } from '../message/types';
import { CartContext } from '../userCart/Cart';
import { CartStore } from '../userCart/types';

type TpeId = string;

export const WebsocketContext = createContext<{
	sendMessage: (_e: string, _: any) => void;
	paymentDetail: {
		waiting: boolean;
		error: boolean;
		alreadyWaiting: boolean;
	};
	tpeInformations: TpeId[];
}>({
	sendMessage: (_e: string, _: any) => {},
	paymentDetail: {
		waiting: false,
		error: false,
		alreadyWaiting: false,
	},
	tpeInformations: [],
});

export const WebsocketWrapper = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [paymentDetail, setPaymentDetail] = useState<{
		waiting: boolean;
		error: boolean;
		alreadyWaiting: boolean;
	}>({ waiting: false, error: false, alreadyWaiting: false });
	const { clearCart } = useContext<CartStore>(CartContext);
	const { dispatch: dispatchMessage } =
		useContext<MessageStore>(MessageContext);
	const [tpeInformations, setTpeInformations] = useState<TpeId[]>([]);
	const navigation = useNavigation();
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
				setPaymentDetail({
					waiting: false,
					error: false,
					alreadyWaiting: false,
				});
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
			setPaymentDetail({
				waiting: false,
				error: true,
				alreadyWaiting: false,
			});
		});

		socket.on('client-waiting', () => {
			console.info('client-waiting');
			dispatchMessage({
				type: ActionTypeMessage.ADD_ERROR,
				code: 'Un client attend déjà une validation de paiement',
				duration: 3000,
			});
			setPaymentDetail({
				waiting: false,
				error: false,
				alreadyWaiting: true,
			});
		});

		socket.on('tpe-disconnected', args => {
			console.info('tpe-disconnected');
			setTpeInformations(args.allTpe);
			navigation.navigate(Routes.SETTINGS as never);
			dispatchMessage({
				type: ActionTypeMessage.ADD_ERROR,
				code: "Le TPE s'est déconnecté",
				duration: 3000,
			});
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
				if (eventName === 'validate-payment') {
					setPaymentDetail({
						waiting: true,
						error: false,
						alreadyWaiting: false,
					});
				}
			}
		},
		[socket]
	);

	const value = useMemo(
		() => ({
			sendMessage,
			tpeInformations,
			paymentDetail,
		}),
		[tpeInformations, paymentDetail]
	);

	return (
		<WebsocketContext.Provider value={value}>
			{children}
		</WebsocketContext.Provider>
	);
};
