import { db } from "../prisma/db.js";
import type { Post } from "../domain/post/entity.js";
import type { PostRepository } from "../domain/post/repository.js";

export function createPostRepository(): PostRepository {
  return {
    async getAll(take?: number): Promise<Post[]> {
      const posts = await db.orm.public.Post.all();
      return take === undefined ? posts : posts.slice(0, take);
    },

    async getById(id: number): Promise<Post | undefined> {
      const posts = await db.orm.public.Post.all();
      return posts.find((post) => post.id === id);
    },

    async addPost(newPost: Post): Promise<Post> {
      const { id, ...postData } = newPost;

      const createdPost = await db.orm.public.Post.create({
        title: postData.title,
        content: postData.content,
        author: postData.author,
        createdAt: postData.createdAt,
      });

      return createdPost;
    },
  };
}