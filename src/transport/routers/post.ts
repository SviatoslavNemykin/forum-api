import { Router } from "express";
import type { RequestHandler } from "express";
import type { PostHandler } from "../handlers/post.js";

export function createPostRouter(
    postHandler: PostHandler,
    requireAuth: RequestHandler // <-- Принимаем мидлвар
): Router {
    const router = Router();

    router.get("/my_posts", requireAuth, postHandler.getMyPosts); // <-- Эндпоинт для получения своих постов
    router.get("/", postHandler.getPosts);
    router.get("/:id", postHandler.getPostById);
    router.post("/", requireAuth, postHandler.createPost); // (опционально можно тоже защитить создание)

    return router;
}