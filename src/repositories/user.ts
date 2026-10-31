import type { UserRepository, NewUser } from "../domain/user/repository.js";
import type { User } from "../domain/user/entity.js";
import type { PostgresClient } from "@prisma/orm-postgres/runtime";
import type { Contract } from "../prisma/contract.js";

export function createUserRepository(database: PostgresClient<Contract>): UserRepository {
  return {
    async getByEmail(email: string): Promise<User | null> {
      const user = await database.orm.public.User.where({ email }).first();
      return (user as unknown as User) ?? null;
    },

    async getUserById(id: number): Promise<User | null> {
      const user = await database.orm.public.User.where({ id }).first();
      return (user as unknown as User) ?? null;
    },

    async createUser(data: NewUser): Promise<User> {
      try {
        const created = await database.orm.public.User.create(data);
        return created as unknown as User;
      } catch (error) {
        if ((error as { sqlState?: string }).sqlState === "23505") {
          throw new Error("EMAIL_ALREADY_EXISTS");
        }
        throw error;
      }
    },
  };
}