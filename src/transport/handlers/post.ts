import type { Request, Response } from "express";
import type { PostService } from "../../services/post/post.types.js";

export interface PostHandler {
  getPosts(req: Request, res: Response): Promise<void>;
  getPostById(req: Request, res: Response): Promise<void>;
  createPost(req: Request, res: Response): Promise<void>;
}

export function createPostHandlers(postService: PostService): PostHandler {
  return {
    async getPosts(req, res) {
      const take = req.query.take ? Number(req.query.take) : undefined;
      const categoryName = typeof req.query.category === "string" ? req.query.category : undefined;
      const posts = await postService.getPosts(take, categoryName);
      res.status(200).json(posts);
    },
    async getPostById(req, res) {
      const postId = Number(req.params.id);
      if (!Number.isInteger(postId) || postId <= 0) {
        res.status(400).json({ message: "Id must be a positive integer" });
        return;
      }
      const post = await postService.getPostById(postId);
      if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
      }
      res.status(200).json(post);
    },
    async createPost(req, res) {
      const body = req.body;
      if (!body || typeof body !== "object" || Array.isArray(body)) {
        res.status(422).json({ message: "Invalid post data" });
        return;
      }
      const { title, content, categoryId, authorId } = body as Record<string, unknown>;
      if (
        typeof title !== "string" || !title.trim() ||
        typeof content !== "string" || !content.trim() ||
        typeof categoryId !== "number" || !Number.isInteger(categoryId) || categoryId <= 0 ||
        typeof authorId !== "number" || !Number.isInteger(authorId) || authorId <= 0
      ) {
        res.status(422).json({ message: "Invalid post data, categoryId or authorId" });
        return;
      }

      try {
        const post = await postService.createPost({
          title,
          content,
          categoryId,
          authorId,
        });

        if (!post) {
          res.status(409).json({ message: "Post already exists" });
          return;
        }

        res.status(201).json(post);
      } catch (error: any) {
        if (error.message === "CATEGORY_OR_USER_NOT_FOUND") {
          res.status(404).json({ message: "Category or User not found" });
          return;
        }
        res.status(500).json({ message: "Failed to create post" });
      }
    },
  };
}