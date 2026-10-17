import express from "express";
import { db } from "./prisma/db.js";

import { createCategoryRepository } from "./repositories/category.js";
import { createCategoryService } from "./services/category/category.js";
import { createCategoryHandlers } from "./transport/handlers/category.js";
import { createCategoryRouter } from "./transport/routers/category.js";

import { createPostRepository } from "./repositories/post.js";
import { createPostService } from "./services/post/post.js";
import { createPostHandlers } from "./transport/handlers/post.js";
import { createPostRouter } from "./transport/routers/post.js";

export function createApp() {
  const app = express();
  app.use(express.json());

  const categoryRepo = createCategoryRepository(db);
  const categorySvc = createCategoryService(categoryRepo);
  const categoryHandlers = createCategoryHandlers(categorySvc);
  const categoryRouter = createCategoryRouter(categoryHandlers);

  const postRepo = createPostRepository(db);
  const postSvc = createPostService(postRepo);
  const postHandlers = createPostHandlers(postSvc);
  const postRouter = createPostRouter(postHandlers);

  app.use("/categories", categoryRouter);
  app.use("/posts", postRouter);

  return app;
}

const PORT = 8000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});