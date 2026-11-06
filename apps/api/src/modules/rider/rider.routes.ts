

import { Router } from "express";
import { authorize } from "../../middleware/auth.middleware.js";
import { RiderController } from "./rider.controller.js";



export function createRiderRoutes(controller: RiderController): Router {
  const router = Router();

  // OAuth flow
  router.post('/login', controller.login);
  router.post('/verify', controller.verify);
//   router.get('/',authorize('RIDER') , controller.account);
  return router;
}
