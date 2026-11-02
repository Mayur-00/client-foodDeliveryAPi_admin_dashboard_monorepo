import { logger } from "../../config/logger.config.js";
import { db } from "../../db/index.js";
import { cacheService } from "../shared/cache/index.js";
import { otpService } from "../shared/otp/index.js";
import { UserController } from "./user.controller.js";
import { UserRepository } from "./user.repository.js";
import { createUserRoutes } from "./user.routes.js";
import { UserServices } from "./user.services.js";

export const userRepository = new UserRepository(db);
export const userService = new UserServices(userRepository, logger, otpService, cacheService);

export const userController = new UserController(userService, logger);

export const userRoutes = createUserRoutes(userController);
