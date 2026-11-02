import { Logger } from "winston";
import { IUserRepository, IUserServices } from "./user.types.js";
import { LoginUserDto } from "./user.dto.js";
import { ApiError } from "../../utils/apiError.js";
import { assertInsideDeliveryArea } from "../../utils/delivery-area.js";
import { OtpServices } from "../shared/otp/otp.services.js";
import { CacheService } from "../shared/cache/cache.service.js";
import { create } from "node:domain";
import { createAuthToken } from "../../utils/jwt.utils.js";

export class UserServices implements IUserServices {
  constructor(
    private readonly repository: IUserRepository,
    private readonly logger: Logger,
    private readonly otpService: OtpServices,
    private readonly cache: CacheService,
  ) {}

  async loginUser(data: LoginUserDto) {
    this.logger.info(`phone at login services start , ${data.phone}`)
    const existingUser = await this.repository.findUser(data.phone);
    if (existingUser) {
      if (existingUser.status ==="BLOCKED") {
        throw new ApiError(403, "This account is blocked", "ACCOUNT_BLOCKED");
      }
      this.logger.info(`existingUser, ${existingUser.phone}`)
      const verificationId = await this.otpService.sendOtp(existingUser.phone);
      const res = await this.cache.setCache(
        `user:${existingUser.phone}:verificationId`,
        verificationId,
        600,
      ); //600 is 10 minutes in seconds
      if (!res.success) {
        throw new ApiError(500, "Internal Api Error", 'Failed')
      }
      return { success: true, message: "OTP requested", user: existingUser };
    }

    assertInsideDeliveryArea(data.location.latitude, data.location.longitude);
    const newUser = await this.repository.createUser(data);
    if (newUser === undefined) {
      this.logger.error("User signup did not create an account");
      throw new ApiError(
        500,
        "Unable to create user account",
        "USER_CREATE_FAILED",
      );
    }

      const verificationId = await this.otpService.sendOtp(newUser.phone);
      const res = await this.cache.setCache(
        `user:${newUser.phone}:verificationId`,
        verificationId,
        300,
      ); //300 is 5 minutes in seconds
      if (!res.success) {
        this.logger.error("Failed to store verification id to cache")
        return {success:false, message:"failed to store cache"}
      }
    return { success: true, message: "OTP requested", user: newUser };
  }

  async verifyOtpAndSignJwt(phone: string, otp: string) {
    
    const cacheResponse = await this.cache.getCache(`user:${phone}:verificationId`);
    if(!cacheResponse.success){
      throw new ApiError(410, "otp expired", "EXPIRED");
    };

    const res = await this.otpService.validateOtp(cacheResponse.data as string, otp);

    if(res.responseCode > 200 && res.responseCode !== 703){
      throw new ApiError(401, 'verification failed', 'FAILED')
    };

  
    const user  = await this.repository.updateVerificationStatus(phone, 'VERIFIED');


    if(user ===undefined){
    throw new ApiError(404, "user not found");
    };

    const jwtToken = createAuthToken(user.id, user.name, 'USER');
    console.log("jwt",jwtToken)

    return {
      success:true,
      message:'success',
      user,
      jwt:jwtToken
    }

  }

  async getAccount  (id:string){
    const user = await this.repository. getUserById(id);
    if(user === undefined){
      throw new ApiError(404, "User Not Found", "NOT_FOUND")
    }
    return user;
  }
}
