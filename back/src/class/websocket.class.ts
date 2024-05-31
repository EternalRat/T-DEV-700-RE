import http from 'http';
import { Server } from 'socket.io';

import CMUser from './user.class';

/**
 * Client interface
 * @interface
 * @property {boolean} isMerchant - Is the client a merchant
 * @property {boolean} isUser - Is the client a user
 * @property {number} merchantId - The merchant ID
 * @property {boolean} isWaiting - Is the client waiting for a payment
 * @property {string} tpeId - The TPE ID
 * @default
 * {
 * isMerchant: false,
 * isUser: false,
 * merchantId: undefined,
 * isWaiting: undefined,
 * tpeId: undefined,
 * }
 * @example
 * const client: IClient = {
 * isMerchant: true,
 * isUser: false,
 * merchantId: 1,
 * isWaiting: false,
 * tpeId: 'tpe1',
 * };
 * @return {IClient} Client interface
 */
interface IClient {
	isMerchant: boolean;
	isUser: boolean;
	merchantId?: number;
	isWaiting?: boolean;
	tpeId?: string;
}

const DEFAULT_CLIENT: IClient = {
	isMerchant: false,
	isUser: false,
	merchantId: undefined,
	isWaiting: undefined,
	tpeId: undefined,
};

export default class CMWebSocket {
	static instance: CMWebSocket;
	private _io: Server;
	private _clients: Record<string, IClient> = {};

	private constructor(
		app: http.Server<
			typeof http.IncomingMessage,
			typeof http.ServerResponse
		>
	) {
		this._io = new Server(app);
		this._io.on('connection', socket => {
			console.info('New client connected');
			console.info(socket.id);
			this._clients[socket.id] = DEFAULT_CLIENT;
			socket.on('disconnect', () => {
				console.info('Client disconnected');
				if (this._clients[socket.id].isMerchant) {
					const tpes = [];
					for (const [id, client] of Object.entries(this._clients)) {
						if (client.isMerchant && id !== socket.id) {
							tpes.push(id);
						}
					}
					for (const [id, client] of Object.entries(this._clients)) {
						if (client.isUser && client.tpeId === socket.id) {
							this._clients[id].tpeId = undefined;
							socket
								.to(id)
								.emit('tpe-disconnected', { allTpe: tpes });
						}
					}
				}
				socket.leave('tpe');
				socket.leave('client');
				delete this._clients[socket.id];
			});

			socket.on('connect-tpe', args => {
				console.info('TPE connected', args);
				this._clients[socket.id] = {
					...this._clients[socket.id],
					...args,
				};
				socket.emit('tpe-connected');
				socket.join('tpe');
				const tpes = [];
				for (const [id, client] of Object.entries(this._clients)) {
					if (client.isMerchant) {
						tpes.push(id);
					}
				}
				socket.to('client').emit('new-tpe', { allTpe: tpes });
			});

			socket.on('connect-client', args => {
				console.info('Client connected', args);
				this._clients[socket.id] = {
					...this._clients[socket.id],
					...args,
				};
				socket.to(args.tpeId).emit('client-connected', args);
			});

			socket.on('link-client', _ => {
				console.info('Client linked');
				const tpes = [];
				for (const [id, client] of Object.entries(this._clients)) {
					if (client.isMerchant) {
						tpes.push(id);
					}
				}
				socket.emit('new-tpe', { allTpe: tpes });
				socket.join('client');
			});

			socket.on('validate-payment', args => {
				console.info('Payment validated', args);
				const actualClient = this._clients[socket.id];
				const tpeSocket = Object.keys(this._clients).find(
					key =>
						this._clients[key].isMerchant &&
						key === actualClient.tpeId
				);
				if (tpeSocket) {
					if (!this._clients[tpeSocket].isWaiting) {
						socket.emit('client-waiting');
						return;
					}
					this._clients[tpeSocket].isWaiting = false;
					socket.to(tpeSocket).emit('asking-payment', {
						status: 'success',
						price: args.amount,
						merchantId: args.merchantId,
					});
					socket.emit('payment-validated', { status: 'success' });
				} else {
					console.error('TPE not found');
					socket.emit('payment-error', { status: 'error' });
				}
			});

			socket.on('payment', async args => {
				console.info('Payment received', args);
				this._clients[socket.id].isWaiting = true;
				const merchantSocket = Object.keys(this._clients).find(
					key =>
						this._clients[key].isUser &&
						this._clients[key].merchantId === args.merchantId
				);
				if (merchantSocket) {
					const user = args.hasOwnProperty('qrcode')
						? await CMUser.fetchByQRCode(args.qrcode)
						: await CMUser.fetchByNFC(args.nfc);
					if (user) {
						const cmUser = CMUser.fromJSON(user);
						cmUser.setAmount(cmUser.getAmount() - args.price);
						await cmUser.update();
						this._io.to(merchantSocket).emit('payment-client', {
							status: 'success',
						});
						socket.emit('payment-done');
						return;
					}
					socket.emit('payment-failed');
				}
			});
		});
	}

	public static getInstance(
		app?: http.Server<
			typeof http.IncomingMessage,
			typeof http.ServerResponse
		>
	): CMWebSocket {
		if (!CMWebSocket.instance) {
			CMWebSocket.instance = new CMWebSocket(app!);
		}
		return CMWebSocket.instance;
	}
}
