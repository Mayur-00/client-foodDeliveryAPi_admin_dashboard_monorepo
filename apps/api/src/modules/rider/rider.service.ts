import { Logger } from "winston";
import { IRiderRepository, IRiderServices } from "./rider.types.js";
import { OtpServices } from "../shared/otp/otp.services.js";
import { loginRiderDto, verifyRiderDto } from "./rider.dto.js";
import { ApiError } from "../../utils/apiError.js";
import { CacheService } from "../shared/cache/cache.service.js";
import { createAuthToken } from "../../utils/jwt.utils.js";

export class RiderService implements IRiderServices{
    constructor(private repo:IRiderRepository, private logger:Logger, private otpService:OtpServices, private cache:CacheService){};

     async verify(data: verifyRiderDto) {
         const cacheResponse = await this.cache.getCache(`user:${data.phone}:verificationId`);
        if(!cacheResponse.success){
          throw new ApiError(410, "otp expired", "EXPIRED");
        };
    
        const res = await this.otpService.validateOtp(cacheResponse.data as string, data.otp);
    
        if(res.responseCode > 200 && res.responseCode !== 703){
          throw new ApiError(401, 'verification failed', 'FAILED')
        };
    
        const rider = await this.repo.getOneByPhone(data.phone);
    
         if(rider ===undefined){
        throw new ApiError(404, "user not found");
        };
    
        const jwtToken = createAuthToken(rider.id, rider.name, 'RIDER');
            console.log("jwt",jwtToken)
        
            return {
              success:true,
              message:'success',
              rider,
              jwt:jwtToken
            }
        
      };
      async login(data: loginRiderDto) {
        const rider = await this.repo.getOneByPhone(data.phone);
        if (rider === undefined) {
          this.logger.error("Restorant not found");
          throw new ApiError(404, "restorant not found ");
        }
         const verificationId = await this.otpService.sendOtp(rider.phone);
          const res = await this.cache.setCache(
            `user:${rider.phone}:verificationId`,
            verificationId,
            600,
          ); //600 is 10 minutes in seconds
          if (!res.success) {
            throw new ApiError(500, "Internal Api Error", 'Failed')
          }
          return { success: true, message: "OTP requested", rider:rider };
        
      };
      async getAccount(id:string){
    
        const rider = await this.repo.getOneById(id);
    
        if(rider === undefined){
            this.logger.error("restorant not found")
            throw new ApiError(404, "restorant not found")
        };
    
        return rider;
      }
}