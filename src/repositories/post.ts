import type { PostRepository } from "../domain/post/repository.js";
import type { PostgresClient } from "@prisma/orm-postgres/runtime";
import type { Contract } from "../prisma/contract.js";
import type { Post } from "../domain/post/entity.js";

export function createPostRepository(database: PostgresClient<Contract>): PostRepository {
  return {
    async getAll(take?: number, categoryName?: string): Promise<Post[]> {
      const query = database.orm.public.Post.orderBy((post) => post.id.asc());
      let posts = (await query.include("category").include("author").all()) as unknown as Post[];

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
      const post = await database.orm.public.Post.where({ id }).include("category").include("author").first();
      return post as unknown as Post | undefined;
    },

    async addPost(newPost: {
      title: string;
      content: string;
      createdAt: string;
      categoryId: number;
      authorId: number;
    }): Promise<Post> {
      try {
        const created = await database.orm.public.Post.create(newPost);
        const postWithRelations = await database.orm.public.Post.where({ id: created.id })
          .include("category")
          .include("author")
          .first();
        return postWithRelations as unknown as Post;
      } catch (error) {
        if ((error as { sqlState?: string }).sqlState === "23503") {
          throw new Error("CATEGORY_OR_USER_NOT_FOUND");
        }
        throw error;
      }
    },
  };
}