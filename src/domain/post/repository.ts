import type { Post } from "./entity.js";

export interface PostRepository {
  getAll(take?: number, categoryName?: string): Promise<Post[]>; // Оновлено тут
  getById(id: number): Promise<Post | undefined>;
  addPost(newPost: {
    title: string;
    content: string;
    author: string;
    createdAt: string;
    categoryId: number;
  }): Promise<Post>;
}