"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameServer = void 0;
class GameServer {
    constructor(socket) {
        this.socket = socket;
        this.usernameToSocket = {};
        this.socketToSsername = {};
        this.lines = [];
        this.isRunning = false;
        this.answer = undefined;
        this.master = undefined;
        this.socket = socket;
    }
    // 登录 => 成为房主 => 开始游戏 => 绘制 => 猜 => 游戏结束
    getUserList() {
        return Object.keys(this.usernameToSocket);
    }
    getGameState() {
        return this.isRunning;
    }
    getLines() {
        return this.lines;
    }
    getMaster() {
        return this.master;
    }
    becomeMaster(socket) {
        if (!this.isRunning && this.master == undefined) {
            this.master = socket.data.username;
            console.log(this.master);
            this.Notify();
            return true;
        }
        return false;
    }
    startGame(answer, socket) {
        if (!this.isRunning && socket.data.username == this.master) {
            this.answer = answer;
            console.log(this.answer);
            this.isRunning = true;
            this.Notify();
            return true;
        }
        return false;
    }
    updateLines(lines, socket) {
        if (socket.data.username == this.master) {
            this.lines = lines;
            this.BroadcastNotify(socket);
            return true;
        }
        return false;
    }
    guessAnswer(answer) {
        console.log(answer);
        console.log(this.answer);
        if (answer == this.answer) {
            this.isRunning = false;
            this.answer = undefined;
            this.master = undefined;
            this.Notify();
            return true;
        }
        return false;
    }
    login(username, socket) {
        if (!this.isLogin(socket) &&
            !Object.keys(this.usernameToSocket).includes(username)) {
            socket.data.username = username;
            this.usernameToSocket[username] = socket;
            this.socketToSsername[socket.id] = username;
            this.Notify();
            return true;
        }
        return false;
    }
    isLogin(socket) {
        let socket_ = this.usernameToSocket[socket.data.username];
        return socket.id == (socket_ === null || socket_ === void 0 ? void 0 : socket_.id);
    }
    logout(socket) {
        if (this.isLogin(socket)) {
            delete this.usernameToSocket[socket.data.username];
            delete this.socketToSsername[socket.id];
            this.Notify();
            return true;
        }
        return false;
    }
    Notify() {
        this.socket.emit("update");
    }
    BroadcastNotify(socket) {
        socket.broadcast.emit("update");
    }
    run() {
        this.socket.on("connection", (socket) => {
            console.log("connection");
            // 登录
            socket.on("login", (username, callback) => {
                let result = this.login(username, socket);
                callback(result);
            });
            // 获取数据
            // getUserList
            socket.on("getUserList", (callback) => {
                let result = this.getUserList();
                callback(result);
            });
            // getGameState
            socket.on("getGameState", (callback) => {
                let result = this.getGameState();
                callback(result);
            });
            // getLines
            socket.on("getLines", (callback) => {
                let result = this.getLines();
                callback(result);
            });
            // getMaster
            socket.on("getMaster", (callback) => {
                let result = this.getMaster();
                callback(result);
            });
            // becomeMaster
            socket.on("becomeMaster", (callback) => {
                let result = this.becomeMaster(socket);
                callback(result);
            });
            // startGame
            socket.on("startGame", (answer, callback) => {
                let result = this.startGame(answer, socket);
                callback(result);
            });
            // updateLines
            socket.on("updateLines", (lines, callback) => {
                let result = this.updateLines(lines, socket);
                callback(result);
            });
            // guessAnswer
            socket.on("guessAnswer", (answer, callback) => {
                let result = this.guessAnswer(answer);
                callback(result);
            });
            // 检查是否已经登录
            socket.on("isLogin", (callback) => {
                let result = this.isLogin(socket);
                callback(result);
            });
            // 退出
            socket.on("logout", (callback) => {
                let result = this.logout(socket);
                callback(result);
            });
            // 退出
            socket.on("disconnect", () => {
                let result = this.logout(socket);
                console.log("disconnect");
            });
        });
    }
}
exports.GameServer = GameServer;
