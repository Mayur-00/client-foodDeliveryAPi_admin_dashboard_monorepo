import { RequestHandler } from "express";
import { adminTable } from "../../db/schema/admin.schema.js";
import { loginAdminSchemaDto, verifyAdminSchemaDto } from "./admin.dto.js";

type admin = typeof adminTable.$inferSelect
export interface IAdminController{
    login:RequestHandler
    verify:RequestHandler
    // addRestorant:()=>Promise<void>,
    // getResorants:()=>Promise<void>,
    // addRider:()=>Promise<void>,
    // getRiders:()=>Promise<void>,
    // assignRiderToOrder:()=>Promise<void>,
    // getOrder:()=>Promise<void>,
    // getOrders:()=>Promise<void>,
    // markRestorantPayoutCleared:()=>Promise<void>,
    // markRiderCashOnHoldCleared:()=>Promise<void>,

}


export interface IAdminServices {
  login: (
    data: loginAdminSchemaDto,
  ) => Promise<{ success:boolean, message:string, admin?:admin }>;
  verify: (
    data: verifyAdminSchemaDto,
  ) => Promise<{ success:boolean, message:string, admin?:admin, jwt?:string}>;
  getAccount: (
    id: string,
  ) => Promise<admin>;
}
export interface IAdminRepository {
  getOneByPhone: (phone: string) => Promise<admin | undefined>;
  getOneById: (id: string) => Promise<admin | undefined>;
}
