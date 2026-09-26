import type { Request, Response } from 'express';
import * as postService from '../../services/post.js';
import type { CreatePostRequest, GetPostsQuery } from '../dto/post/requests.js';
import type { PostResponse } from '../dto/post/responses.js';
import type { ErrorResponse } from '../dto/post/errors.js';

function isPositiveInteger(value: string): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  const number = Number(value);

  if (!Number.isSafeInteger(number)) {
    return false;
  }

  if (number <= 0) {
    return false;
  }

  return String(number) === value;
}

export function getAll(
  req: Request<{}, {}, {}, GetPostsQuery>,
  res: Response<PostResponse[] | ErrorResponse>
): Response {
  try {
    const { category, take } = req.query;

    if (category !== undefined && (typeof category !== 'string' || !category.trim())) {
      return res.status(400).json({ message: 'category must be a non-empty string' });
    }

    if (take !== undefined && !isPositiveInteger(take)) {
      return res.status(400).json({ message: 'take must be a positive integer' });
    }

    const takeNumber = take !== undefined ? Number(take) : undefined;
    const posts = postService.getAll(category, takeNumber);

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export function getById(
  req: Request<{ id: string }>,
  res: Response<PostResponse | ErrorResponse>
): Response {
  try {
    const { id } = req.params;

    if (!isPositiveInteger(id)) {
      return res.status(400).json({ message: 'id must be a positive integer' });
    }

    const post = postService.getById(Number(id));

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function createPost(
  req: Request<{}, {}, CreatePostRequest>,
  res: Response<PostResponse | ErrorResponse>
): Promise<Response> {
  try {
    const { title, content } = req.body;

    if (
      typeof title !== 'string' ||
      !title.trim() ||
      typeof content !== 'string' ||
      !content.trim()
    ) {
      return res.status(422).json({
        message: 'Title and content are required and must be non-empty strings'
      });
    }

    const newPost = await postService.createPost(req.body);
    return res.status(201).json(newPost);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}