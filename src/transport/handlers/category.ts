import type { Request, Response } from "express";
import type { CategoryService } from "../../services/category/category.types.js";

export function createCategoryHandlers(categoryService: CategoryService) {
  return {
    async getCategories(req: Request, res: Response) {
      const categories = await categoryService.getCategories();
      res.status(200).json(categories);
    },

    async getCategoryById(req: Request, res: Response) {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ message: "Invalid category ID" });
        return;
      }
      const category = await categoryService.getCategoryById(id);
      if (!category) {
        res.status(404).json({ message: "Category not found" });
        return;
      }
      res.status(200).json(category);
    },

    async createCategory(req: Request, res: Response) {
      const { name } = req.body || {};
      if (typeof name !== "string" || !name.trim()) {
        res.status(422).json({ message: "Invalid category data" });
        return;
      }

      try {
        const category = await categoryService.createCategory(name);
        if (!category) {
          res.status(409).json({ message: "Category already exists" });
          return;
        }
        res.status(201).json(category);
      } catch (error) {
        res.status(500).json({ message: "Internal server error" });
      }
    },
  };
}