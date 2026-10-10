import type { Post } from "./entity.js";

export interface PostRepository {
  getAll(take?: number): Promise<Post[]>;
  getById(id: number): Promise<Post | undefined>;
  addPost(newPost: Post): Promise<Post>;
}