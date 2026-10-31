import type { Request, Response } from "express";
import type { AuthService } from "../../services/auth/auth.types.js";

export interface AuthCredentialsRequest {
  email: string;
  password: string;
}

export interface AuthHandlers {
  register(
    req: Request<{}, {}, AuthCredentialsRequest>,
    res: Response
  ): Promise<void>;
  login(
    req: Request<{}, {}, AuthCredentialsRequest>,
    res: Response
  ): Promise<void>;
  refresh(req: Request, res: Response): Promise<void>;
}

export function createAuthHandlers(service: AuthService): AuthHandlers {
  return {
    async register(req, res) {
      try {
        const { email, password } = req.body;
        const user = await service.register({ email, password });
        res.status(201).json(user);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "EMAIL_ALREADY_EXISTS"
        ) {
          res.status(409).json({ message: "Email already exists" });
          return;
        }
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    },

    async login(req, res) {
      try {
        const { email, password } = req.body;
        const result = await service.login({ email, password });

        res.cookie("accessToken", result.tokens.access, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: Number(process.env.TOKEN_ACCESS_TIME),
          path: "/",
        });

        res.cookie("refreshToken", result.tokens.refresh, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: Number(process.env.TOKEN_REFRESH_TIME),
          path: "/auth",
        });

        res.status(200).json({ user: result.user });
      } catch (error) {
        if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
          res.status(401).json({ message: "Invalid credentials" });
          return;
        }
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    },

    async refresh(req, res) {
      const refreshToken = req.cookies.refreshToken;
      if (typeof refreshToken !== "string") {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      try {
        const tokens = await service.refresh(refreshToken);

        res.cookie("accessToken", tokens.access, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: Number(process.env.TOKEN_ACCESS_TIME),
          path: "/",
        });

        res.cookie("refreshToken", tokens.refresh, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: Number(process.env.TOKEN_REFRESH_TIME),
          path: "/auth",
        });

        res.status(200).json({ message: "success" });
      } catch (error) {
        if (error instanceof Error && error.message === "INVALID REFRESH TOKEN") {
          res.status(401).json({ message: "Unauthorized" });
          return;
        }
        console.error(error);
        res.status(500).json({ message: "server error" });
      }
    },
  };
}