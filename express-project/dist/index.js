"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importStar(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const GameServer_js_1 = require("./GameServer.js");
const express = (0, express_1.default)();
const httpServer = http_1.default.createServer(express);
const socketServer = new socket_io_1.Server(httpServer);
const gameServer = new GameServer_js_1.GameServer(socketServer); //游戏服务器,接收一个socket服务器
express.use((0, express_1.static)(path_1.default.resolve(__dirname, "../dist/"))); // 静态页面
gameServer.run(); // 游戏服务器
httpServer.listen(3000, () => {
    console.log("listening on *:3000");
});
