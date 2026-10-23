import type { Request, Response } from "express";
import type { AuthService } from "../../services/auth/auth.types";

export function createAuthHandler(authService: AuthService) {
  return {
    async register(req: Request, res: Response) {
      try {
        const { email, password } = req.body;
        if (!email || !password) {
          return res.status(400).json({ error: "EMAIL_AND_PASSWORD_REQUIRED" });
        }

        const user = await authService.register({ email, password });
        return res.status(201).json(user);
      } catch (error: any) {
        if (error.message === "EMAIL_ALREADY_EXISTS") {
          return res.status(409).json({ error: "Email already exists" });
        }
        console.error("Registration error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    },

    async login(req: Request, res: Response) {
      try {
        const { email, password } = req.body;
        if (!email || !password) {
          return res.status(400).json({ error: "EMAIL_AND_PASSWORD_REQUIRED" });
        }

        const result = await authService.login({ email, password });
        return res.status(200).json(result);
      } catch (error: any) {
        if (error.message === "INVALID_CREDENTIALS") {
          return res.status(401).json({ error: "Invalid email or password" });
        }
        console.error("Login error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    },
  };
}