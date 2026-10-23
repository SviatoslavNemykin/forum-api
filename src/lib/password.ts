import "dotenv/config";
import argon2 from "argon2";

const pepper = process.env.PEPPER;
if (!pepper) throw new Error("PEPPER not found");
const pepperBuffer = Buffer.from(pepper);

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
    secret: pepperBuffer,
  });
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  return argon2.verify(hash, password, { secret: pepperBuffer });
}