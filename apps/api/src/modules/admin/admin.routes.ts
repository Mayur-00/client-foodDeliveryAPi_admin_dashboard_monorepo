



import { Router } from "express";
import { authorize } from "../../middleware/auth.middleware.js";
import { AdminController } from "./admin.controller.js";



export function createAdminRoutes(controller: AdminController): Router {
  const router = Router();

  // OAuth flow
  router.post('/login', controller.login);
  router.post('/verify', controller.verify);
  router.get('/',authorize('VENDOR') , controller.account);
  return router;
}
