

export interface VerifyOtpResponse{
    
  responseCode: number
  message: string;
  error?:string;
  data?: {
    verificationId: string;
    mobileNumber: string;
    verificationStatus:string;
  };

}