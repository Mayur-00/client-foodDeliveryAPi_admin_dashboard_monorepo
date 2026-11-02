import { Router } from "express";
import { UserController } from "./user.controller.js";
import { authorize } from "../../middleware/auth.middleware.js";



export function createUserRoutes(controller: UserController): Router {
  const router = Router();

  // OAuth flow
  router.post('/login', controller.login);
  router.post('/verify', controller.verifyAccount);
  router.get('/',authorize('USER') , controller.getAccount);
  return router;
}
