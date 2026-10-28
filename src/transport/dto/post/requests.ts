export interface CreatePostRequest {
  title: string;
  content: string;
  categoryId: number;
  authorId: number;
}

export interface GetPostsQuery {
  category?: string;
  take?: string;
}