import type { Post } from "./entity.js";

export interface PostRepository {
  getAll(take?: number, categoryName?: string): Promise<Post[]>;
  getById(id: number): Promise<Post | undefined>;
  addPost(newPost: {
    title: string;
    content: string;
    createdAt: string;
    categoryId: number;
    authorId: number;
  }): Promise<Post>;
}