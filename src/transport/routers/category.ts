import { Router } from "express";

export function createCategoryRouter(categoryHandler: ReturnType<typeof import("../handlers/category.js").createCategoryHandlers>): Router {
  const router = Router();
  router.get("/", categoryHandler.getCategories);
  router.get("/:id", categoryHandler.getCategoryById);
  router.post("/", categoryHandler.createCategory);
  return router;
}