import Post from "../models/Post";

const getPost = async (currentPage: number, postsPerPage: number) => {
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  // Consultar las publicaciones con paginación
  const posts = await Post.find()
    .populate("author", ["username"])
    .populate("tag", ["title"])
    .sort({ createdAt: -1 })
    .skip(indexOfFirstPost)
    .limit(postsPerPage);

  // Contar el total de publicaciones en la base de datos para calcular el total de páginas
  const totalPosts = await Post.countDocuments();
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return { posts, totalPages };
};

const getAllPostsService = async () => {
  try {
    const posts = await Post.find()
      .populate("author", ["username"])
      .populate("tag", ["title"])
      .sort({ createdAt: -1 });

    return posts;
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener las publicaciones.");
  }
};

export { getPost, getAllPostsService };
