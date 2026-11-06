import { Request, RequestHandler, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { LoginRestorantSchema, verifyRestorantSchema } from "./restorant.dto.js";
import { IRestorantServices } from "./restorant.types.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";


export class RestorantController{
    constructor( private services: IRestorantServices){};

    login:RequestHandler = asyncHandler(async (req:Request, response:Response)=>{
        const data = LoginRestorantSchema.parse(req.body);

        const res = await this.services.login(data);
         if(!res.success){
            throw new ApiError(500, "internal server error");
        };
        response.status(200).json(new ApiResponse(200, res.restorant, "otp send"))
    });

    verify:RequestHandler = asyncHandler(async (req:Request, res:Response)=>{
        const data = verifyRestorantSchema.parse(req.body);
        
        const response = await this.services.verify(data);

        if(!response.success){
            throw new ApiError(500, "internal server error");
        };

        res.status(200).json(new ApiResponse(200, {restorant_id:response.restorant?.id, token:response.jwt}));
    });

    account: RequestHandler = asyncHandler (async (req:Request, res:Response)=> {
        if (!req.account) {
        throw new ApiError(401, "unauthorized");
      }
      const restorantId = req.account.id;

      const restorant = await this.services.getAccount(restorantId);

      res.status(200).json(new ApiResponse(200, restorant, "success"))
    });
}