import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { handleError } from "./middleware/error.middleware.js";
import { userRoutes } from "./modules/user/index.js";

export const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL!,
    credentials: true,
  }),
);

app.use(express.json({ limit: "100kb" }));
app.set("trust proxy", 1);

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: 200,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1/user", userRoutes);

app.use(handleError);
