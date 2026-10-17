import type { Post } from "../../domain/post/entity.js";

export interface CreatePostData {
  title: string;
  content: string;
  author: string;
  categoryId: number; // Додано
}

export interface PostService {
  getPosts(take?: number, categoryName?: string): Promise<Post[]>; // Додано categoryName
  getPostById(id: number): Promise<Post | undefined>;
  createPost(data: CreatePostData): Promise<Post | null>;
}