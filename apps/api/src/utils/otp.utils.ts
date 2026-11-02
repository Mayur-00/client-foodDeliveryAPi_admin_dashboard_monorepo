import redis from "../config/redis.config.js"



export async function sendOtp(phone:number){
if(phone.toString().length <=10){
    return {
        success:false,
        message:"invalid phone number"
    }
};

return {
    success:true,
    message:"success"
}
}