import type { Post } from "../../domain/post/entity.js";

export interface CreatePostData {
  title: string;
  content: string;
  author: string;
}

 
export interface PostService {
  getPosts(take?: number): Post[];
  getPostById(id: number): Post | undefined;
  createPost(data: CreatePostData): Promise<Post | null>;
}