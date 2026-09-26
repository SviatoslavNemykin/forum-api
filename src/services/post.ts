import * as postRepository from '../repositories/post.js';
import type { CreatePostRequest } from '../transport/dto/post/requests.js';
import type { PostResponse } from '../transport/dto/post/responses.js';

export function getAll(category?: string, take?: number): PostResponse[] {
  return postRepository.getAll(category, take);
}

export function getById(id: number): PostResponse | undefined {
  return postRepository.getById(id);
}

export async function createPost(data: CreatePostRequest): Promise<PostResponse> {
  const { title, content, author, category } = data;
  const allPosts: PostResponse[] = postRepository.getAll();

  const newPost: PostResponse = {
    id: allPosts.length + 1,
    title: title.trim(),
    content: content.trim(),
    author: author ? author.trim() : "Anonymous",
    category: category ? category.trim() : "General"
  };

  return await postRepository.addPost(newPost);
}