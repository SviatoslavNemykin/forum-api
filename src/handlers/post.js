import * as postService from "../services/post.js";

export async function getPosts(req, res) {
  const category = req.query.category;
  const take = req.query.take;

  if (take !== undefined) {
    const takeNumber = Number(take);
    if (isNaN(takeNumber) || takeNumber <= 0) {
      return res.status(400).json({ message: "take must be a positive number" });
    }
  }

  const posts = await postService.getPosts(category, take);
  res.status(200).json(posts);
}

export async function getPostById(req, res) {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ message: "id must be a positive number" });
  }
  const post = await postService.getPostById(id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.status(200).json(post);
}

export async function createPost(req, res) {
  const { title, content } = req.body;
  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof content !== "string" ||
    !content.trim()
  ) {
    return res.status(422).json({
      message: "Title and content are required and must be valid strings"
    });
  }

  try {
    const result = await postService.createPost(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create post" });
  }
}