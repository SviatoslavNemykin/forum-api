import type { PostResponse } from '../transport/dto/post/responses.js';

let posts: PostResponse[] = [
  {
    id: 1,
    title: "кнкннк 300",
    content: "вава123 фівфів32",
    author: "авп444",
    category: "programming"
  },
  {
    id: 2,
    title: "фыв321 ааа",
    content: "ккк999 йцуйцу300",
    author: "іва888",
    category: "programming"
  },
  {
    id: 3,
    title: "йцу300 вава",
    content: "ооо555 кнкннк111",
    author: "фыв777",
    category: "programming"
  }
];

export function getAll(category?: string, take?: number): PostResponse[] {
  let result: PostResponse[] = posts;

  if (category) {
    result = result.filter(
      (post: PostResponse) => post.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (take !== undefined && take > 0) {
    result = result.slice(0, take);
  }

  return result;
}

export function getById(id: number): PostResponse | undefined {
  return posts.find((post: PostResponse) => post.id === id);
}

export async function addPost(newPost: PostResponse): Promise<PostResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      posts = [...posts, newPost];
      resolve(newPost);
    }, 500);
  });
}