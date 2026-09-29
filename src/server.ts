import express from "express";
import { createPostRepository } from "./repositories/post.js";
import { createPostService } from "./services/post/post.js";
import { createPostHandlers } from "./transport/handlers/post.js";
import { createPostRouter } from "./transport/routers/post.js";

const postRepository = createPostRepository();
const postService = createPostService(postRepository);
const postHandler = createPostHandlers(postService);
const postRouter = createPostRouter(postHandler);

const app = express();

app.use(express.json());
app.use("/posts", postRouter);

app.listen(8000, () => {
  console.log("Server started on http://localhost:8000");
});