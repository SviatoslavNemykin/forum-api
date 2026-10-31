import type { UserRepository } from "../../domain/user/repository.js";
import type { AuthService, AuthInput, PasswordHasher, TokenService } from "./auth.types.js";

export function createAuthService(
  repository: UserRepository,
  passwordHasher: PasswordHasher,
  tokenService: TokenService
): AuthService {
  return {
    async register(input: AuthInput) {
      const email = input.email.trim().toLowerCase();
      const passwordHash = await passwordHasher.hash(input.password);
      const user = await repository.createUser({ email, passwordHash });
      return { id: user.id, email: user.email };
    },

    async login(input: AuthInput) {
      const email = input.email.trim().toLowerCase();
      const user = await repository.getByEmail(email);
      if (
        !user ||
        !(await passwordHasher.verify(user.passwordHash, input.password))
      ) {
        throw new Error("INVALID_CREDENTIALS");
      }
      return {
        user: { id: user.id, email: user.email },
        tokens: {
          access: tokenService.signAccessToken(user.id),
          refresh: tokenService.signRefreshToken(user.id),
        },
      };
    },

    async refresh(refreshToken: string) {
      let userId: number;
      try {
        userId = tokenService.verifyRefreshToken(refreshToken);
      } catch {
        throw new Error("INVALID REFRESH TOKEN");
      }

      const user = await repository.getUserById(userId);
      if (!user) {
        throw new Error("INVALID REFRESH TOKEN");
      }

      return {
        access: tokenService.signAccessToken(userId),
        refresh: tokenService.signRefreshToken(userId),
      };
    },
  };
}