import axios from "axios";
import redis from "../../../config/redis.config.js";
import { OtpServices } from "./otp.services.js";
import { logger } from "../../../config/logger.config.js";

export * from './otp.services.js'
export const otpService = new OtpServices(redis, axios, logger, process.env.VERIFY_NOW_CUSTOMER_ID!, process.env.VERIFY_NOW_SECRET_KEY!)