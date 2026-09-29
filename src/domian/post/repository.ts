import { Post } from "./entity.js";

export interface PostRepository {
  getAll(take?: number): Post[];
  getById(id: number): Post | undefined;
  addPost(newPost: Post): Promise<Post>;
}