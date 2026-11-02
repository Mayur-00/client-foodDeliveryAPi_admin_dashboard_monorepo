import { Axios } from "axios";
import { redisClientType } from "../../../config/redis.config.js";
import { Logger } from "winston";
import { VerifyOtpResponse } from "./otp.types.js";
import { ApiError } from "../../../utils/apiError.js";

export class OtpServices {
  private baseUrl = "https://cpaas.messagecentral.com";
  private redisKey = "verifynow:id";
  private redisKeyTtl = 7 * 24 * 60 * 60; // 7 day's in seconds

  constructor(
    private redis: redisClientType,
    private httpClient: Axios,
    private Logger: Logger,
    private customerId: string,
    private secretKey: string,
  ) {}

  async getNewAuthToken() {
    const response = await this.httpClient.get(
      `${this.baseUrl}/auth/v1/authentication/token`,
      {
        params: {
          customerId: this.customerId,
          key: this.secretKey,
          scope: "NEW",
          country: "91",
        },
        headers: { accept: "*/*" },
      },
    );

    const responseData = response.data;
    // Extract token based on API response envelope
    const authToken = responseData.token || responseData.data?.token;
    await this.saveAuthToken(authToken);
    return authToken;
  }

  async saveAuthToken(id: string) {
    const ttl = this.redisKeyTtl;
    await this.redis.set(this.redisKey, id, "EX", ttl);
    this.Logger.info(`New Verifynow AuthId is Set`);
  }
  async getAuthToken() {
    const token = await this.redis.get(this.redisKey);
    if (!token) {
      this.Logger.info(`authToken doesn't existing , getting new one`);
      return this.getNewAuthToken();
    } else {
      this.Logger.info(`authToken Found!`);
      return token;
    }
  }

  async sendOtp(phone: string) {
   try {
     const authToken = await this.getAuthToken();

     this.Logger.info(`authToken, ${authToken}`);
     this.Logger.info(`phone, ${phone}`);

    const response = await this.httpClient.post(
      `${this.baseUrl}/verification/v3/send`,
      null,
      {
        headers: { 
            "authToken":authToken,
            "Accept":'*/*'
         },
        params: { countryCode: "91", mobileNumber:phone, flowType: "SMS", otpLength: 6 },
      },
    );

    this.Logger.info(`verificationid :${response.data.data.verificationId}`)
    return response.data.data.verificationId;
   } catch (error) {
    this.Logger.error(`failed at otp stage ${error}`);
    throw new ApiError(400, 'failed to send otp')
   }
  }

  async validateOtp(verificationId: string, code: string) {
    this.Logger.info(`verificationCode: ${verificationId} code:${code}`)
   try {
     const authToken = await this.getAuthToken();
    const response = await this.httpClient.get<VerifyOtpResponse>(
      `${this.baseUrl}/verification/v3/validateOtp`,
      {
         headers: { 
            "authToken":authToken,
            "Accept":'*/*'
         },
        params: { verificationId, code },
      },
    );
    console.log(response.data)
    
    return response.data;
   } catch (error) {
     this.Logger.error(`failed at otp verification stage ${error}`);
    throw new ApiError(400, 'failed to verify otp')
   }

  }
}
