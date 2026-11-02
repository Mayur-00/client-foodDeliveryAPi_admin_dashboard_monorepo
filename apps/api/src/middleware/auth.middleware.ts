import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import {
  AccountRole,
  AuthTokenPayload,
  getTokenSecret,
} from "../utils/jwt.utils.js";

declare module "express-serve-static-core" {
  interface Request {
    account?: AuthTokenPayload;
  }
}

function readToken(req: Request) {
  const authorization = req.header("Authorization");
  return req.cookies?.token ?? authorization?.replace(/^Bearer\s+/i, "");
}

export function authorize(role: Exclude<AccountRole, "ADMIN">): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const token = readToken(req);
    // console.log(token)
    if (!token) {
      next(new ApiError(401, "Authentication required", "AUTH_REQUIRED"));
      return;
    }

    try {
      const payload = jwt.verify(token, getTokenSecret(role));
      if (
        typeof payload === "string" ||
        payload.role !== role ||
        typeof payload.id !== "string" ||
        typeof payload.name !== "string"
      ) {
        throw new ApiError(401, "Invalid access token", "INVALID_TOKEN");
      }
      req.account = payload as AuthTokenPayload;
      next();
    } catch (error) {
      next(
        error instanceof ApiError
          ? error
          : new ApiError(401, "Invalid or expired access token", "INVALID_TOKEN"),
      );
    }
  };
}

export const authorizeAdmin: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.specialToken ?? readToken(req);
  if (!token) {
    next(new ApiError(401, "Authentication required", "AUTH_REQUIRED"));
    return;
  }

  try {
    const payload = jwt.verify(token, getTokenSecret("ADMIN"));
    if (
      typeof payload === "string" ||
      payload.role !== "ADMIN" ||
      typeof payload.id !== "string" ||
      typeof payload.name !== "string"
    ) {
      throw new ApiError(401, "Invalid access token", "INVALID_TOKEN");
    }
    req.account = payload as AuthTokenPayload;
    next();
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : new ApiError(401, "Invalid or expired access token", "INVALID_TOKEN"),
    );
  }
};
