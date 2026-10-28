import { Router } from "express";

export function createAuthRouter(userAuthHandler: any): Router {
  const router = Router();
  router.post("/login", userAuthHandler.login);
  router.post("/register", userAuthHandler.register);
  return router;
}