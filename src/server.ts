import express from 'express';
import postRouter from './transport/routers/post.js';

const app = express();
app.use(express.json());

app.use('/posts', postRouter);

const HOST = 'localhost';
const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});