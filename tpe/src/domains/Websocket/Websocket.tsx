import {
	createContext,
	Dispatch,
	SetStateAction,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { API_URL } from '@env';
import { io, Socket } from 'socket.io-client';
import { ActionTypeMessage, MessageType } from '../Message/types';
import { Routes } from '../../router/routesName';
import { MessageContext, MessageStore } from '../Message/Context';

interface Metadata {
	price: number;
	merchantId: string;
}

export const WebsocketContext = createContext<{
	sendMessage: (eventName: string, _: any) => void;
	awaitingPayment: boolean;
	metadata: Metadata;
	screen: Routes;
	setScreen: Dispatch<SetStateAction<Routes>>;
}>({
	sendMessage: (eventName: string, _: any) => {},
	awaitingPayment: false,
	metadata: { price: 0, merchantId: '' },
	screen: Routes.HOME,
	setScreen: (value: SetStateAction<Routes>) => {},
});

export const WebsocketWrapper = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [screen, setScreen] = useState<Routes>(Routes.HOME);
	const [awaitingPayment, setAwaitingPayment] = useState<boolean>(false);
	const { dispatch: dispatchMessage } =
		useContext<MessageStore>(MessageContext);
	const [metadata, setMetadata] = useState<Metadata>({
		price: -1,
		merchantId: '',
	});
	const [socket, setSocket] = useState<Socket | null>();

	useEffect(() => {
		const ws = io('ws://' + API_URL, {
			transports: ['websocket'],
			autoConnect: true,
		});

		ws.connect();

		ws.on('connect', () => {
			console.log('connected');
			ws.emit('connect-tpe', {
				isMerchant: true,
				isWaiting: true,
			});
		});

		ws.on('connect_error', err => {
			console.log(`connect_error due to ${err.message}`);
		});

		ws.on('tpe-connected', () => {
			console.log('tpe-connected');
			dispatchMessage({
				message: 'Connexion établis',
				typeMessage: MessageType.SUCCESS,
				type: ActionTypeMessage.ADD_GENERIC_MESSAGE,
				duration: 3000,
			});
		});

		ws.on('client-connected', () => {
			console.log('new client connected');
		});

		ws.on('asking-payment', args => {
			console.log('asking-payment');
			setAwaitingPayment(false);
			console.log(args);
			setMetadata(args);
		});

		ws.on('disconnect', () => {
			console.log('disconnected');
		});

		setSocket(ws);

		return () => {
			ws.close();
		};
	}, []);

	const sendMessage = useCallback((eventName: string, message: any) => {
		if (socket) {
			socket.emit(eventName, message);
			if (eventName === 'payment') setAwaitingPayment(true);
		}
	}, [socket]);

	const value = useMemo(
		() => ({ sendMessage, awaitingPayment, metadata, screen, setScreen }),
		[awaitingPayment, metadata, screen]
	);

	return (
		<WebsocketContext.Provider value={value}>
			{children}
		</WebsocketContext.Provider>
	);
};
