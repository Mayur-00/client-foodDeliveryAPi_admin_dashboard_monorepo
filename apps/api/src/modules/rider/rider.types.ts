import { RequestHandler } from "express";
import { riderTable } from "../../db/schema/rider.schema.js";
import { loginRiderDto, verifyRiderDto } from "./rider.dto.js";

type rider = typeof riderTable.$inferSelect;

export interface IRiderController{
    login: RequestHandler,
    verify:RequestHandler,
    // getSuccessfullOrders:RequestHandler,
    // acceptOrderAssignment:RequestHandler,
    // confirmOrderPickedUp:RequestHandler,
    // confirmOrderDelivered:RequestHandler,
    // startShift:RequestHandler,
    // stopShift:RequestHandler,
};

export interface IRiderServices {
    login: (
        data: loginRiderDto,
    ) => Promise<{ success:boolean, message:string, rider?:rider }>;
  verify: (
    data: verifyRiderDto,
  ) => Promise<{ success:boolean, message:string, rider?:rider, jwt?:string}>;
  getAccount: (
    id: string,
  ) => Promise<rider>;
}
export interface IRiderRepository {
  getOneByPhone: (phone: string) => Promise<rider | undefined>;
  getOneById: (id: string) => Promise<rider | undefined>;
}

