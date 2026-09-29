import type { PostRepository } from "../../domain/post/repository.js";
import type { PostService, CreatePostData } from "./post.types.js";
import type { Post } from "../../domain/post/entity.js";

export function createPostService(postRepository: PostRepository): PostService {
  return {
    getPosts(take) {
      return postRepository.getAll(take);
    },
    getPostById(id) {
      return postRepository.getById(id);
    },
    async createPost(data: CreatePostData) {
      const posts = postRepository.getAll();
      const title = data.title.trim();

      const duplicate = posts.some(
        (post) => post.title.toLowerCase() === title.toLowerCase()
      );
      if (duplicate) {
        return null;
      }

      const newPost: Post = {
        id: posts.length + 1,
        title,
        content: data.content.trim(),
        author: data.author.trim(),
        createdAt: new Date().toISOString(),
      };

      return postRepository.addPost(newPost);
    },
  };
}