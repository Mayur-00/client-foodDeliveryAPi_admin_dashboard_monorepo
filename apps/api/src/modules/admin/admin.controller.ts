import { Request, RequestHandler, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { IAdminServices } from "./admin.types.js";
import { loginAdminSchema, verifyAdminSchema } from "./admin.dto.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export class AdminController{
    constructor( private services: IAdminServices){};

    login:RequestHandler = asyncHandler(async (req:Request, response:Response)=>{
        const data = loginAdminSchema.parse(req.body);

        const res = await this.services.login(data);
         if(!res.success){
            throw new ApiError(500, "internal server error");
        };
        response.status(200).json(new ApiResponse(200, res.admin, "otp send"))
    });

    verify:RequestHandler = asyncHandler(async (req:Request, res:Response)=>{
        const data = verifyAdminSchema.parse(req.body);
        
        const response = await this.services.verify(data);

        if(!response.success){
            throw new ApiError(500, "internal server error");
        };

        res.status(200).json(new ApiResponse(200, {restorant_id:response.admin?.id, token:response.jwt}));
    });

    account: RequestHandler = asyncHandler (async (req:Request, res:Response)=> {
        if (!req.account) {
        throw new ApiError(401, "unauthorized");
      }
      const adminId = req.account.id;

      const admin = await this.services.getAccount(adminId);

      res.status(200).json(new ApiResponse(200, admin, "success"))
    });
}