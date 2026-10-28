import type { Category } from "../category/entity.js";
import type { PublicUser } from "../user/entity.js";

export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  categoryId: number;
  category?: Category;
  authorId: number;
  author?: PublicUser;
}