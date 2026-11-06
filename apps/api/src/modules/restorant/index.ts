import { logger } from "../../config/logger.config.js";
import { db } from "../../db/index.js";
import { RestorantController } from "./restorant.controller.js";
import { RestorantRepository } from "./restorant.repository.js";
import { RestorantService } from "./restorant.service.js";
import { otpService } from "../shared/otp/index.js";
import { cacheService } from "../shared/cache/index.js";
import { createRestorantRoutes } from "./restorant.routes.js";


export const restorantRepository = new RestorantRepository(db, logger);
export const restorantService = new RestorantService(logger, restorantRepository, otpService, cacheService )
export const restorantController = new RestorantController(restorantService);

export const restorantRoutes = createRestorantRoutes(restorantController);