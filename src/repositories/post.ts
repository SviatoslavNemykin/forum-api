import type { PostRepository } from "../domain/post/repository.js";
import type { PostgresClient } from "@prisma/orm-postgres/runtime";
import type { Contract } from "../prisma/contract.js";
import type { Post } from "../domain/post/entity.js";

export function createPostRepository(database: PostgresClient<Contract>): PostRepository {
  return {
    async getAll(take?: number, categoryName?: string): Promise<Post[]> {
      const query = database.orm.public.Post.orderBy((post) => post.id.asc());
      let posts = (await query.include("category").all()) as unknown as Post[];

      if (categoryName) {
        posts = posts.filter(
          (post) => post.category?.name.toLowerCase() === categoryName.toLowerCase()
        );
      }

      if (take !== undefined) {
        return posts.slice(0, take);
      }

      return posts;
    },

    async getById(id: number): Promise<Post | undefined> {
      const post = await database.orm.public.Post.where({ id }).include("category").first();
      return post as unknown as Post | undefined;
    },

    async addPost(newPost: {
      title: string;
      content: string;
      author: string;
      createdAt: string;
      categoryId: number;
    }): Promise<Post> {
      try {
        const created = await database.orm.public.Post.create(newPost);
        // Завантажуємо створений пост із вкладеною категорією
        const postWithCategory = await database.orm.public.Post.where({ id: created.id }).include("category").first();
        return postWithCategory as unknown as Post;
      } catch (error) {
        if ((error as { sqlState?: string }).sqlState === "23503") {
          throw new Error("CATEGORY_NOT_FOUND");
        }
        throw error;
      }
    },
  };
}