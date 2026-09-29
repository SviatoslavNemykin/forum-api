import { Router } from "express";
import type { PostHandler } from "../handlers/post.js";

export function createPostRouter(postHandler: PostHandler): Router {
  const router = Router();

  router.get("/", postHandler.getPosts);
  router.get("/:id", postHandler.getPostById);
  router.post("/", postHandler.createPost);

  return router;
}