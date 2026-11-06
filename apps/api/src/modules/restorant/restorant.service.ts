import { Logger } from "winston";
import { IRestorantRepository, IRestorantServices } from "./restorant.types.js";
import { loginRestorantDto, verifyRestorantDto } from "./restorant.dto.js";
import { ApiError } from "../../utils/apiError.js";
import { OtpServices } from "../shared/otp/otp.services.js";
import { CacheService } from "../shared/cache/cache.service.js";
import { createAuthToken } from "../../utils/jwt.utils.js";

export class RestorantService implements IRestorantServices {
  constructor(
    private logger: Logger,
    private repo: IRestorantRepository,
    private otpService: OtpServices,
    private cache: CacheService
  ) {}

  async verify(data: verifyRestorantDto) {
     const cacheResponse = await this.cache.getCache(`user:${data.phone}:verificationId`);
    if(!cacheResponse.success){
      throw new ApiError(410, "otp expired", "EXPIRED");
    };

    const res = await this.otpService.validateOtp(cacheResponse.data as string, data.otp);

    if(res.responseCode > 200 && res.responseCode !== 703){
      throw new ApiError(401, 'verification failed', 'FAILED')
    };

    const restorant = await this.repo.getOneByPhone(data.phone);

     if(restorant ===undefined){
    throw new ApiError(404, "user not found");
    };

    const jwtToken = createAuthToken(restorant.id, restorant.name, 'ADMIN');
        console.log("jwt",jwtToken)
    
        return {
          success:true,
          message:'success',
          restorant,
          jwt:jwtToken
        }
    
  };
  async login(data: loginRestorantDto) {
    const restorant = await this.repo.getOneByPhone(data.phone);
    if (restorant === undefined) {
      this.logger.error("Restorant not found");
      throw new ApiError(404, "restorant not found ");
    }
     const verificationId = await this.otpService.sendOtp(restorant.phone);
      const res = await this.cache.setCache(
        `user:${restorant.phone}:verificationId`,
        verificationId,
        600,
      ); //600 is 10 minutes in seconds
      if (!res.success) {
        throw new ApiError(500, "Internal Api Error", 'Failed')
      }
      return { success: true, message: "OTP requested", restorant: restorant };
    
  };
  async getAccount(id:string){

    const restorant = await this.repo.getOneById(id);

    if(restorant === undefined){
        this.logger.error("restorant not found")
        throw new ApiError(404, "restorant not found")
    };

    return restorant;
  }
}
