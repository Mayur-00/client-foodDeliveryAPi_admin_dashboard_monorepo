import { RequestHandler } from "express";
import { orderTable, userStatusEnum, userTable } from "../../db/schema/index.js";
import { Jwt } from "jsonwebtoken";
import { LoginUserDto } from "./user.dto.js";
type user = typeof userTable.$inferSelect;
type order = typeof orderTable.$inferSelect;
export type userStatusEnumType = (typeof userStatusEnum.enumValues[number])
export interface IUserController{
    verifyAccount: RequestHandler
    login: RequestHandler,
    getAccount: RequestHandler,
};

export interface IUserServices{
    verifyOtpAndSignJwt: (phone:string, otp:string)=> Promise<{success:boolean, message:string, user?:user, jwt?:string}>
    loginUser:(data:LoginUserDto)=> Promise<{success:boolean, message:string, user?:user}>
    getAccount:(id:string)=> Promise<user>
}
export interface IUserRepository{
    findUser:(phone:string) => Promise<user | undefined>;
    createUser:(data:LoginUserDto)=> Promise<user | undefined>;
    updateVerificationStatus:(phone:string, status:userStatusEnumType)=> Promise<user | undefined>;
    getUserById: (id:string)=>Promise<user | undefined>
}

