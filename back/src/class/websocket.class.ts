import { Server } from "socket.io";
import { Express } from "express";
import http from "http";
import CMUser from "./user.class";

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
        >,
    ) {
        this._io = new Server(app);
        this._io.on("connection", (socket) => {
            console.log("New client connected");
            console.log(socket.id);
            this._clients[socket.id] = DEFAULT_CLIENT;
            socket.on("disconnect", () => {
                console.log("Client disconnected");
                socket.leave("tpe");
                socket.leave("client");
                delete this._clients[socket.id];
            });

            socket.on("connect-tpe", (args) => {
                console.log("TPE connected", args);
                this._clients[socket.id] = {
                    ...this._clients[socket.id],
                    ...args,
                };
                socket.emit("tpe-connected");
                socket.join("tpe");
                const tpes = [];
                for (const [id, client] of Object.entries(this._clients)) {
                    if (client.isMerchant) {
                        tpes.push(id);
                    }
                }
                socket.to("client").emit("new-tpe", { allTpe: tpes });
            });

            socket.on("connect-client", (args) => {
                console.log("Client connected", args);
                console.log(args);
                this._clients[socket.id] = {
                    ...this._clients[socket.id],
                    ...args,
                };
                socket.to(args.tpeId).emit("client-connected", args);
            });

            socket.on("link-client", (args) => {
                console.log("Client linked");
                const tpes = [];
                for (const [id, client] of Object.entries(this._clients)) {
                    if (client.isMerchant) {
                        tpes.push(id);
                    }
                }
                socket.emit("new-tpe", { allTpe: tpes });
                socket.join("client");
            });

            socket.on("validate-payment", (args) => {
                console.log("Payment validated", args);
                const actualClient = this._clients[socket.id];
                const tpeSocket = Object.keys(this._clients).find(
                    (key) =>
                        this._clients[key].isMerchant &&
                        key === actualClient.tpeId,
                );
                console.log(actualClient, tpeSocket, this._clients);
                if (tpeSocket) {
                    if (!this._clients[tpeSocket].isWaiting) {
                        socket.emit("client-waiting");
                        return;
                    }
                    socket.to(tpeSocket).emit("asking-payment", {
                        status: "success",
                        price: args.amount,
                        merchantId: args.merchantId,
                    });
                    socket.emit("payment-validated", { status: "success" });
                } else {
                    console.error("TPE not found");
                    socket.emit("payment-error", { status: "error" });
                }
            });

            socket.on("payment", async (args) => {
                console.log("Payment received", args);
                const merchantSocket = Object.keys(this._clients).find(
                    (key) =>
                        this._clients[key].isUser &&
                        this._clients[key].merchantId === args.merchantId,
                );
                if (merchantSocket) {
                    const user = args.hasOwnProperty("qrcode")
                        ? await CMUser.fetchByQRCode(args.qrcode)
                        : await CMUser.fetchByNFC(args.nfc);
                    if (user) {
                        const cmUser = CMUser.fromJSON(user);
                        cmUser.setAmount(cmUser.getAmount() - args.price);
                        await cmUser.update();
                        this._io.to(merchantSocket).emit("payment-client", {
                            status: "success",
                        });
                        socket.emit("payment-done");
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
        >,
    ): CMWebSocket {
        if (!CMWebSocket.instance) {
            CMWebSocket.instance = new CMWebSocket(app!);
        }
        return CMWebSocket.instance;
    }
}
