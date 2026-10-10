import type { PostRepository } from "../../domain/post/repository.js";
import type { PostService, CreatePostData } from "./post.types.js";
import type { Post } from "../../domain/post/entity.js";

export function createPostService(postRepository: PostRepository): PostService {
  return {
    // Делаем асинхронными, так как репозиторий теперь возвращает Promise
    async getPosts(take) {
      return await postRepository.getAll(take);
    },
    
    async getPostById(id) {
      return await postRepository.getById(id);
    },
    
    async createPost(data: CreatePostData) {
      // Обязательно ждем получение постов через await
      const posts = await postRepository.getAll();
      const title = data.title.trim();

      const duplicate = posts.some(
        (post: Post) => post.title.toLowerCase() === title.toLowerCase()
      );
      if (duplicate) {
        return null;
      }

      const newPost: Post = {
        id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
        title,
        content: data.content.trim(),
        author: data.author.trim(),
        createdAt: new Date().toISOString(),
      };

      return await postRepository.addPost(newPost);
    },
  };
}