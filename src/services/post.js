import * as postRepository from "../repositories/post.js";

export async function getPosts(category, take) {
  return postRepository.getAll(category, take);
}

export async function getPostById(id) {
  return postRepository.getById(id);
}

export async function createPost(data) {
  const { title, content, author, category } = data;
  const allPosts = postRepository.getAll();
  
  const newPost = {
    id: allPosts.length + 1,
    title: title.trim(),
    content: content.trim(),
    author: author ? author.trim() : "Anonymous",
    category: category ? category.trim() : "General"
  };

  return await postRepository.addPost(newPost);
}