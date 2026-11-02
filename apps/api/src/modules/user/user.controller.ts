import { Logger } from "winston";
import { IUserController, IUserServices } from "./user.types.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Request, RequestHandler, Response } from "express";
import { LoginUserSchema, VerifyUserSchema } from "./user.dto.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { ApiError } from "../../utils/apiError.js";

export class UserController implements IUserController {
  constructor(
    private service: IUserServices,
    private logger: Logger,
  ) {}

  login: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const data = LoginUserSchema.parse(req.body);

    const response = await this.service.loginUser(data);

    return res.status(200).json(new ApiResponse(200, response.user, "success"));
  });
  verifyAccount: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const { phone, otp } = VerifyUserSchema.parse(req.body);

      const response = await this.service.verifyOtpAndSignJwt(phone, otp);
      console.log(response.jwt);

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { userid: response.user?.id, token: response.jwt },
            "success",
          ),
        );
    },
  );
  getAccount: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
      // const {phone, otp} = VerifyUserSchema.parse(req.body);
      if (!req.account) {
        throw new ApiError(401, "unauthorized");
      }
      const userid = req.account.id;

      const response = await this.service.getAccount(userid);

      return res.status(200).json(new ApiResponse(200, response, "success"));
    },
  );
}
