import type { Post } from "../domain/post/entity.js";
import type { PostRepository } from "../domain/post/repository.js";

export function createPostRepository(): PostRepository {
  let posts: Post[] = [
    {
      id: 1,
      title: "First Post",
      content: "Welcome to the forum!",
      author: "Admin",
      createdAt: new Date().toISOString(),
    },
  ];

  return {
    getAll(take) {
      return take === undefined ? [...posts] : posts.slice(0, take);
    },
    getById(id) {
      return posts.find((post) => post.id === id);
    },
    async addPost(newPost) {
      posts = [...posts, newPost];
      return newPost;
    },
  };
}