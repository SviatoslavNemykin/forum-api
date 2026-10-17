import type { Category } from "../../domain/category/entity.js";

export interface CategoryService {
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(name: string): Promise<Category | null>;
}