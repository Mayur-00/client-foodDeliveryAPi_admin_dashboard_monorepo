

import { Router } from "express";
import { authorize } from "../../middleware/auth.middleware.js";
import { RestorantController } from "./restorant.controller.js";



export function createRestorantRoutes(controller: RestorantController): Router {
  const router = Router();

  // OAuth flow
  router.post('/login', controller.login);
  router.post('/verify', controller.verify);
  router.get('/',authorize('VENDOR') , controller.account);
  return router;
}
