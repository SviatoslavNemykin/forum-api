import "dotenv/config";
import jwt from "jsonwebtoken";

const accessSecret = process.env.JWT_ACCESS_SECRET as string;
if (!accessSecret) throw new Error("JWT_ACCESS_SECRET is not defined");

const refreshSecret = process.env.JWT_REFRESH_SECRET as string;
if (!refreshSecret) throw new Error("JWT_REFRESH_SECRET is not defined");

export function signAccessToken(userId: number): string {
  return jwt.sign({}, accessSecret, {
    algorithm: "HS256",
    subject: String(userId),
    expiresIn: Number(process.env.TOKEN_ACCESS_TIME) || 900,
  });
}

export function signRefreshToken(userId: number): string {
  return jwt.sign({ type: "refresh" }, refreshSecret, {
    algorithm: "HS256",
    subject: String(userId),
    expiresIn: Number(process.env.TOKEN_REFRESH_TIME) || 604800,
  });
}

export function verifyRefreshToken(token: string): number {
  try {
    const payload = jwt.verify(token, refreshSecret, { algorithms: ["HS256"] });
    if (
      typeof payload === "string" ||
      payload.type !== "refresh" ||
      typeof payload.sub !== "string"
    ) {
      throw new Error();
    }
    const userId = Number(payload.sub);
    if (!Number.isSafeInteger(userId) || userId <= 0) {
      throw new Error();
    }
    return userId;
  } catch {
    throw new Error("Invalid token");
  }
}