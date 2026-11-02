import jwt from "jsonwebtoken";
import { ApiError } from "./apiError.js";

export type AccountRole = "ADMIN" | "USER" | "VENDOR" | "RIDER";

export interface AuthTokenPayload extends jwt.JwtPayload {
  id: string;
  name: string;
  role: AccountRole;
}

export function getTokenSecret(role: AccountRole) {
  const secret = process.env[`${role}_TOKEN_SECRET`];
  console.log(secret);
  if (!secret) {
    throw new ApiError(
      500,
      `${role} token secret is not configured`,
      "AUTH_CONFIGURATION_ERROR",
    );
  }
  return secret;
}

export function createAuthToken(id: string, name: string, role: AccountRole) {
  return jwt.sign({ id, name, role }, getTokenSecret(role), {
    expiresIn: "30d",
  });
}
