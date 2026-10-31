import { Router } from "express";

export function createAuthRouter(userAuthHandler: any): Router {
  const router = Router();
  router.post("/login", userAuthHandler.login);
  router.post("/register", userAuthHandler.register);
  router.post("/refresh", userAuthHandler.refresh);
  return router;
}