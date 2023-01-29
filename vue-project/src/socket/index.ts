import { io } from "socket.io-client";
export const socket = io(); // 默认向 http://当前页面/socket.io/? 发送消息
