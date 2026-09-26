let posts = [
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

export function getAll(category, take) {
  let result = posts;

  if (category) {
    result = result.filter(
      (post) => post.category?.toLowerCase() === category.toLowerCase()
    );
  }

  if (take !== undefined) {
    const takeNumber = Number(take);
    if (!isNaN(takeNumber) && takeNumber > 0) {
      result = result.slice(0, takeNumber);
    }
  }

  return result;
}

export function getById(id) {
  return posts.find((post) => post.id === id);
}

export async function addPost(newPost) {
  return new Promise((resolve) => {
    setTimeout(() => {
      posts = [...posts, newPost];
      resolve(newPost);
    }, 500);
  });
}