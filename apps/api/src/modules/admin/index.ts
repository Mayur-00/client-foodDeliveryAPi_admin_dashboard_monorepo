import { logger } from "../../config/logger.config.js";
import { db } from "../../db/index.js";
import { cacheService } from "../shared/cache/index.js";
import { otpService } from "../shared/otp/index.js";
import { AdminController } from "./admin.controller.js";
import { AdminRepository } from "./admin.repository.js";
import { createAdminRoutes } from "./admin.routes.js";
import { AdminService } from "./admin.service.js";


export const adminRepository = new AdminRepository(db);

export const adminService = new AdminService(adminRepository, otpService, cacheService, logger);

export const adminController = new AdminController(adminService);

export const adminRoutes = createAdminRoutes(adminController);

