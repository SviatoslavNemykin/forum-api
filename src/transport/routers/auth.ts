import { Router } from "express";
import { createAuthHandler } from "../handlers/auth";
import type { AuthService } from "../../services/auth/auth.types";

export function createAuthRouter(authService: AuthService) {
  const router = Router();
  const handler = createAuthHandler(authService);

  router.post("/register", handler.register);
  router.post("/login", handler.login);

  return router;
}