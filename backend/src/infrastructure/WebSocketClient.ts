// src/infrastructure/WebSocketClient.ts
import { io, Socket } from "socket.io-client";
import { IWebSocketClient } from "../application/interfaces/IWebSocketClient";

export class WebSocketClient implements IWebSocketClient {
  private socket: Socket | null = null;

  constructor(private url: string) {}

  connect(): void {
    if (!this.socket) {
      this.socket = io(this.url);
      console.log("WebSocket connected");
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("WebSocket disconnected");
    }
  }

  joinRoom(roomId: string): void {
    if (this.socket) {
      this.socket.emit("joinRoom", roomId);
      console.log(`Joined room: ${roomId}`);
    }
  }

  leaveRoom(roomId: string): void {
    if (this.socket) {
      this.socket.emit("leaveRoom", roomId);
      console.log(`Left room: ${roomId}`);
    }
  }

  onRoomUpdated(callback: (room: any) => void): void {
    if (this.socket) {
      this.socket.on("roomUpdated", callback);
      console.log("Subscribed to room updates");
    }
  }

  offRoomUpdated(): void {
    if (this.socket) {
      this.socket.off("roomUpdated");
      console.log("Unsubscribed from room updates");
    }
  }
}