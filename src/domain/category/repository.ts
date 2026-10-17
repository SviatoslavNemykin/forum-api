import type { Category } from "./entity.js";

export interface CategoryRepository {
  getAll(): Promise<Category[]>;
  getById(id: number): Promise<Category | undefined>;
  getByName(name: string): Promise<Category | undefined>;
  createCategory(name: string): Promise<Category>;
}