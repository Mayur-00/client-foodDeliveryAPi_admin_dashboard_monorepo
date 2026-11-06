import { logger } from "../../config/logger.config.js";
import { db } from "../../db/index.js";
import { cacheService } from "../shared/cache/index.js";
import { otpService } from "../shared/otp/index.js";
import { RiderController } from "./rider.controller.js";
import { RiderRepository } from "./rider.repository.js";
import { createRiderRoutes } from "./rider.routes.js";
import { RiderService } from "./rider.service.js";



export const riderRepository = new RiderRepository(db);
export const riderService = new RiderService(riderRepository, logger, otpService, cacheService)
export const restorantController = new RiderController(riderService, logger);

export const riderRoutes = createRiderRoutes(restorantController);