import { Whiteboard } from "@/Whiteboard";
import type { Socket } from "socket.io-client";

export class GameClient implements Observable {
  connect = false;
  username = "";
  usernames: Array<string> = [];
  isRunning: boolean = false;
  lines: any[] = [];
  line_buffer: any;
  master: string | undefined;
  isMaster: boolean;
  whiteboard: Whiteboard = new Whiteboard();
  constructor(private socket: Socket) {
    this.socket = socket;
  }

  async update() {
    this.usernames = await this.reqGetUserList();
    this.isRunning = await this.reqGetGameState();
    this.lines = await this.reqGetLines();
    this.master = await this.reqGetMaster();
    if (this.username == this.master) this.isMaster = true;
    else this.isMaster = false;
    this.whiteboard.afterUpdate = () => {
      if (this.isRunning && this.isMaster) {
        this.lines = this.whiteboard.lines;
        this.line_buffer = this.whiteboard.lineBuffer;
        this.updateLines([...this.lines, this.line_buffer]);
      } else {
        this.whiteboard.lines = this.lines;
      }
    };
  }

  async becomeMaster() {
    return await this.reqBecomeMaster();
  }
  async startGame(answer: string) {
    return await this.reqStartGame(answer);
  }
  async updateLines(lines: any[]) {
    return await this.reqUpdateLines(lines);
  }
  async guessAnswer(answer: string) {
    return await this.reqGuessAnswer(answer);
  }

  public async login(username: string): Promise<boolean> {
    if (await this.reqLogin(username)) {
      this.username = username;
      this.Notify();
      return true;
    }
    return false;
  }
  public async logout(): Promise<boolean> {
    if (await this.reqLogout()) {
      this.username = "";
      this.Notify();
      return true;
    }
    return false;
  }
  public async isLogin(): Promise<boolean> {
    if (await this.reqIsLogin()) {
      return true;
    }
    return false;
  }

  // 更新数据
  private async reqGetUserList(): Promise<typeof this.usernames> {
    return new Promise((resolve) => {
      this.socket.emit("getUserList", (result: Array<string>) => {
        resolve(result);
      });
    });
  }
  private async reqGetGameState(): Promise<boolean> {
    return new Promise((resolve) => {
      this.socket.emit("getGameState", (result: boolean) => {
        resolve(result);
      });
    });
  }
  private async reqGetLines(): Promise<Array<any>> {
    return new Promise((resolve) => {
      this.socket.emit("getLines", (result: Array<any>) => {
        resolve(result);
      });
    });
  }
  private async reqGetMaster(): Promise<string> {
    return new Promise((resolve) => {
      this.socket.emit("getMaster", (result: string) => {
        resolve(result);
      });
    });
  }
  private async reqBecomeMaster() {
    return new Promise((resolve) => {
      this.socket.emit("becomeMaster", (result: boolean) => {
        resolve(result);
      });
    });
  }
  private async reqStartGame(answer: string) {
    return new Promise((resolve) => {
      this.socket.emit("startGame", answer, (result: string) => {
        resolve(result);
      });
    });
  }
  private async reqUpdateLines(lines: any[]) {
    return new Promise((resolve) => {
      this.socket.emit("updateLines", lines, (result: string) => {
        resolve(result);
      });
    });
  }
  private async reqGuessAnswer(answer: string) {
    return new Promise((resolve) => {
      this.socket.emit("guessAnswer", answer, (result: string) => {
        resolve(result);
      });
    });
  }

  private async reqLogin(username: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.socket.emit("login", username, (result: boolean) => {
        resolve(result);
      });
    });
  }
  private async reqLogout(): Promise<boolean> {
    return new Promise((resolve) => {
      this.socket.emit("logout", (result: boolean) => {
        resolve(result);
      });
    });
  }
  private async reqIsLogin(): Promise<boolean> {
    return new Promise((resolve) => {
      this.socket.emit("isLogin", (result: boolean) => {
        resolve(result);
      });
    });
  }

  isConnect() {
    return this.connect;
  }
  setConnect(newVal: boolean) {
    this.connect = newVal;
    this.Notify();
  }
  run() {
    this.socket.on("connect", () => {
      console.log("game:connect");
      this.setConnect(true);
    });
    this.socket.on("disconnect", () => {
      this.setConnect(false);
    });
    this.socket.on("update", () => {
      this.update();
    });
  }
  observers: Observer[] = [];
  Attach(observer: Observer): void {
    if (this.observers.includes(observer)) return;
    this.observers.push(observer);
  }
  Detach(observer: Observer): void {
    if (this.observers.includes(observer)) {
      this.observers.splice(this.observers.indexOf(observer), 1);
    }
  }
  Notify(): void {
    this.observers.forEach((item) => item.update());
  }
}

// 设计模式观察者模式
// 观察者
interface Observer {
  update(): void;
}
// 可观察对象
interface Observable {
  observers: Array<Observer>; // 观察者
  Attach(observer: Observer): void; // 附加观察者
  Detach(observer: Observer): void; // 分离观察者
  Notify(): void; // 通知观察者
}
