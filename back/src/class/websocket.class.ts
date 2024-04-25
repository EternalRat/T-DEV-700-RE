import { Server } from "socket.io";
import { Express } from "express";
import http from "http";

interface IClient {
    isMerchant: boolean;
    isUser: boolean;
    merchantId?: number;
    isWaiting?: boolean;
}

const DEFAULT_CLIENT: IClient = {
    isMerchant: false,
    isUser: false,
    merchantId: undefined,
    isWaiting: undefined,
};

export default class CMWebSocket {
    static instance: CMWebSocket;
    private _io: Server;
    private _clients: Record<string, IClient>;

    private constructor(app: Express) {
        this._io = new Server(http.createServer(app));
        this._io.on("connection", (socket) => {
            console.log("New client connected");
            this._clients[socket.id] = DEFAULT_CLIENT;
            socket.on("disconnect", () => {
                console.log("Client disconnected");
                delete this._clients[socket.id];
            });

            socket.on("connect-tpe", (args, callback) => {
                console.log("TPE connected", args);
                this._clients[socket.id] = {
                    ...this._clients[socket.id],
                    ...args,
                };
                callback({ status: "success" });
            });

            socket.on("connect-client", (args, callback) => {
                console.log("Client connected", args);
                this._clients[socket.id] = {
                    ...this._clients[socket.id],
                    ...args,
                };
                const tpeSocket = Object.keys(this._clients).find(
                    (key) =>
                        this._clients[key].isMerchant &&
                        this._clients[key].merchantId === args.merchantId,
                );
                if (tpeSocket)
                    this._io.to(tpeSocket).emit("client-connected", args);
                callback({ status: "success" });
            });

            socket.on("validate-payment", (args, callback) => {
                console.log("Payment validated", args);
                const clientSocket = Object.keys(this._clients).find(
                    (key) =>
                        this._clients[key].isMerchant &&
                        this._clients[key].merchantId === args.merchantId,
                );
                if (clientSocket) {
                    this._io.to(clientSocket).emit("payment", {
                        status: "success",
                    });
                    callback({ status: "success" });
                } else {
                    console.error("TPE not found");
                    callback({ status: "error" });
                }
            });

            socket.on("payment", (args, callback) => {
                console.log("Payment received", args);
                const merchantSocket = Object.keys(this._clients).find(
                    (key) =>
                        this._clients[key].isMerchant &&
                        this._clients[key].merchantId === args.merchantId,
                );
                if (merchantSocket)
                    this._io.to(merchantSocket).emit("payment", args);
                callback({ status: "success" });
            });
        });
    }

    public static getInstance(app?: Express): CMWebSocket {
        if (!CMWebSocket.instance) {
            CMWebSocket.instance = new CMWebSocket(app!);
        }
        return CMWebSocket.instance;
    }
}
