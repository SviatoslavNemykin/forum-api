import jwt from "jsonwebtoken";

export function signAccessToken(userId: number): string {
  const secretKey = process.env.JWT_ACCESS_KEY;
  if (!secretKey) {
    throw new Error("secret key not found");
  }
  return jwt.sign({}, secretKey, {
    algorithm: "HS256",
    subject: String(userId),
    expiresIn: 15 * 60 * 100,
  });
}