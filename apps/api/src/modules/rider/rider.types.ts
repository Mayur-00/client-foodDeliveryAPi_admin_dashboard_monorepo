import { RequestHandler } from "express";

export interface IRiderController{
    register: RequestHandler,
    login: RequestHandler,
    getSuccessfullOrders:RequestHandler,
    acceptOrderAssignment:RequestHandler,
    confirmOrderPickedUp:RequestHandler,
    confirmOrderDelivered:RequestHandler,
    startShift:RequestHandler,
    stopShift:RequestHandler,
};
