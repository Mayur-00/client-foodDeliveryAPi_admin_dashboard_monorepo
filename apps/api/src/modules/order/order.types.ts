// import { RequestHandler } from "express";
// import { orderTable, userTable } from "../../db/schema/index.js";
// type user = typeof userTable.$inferSelect;
// type order = typeof orderTable.$inferSelect;
//  type orderStatusEnums = typeof orderTable.status.enumValues

//  export interface createOrderPayload {
//     userId:string,
//     restorantId:string,
//     cart:{
//         itemId:string,
//         qty:number
//     }[],
//     deliveryLocation:{
//         lat:number,
//         long:number
//     },

//  }
// export interface IOrderController{
//     getOrdersHistory:RequestHandler,
//     getActiveOrder:RequestHandler,
//     confirmOrderDeliverd:RequestHandler,
//     createNewOrder:RequestHandler,
// };

// export interface IOrderServices{
//     getOrders: (userId:string, status: orderStatusEnums)=>Promise<order[] | []>,
//     getActiveOrders:(userId:string)=>Promise<order[] | []>,
//     confirmOrderDeliverd:(orderId:string, deliveryAssignmentId:string, deliveryOtp:number)=>Promise<order>,
//     createNewOrder:(payload:createOrderPayload)=>Promise<order>,
// };

