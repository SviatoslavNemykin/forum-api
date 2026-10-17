import type { CategoryRepository } from "../domain/category/repository.js";
import type { PostgresClient } from "@prisma/orm-postgres/runtime";
import type { Contract } from "../prisma/contract.js";
import type { Category } from "../domain/category/entity.js";

export function createCategoryRepository(database: PostgresClient<Contract>): CategoryRepository {
  return {
    async getAll(): Promise<Category[]> {
      return (await database.orm.public.Category.all()) as unknown as Category[];
    },

    async getById(id: number): Promise<Category | undefined> {
      const category = await database.orm.public.Category.where({ id }).first();
      return category as unknown as Category | undefined;
    },

    async getByName(name: string): Promise<Category | undefined> {
      const category = await database.orm.public.Category.where({ name }).first();
      return category as unknown as Category | undefined;
    },

    async createCategory(name: string): Promise<Category> {
      try {
        const created = await database.orm.public.Category.create({ name });
        return created as unknown as Category;
      } catch (error) {
        if ((error as { sqlState?: string }).sqlState === "23505") {
          throw new Error("CATEGORY_ALREADY_EXISTS");
        }
        throw error;
      }
    },
  };
}