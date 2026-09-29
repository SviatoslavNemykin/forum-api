export interface CreatePostRequest {
  title: string;
  content: string;
  author: string;
}
export interface GetPostsQuery {
  category?: string;
  take?: string;
}