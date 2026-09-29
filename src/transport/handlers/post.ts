import type { Request, Response } from "express";
import type { PostService } from "../../services/post/post.types.js";
import type { CreatePostRequest } from "../dto/post/requests.js";
import type { PostResponse } from "../dto/post/responses.js";
import type { ErrorResponse } from "../dto/post/errors.js";

export interface PostHandler {
  getPosts(req: Request, res: Response<PostResponse[] | ErrorResponse>): void;
  getPostById(req: Request, res: Response<PostResponse | ErrorResponse>): void;
  createPost(
    req: Request<{}, {}, CreatePostRequest>,
    res: Response<PostResponse | ErrorResponse>
  ): Promise<void>;
}

export function createPostHandlers(postService: PostService): PostHandler {
  return {
    getPosts(req, res) {
      const take = req.query.take ? Number(req.query.take) : undefined;
      res.status(200).json(postService.getPosts(take));
    },

    getPostById(req, res) {
      const postId = Number(req.params.id);
      if (!Number.isInteger(postId) || postId <= 0) {
        res.status(400).json({ message: "Id must be a positive integer" });
        return;
      }

      const post = postService.getPostById(postId);
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

      const { title, content, author } = body as Record<string, unknown>;
      if (
        typeof title !== "string" || !title.trim() ||
        typeof content !== "string" || !content.trim() ||
        typeof author !== "string" || !author.trim()
      ) {
        res.status(422).json({ message: "Invalid post data" });
        return;
      }

      try {
        const post = await postService.createPost({
          title,
          content,
          author,
        });

        if (!post) {
          res.status(409).json({ message: "Post already exists" });
          return;
        }

        res.status(201).json(post);
      } catch (error) {
        res.status(500).json({ message: "Failed to create post" });
      }
    },
  };
}