// Init dotenv to get environment variables before everything else
import dotenv from "dotenv";
dotenv.config();

// Path: back/src/index.ts
// Import express, cors and cookie-parser
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import DatabaseClient from "./class/database.class";
import routes from "./routes";
import CMWebSocket from "./class/websocket.class";
import http from "http";
import { JWT } from "./class/jwt.class";
import { swaggerDoc } from "./utils/swagger";

// Init the database client and create the instance
DatabaseClient.getDatabaseInstance();
JWT.getInstance();

const expressApp = express();
const httpServer = http.createServer(expressApp);
const PORT = process.env.PORT || 8080;

expressApp.use(
    cors({
        origin: "*",
    }),
);
expressApp.use(cookieParser());
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));

expressApp.use("/api", routes);

CMWebSocket.getInstance(httpServer);

expressApp.get("/:file", (req: any, res: any) => {
    const file = req.params.file;

    if (file != "client.apk" && file != "tpe.apk") {
        res.send("File not found");
    } else if (file == "tpe.apk") {
        res.download("./build/tpe/tpe.apk");
    } else {
        res.download("./build/client/client.apk");
    }
});

swaggerDoc(expressApp);

httpServer.listen(PORT as number, () => {
    console.info(`⚡️ App listening on port ${PORT}`);
});
