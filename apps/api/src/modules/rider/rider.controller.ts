import { Logger } from "winston";
import { IRiderController, IRiderServices } from "./rider.types.js";
import { Request, RequestHandler, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { LoginRiderSchema, verifyRiderSchema } from "./rider.dto.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";


export class RiderController implements IRiderController {
    constructor(private service:IRiderServices, private logger:Logger){};

    login :RequestHandler = asyncHandler(async (req:Request, res:Response) => {
        const data = LoginRiderSchema.parse(req.body);

        const response = await this.service.login(data);

        if(!response.success){
            this.logger.error("failed to login");
            
            throw new ApiError(500, "Internal Server Error");
        };

        res.status(200).json(new ApiResponse(200, {riderId:response.rider?.id}, "Success"))

    });
    verify :RequestHandler = asyncHandler(async (req:Request, res:Response) => {
        const data = verifyRiderSchema.parse(req.body);

        const response = await this.service.verify(data);

        if(!response.success){
            this.logger.error("failed to login");
            
            throw new ApiError(500, "Internal Server Error");
        };

        res.status(200).json(new ApiResponse(200, {riderId:response.rider?.id}, "Success"))

    });
    
}