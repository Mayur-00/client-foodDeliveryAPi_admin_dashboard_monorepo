import { Logger } from "winston";
import { CacheService } from "../shared/cache/cache.service.js";
import { OtpServices } from "../shared/otp/otp.services.js";
import { IAdminRepository, IAdminServices } from "./admin.types.js";
import { loginAdminSchemaDto, verifyAdminSchemaDto } from "./admin.dto.js";
import { ApiError } from "../../utils/apiError.js";
import { createAuthToken } from "../../utils/jwt.utils.js";

export class AdminService implements IAdminServices {
    constructor(private repo: IAdminRepository, private otpService:OtpServices, private cache:CacheService, private logger:Logger){};
     async verify(data: verifyAdminSchemaDto) {
         const cacheResponse = await this.cache.getCache(`user:${data.phone}:verificationId`);
        if(!cacheResponse.success){
          throw new ApiError(410, "otp expired", "EXPIRED");
        };
    
        const res = await this.otpService.validateOtp(cacheResponse.data as string, data.otp);
    
        if(res.responseCode > 200 && res.responseCode !== 703){
          throw new ApiError(401, 'verification failed', 'FAILED')
        };
    
        const admin = await this.repo.getOneByPhone(data.phone);
    
         if(admin ===undefined){
        throw new ApiError(404, "user not found");
        };
    
        const jwtToken = createAuthToken(admin.id, admin.name, 'ADMIN');
            console.log("jwt",jwtToken)
        
            return {
              success:true,
              message:'success',
              admin,
              jwt:jwtToken
            }
        
      };
      async login(data: loginAdminSchemaDto ) {
        const admin = await this.repo.getOneByPhone(data.phone);
        if (admin === undefined) {
          this.logger.error("account not found");
          throw new ApiError(404, "account not found ");
        }
         const verificationId = await this.otpService.sendOtp(admin.phone);
          const res = await this.cache.setCache(
            `user:${admin.phone}:verificationId`,
            verificationId,
            600,
          ); //600 is 10 minutes in seconds
          if (!res.success) {
            throw new ApiError(500, "Internal Api Error", 'Failed')
          }
          return { success: true, message: "OTP requested", admin: admin };
        
      };
      async getAccount(id:string){
    
        const admin = await this.repo.getOneById(id);
    
        if(admin === undefined){
            this.logger.error("account not found")
            throw new ApiError(404, "account not found")
        };
    
        return admin;
      }
}