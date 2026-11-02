import { Request } from "express";
import { Server } from "socket.io";
import { ApiError } from "./apiError.js";

export function getRealtimeServer(req: Request) {
  const io = req.app.get("io") as Server | undefined;
  if (!io) {
    throw new ApiError(503, "Realtime events are unavailable", "REALTIME_UNAVAILABLE");
  }
  return io;
}

export function accountRoom(role: "USER" | "VENDOR" | "RIDER", id: string) {
  return `${role.toLowerCase()}:${id}`;
}
