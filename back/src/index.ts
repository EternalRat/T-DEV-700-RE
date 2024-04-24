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

// Init the database client and create the instance
DatabaseClient.getDatabaseInstance();

const expressApp = express();
const PORT = process.env.port ?? 8080;

expressApp.use(
    cors({
        credentials: true,
        origin: "*",
    }),
);
expressApp.use(cookieParser());

expressApp.use("/api", routes);

CMWebSocket.getInstance(expressApp);

expressApp.listen(PORT, () => {
    console.info(`App listening on port ${PORT}`);
});
