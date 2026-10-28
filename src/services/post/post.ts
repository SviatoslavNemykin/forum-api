import type { PostRepository } from "../../domain/post/repository.js";
import type { PostService, CreatePostData } from "./post.types.js";
import type { Post } from "../../domain/post/entity.js";

export function createPostService(postRepository: PostRepository): PostService {
  return {
    async getPosts(take, categoryName) {
      return await postRepository.getAll(take, categoryName);
    },
    
    async getPostById(id) {
      return await postRepository.getById(id);
    },
    
    async createPost(data: CreatePostData) {
      const posts = await postRepository.getAll();
      const title = data.title.trim();

      const duplicate = posts.some(
        (post: Post) => post.title.toLowerCase() === title.toLowerCase()
      );
      if (duplicate) {
        return null;
      }

      const newPostData = {
        title,
        content: data.content.trim(),
        createdAt: new Date().toISOString(),
        categoryId: data.categoryId,
        authorId: data.authorId,
      };

      return await postRepository.addPost(newPostData);
    },
  };
}