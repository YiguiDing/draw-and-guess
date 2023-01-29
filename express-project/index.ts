import path from "path";
import createExpress, { static as _static } from "express";
import http from "http";
import { Server } from "socket.io";
import { GameServer } from "./GameServer.js";

const express = createExpress();
const httpServer = http.createServer(express);
const socketServer = new Server(httpServer);
const gameServer = new GameServer(socketServer); //游戏服务器,接收一个socket服务器

express.use(_static(path.resolve(__dirname, "../dist/")));// 静态页面
gameServer.run();// 游戏服务器

httpServer.listen(3000, () => {
  console.log("listening on *:3000");
});
