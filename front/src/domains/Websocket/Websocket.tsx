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
import { MessageStore, MessageContext } from '../message/Context';
import { ActionTypeMessage, MessageType } from '../message/types';

export const WebsocketContext = createContext<{
	sendMessage: (_: string) => void;
}>({
	sendMessage: (_: string) => {},
});

export const WebsocketWrapper = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [awaitingPayment, setAwaitingPayment] = useState<boolean>(false);
	const [socket, setSocket] = useState<Socket<any, any> | null>(null);
	const { clearCart } = useContext<CartStore>(CartContext);
	const { dispatch: dispatchMessage } =
		useContext<MessageStore>(MessageContext);

	useEffect(() => {
		const ws = io('ws://localhost:8080');
		ws.connect();
		ws.on('connect', () => {
			console.log('connected');
		});

		ws.on('paiement', event => {
			if (event === 'success') {
				clearCart();
				setAwaitingPayment(false);
				dispatchMessage({
					message: 'Paiement effectué',
					typeMessage: MessageType.SUCCESS,
					type: ActionTypeMessage.ADD_GENERIC_MESSAGE,
				});
			} else {
				dispatchMessage({
					type: ActionTypeMessage.ADD_ERROR,
					code: 'PAIEMENT_FAILED',
				});
			}
		});

		ws.on('disconnect', () => {
			console.log('disconnected');
		});

		setSocket(ws);

		return () => {
			ws.close();
		};
	}, []);

	const sendMessage = useCallback(
		(message: string) => {
			if (socket) {
				socket.send(message);
				setAwaitingPayment(true);
			}
		},
		[socket]
	);

	const value = useMemo(() => ({ sendMessage, awaitingPayment }), []);

	return (
		<WebsocketContext.Provider value={value}>
			{children}
		</WebsocketContext.Provider>
	);
};
