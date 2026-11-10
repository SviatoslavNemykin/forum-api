import type { Post } from "../../domain/post/entity.js";

export interface CreatePostData {
  title: string;
  content: string;
  categoryId: number;
  authorId: number;
}

export interface PostService {
  getPosts(take?: number, categoryName?: string): Promise<Post[]>;
  getPostById(id: number): Promise<Post | undefined>;
  getMyPosts(authorId: number): Promise<Post[]>;
  createPost(data: CreatePostData): Promise<Post | null>;
}