import type { CategoryRepository } from "../../domain/category/repository.js";
import type { CategoryService } from "./category.types.js";
import type { Category } from "../../domain/category/entity.js";

export function createCategoryService(categoryRepository: CategoryRepository): CategoryService {
  return {
    async getCategories() {
      return await categoryRepository.getAll();
    },
    async getCategoryById(id) {
      return await categoryRepository.getById(id);
    },
    async createCategory(name: string) {
      const trimmedName = name.trim();
      const existing = await categoryRepository.getByName(trimmedName);
      if (existing) {
        return null;
      }
      try {
        return await categoryRepository.createCategory(trimmedName);
      } catch (error: any) {
        if (error.message === "CATEGORY_ALREADY_EXISTS") {
          return null;
        }
        throw error;
      }
    },
  };
}