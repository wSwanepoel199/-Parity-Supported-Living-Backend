const createError = require("http-errors");
const prisma = require("../lib/prisma");

class PostService {
  static async create(data) {
    console.log(data);
    const newPost = await prisma.post.create({
      data
    });
    if (!newPost) return createError.BadRequest("Could not create post");
    return;
  }
  static async update(data) {
    for (let key of ["carer", "createdAt", "updatedAt"]) {
      delete data[key];
    }
    const updatedPost = await prisma.post.update({
      where: {
        postId: data.postId
      },
      data
    });
    if (!updatedPost) return createError.NotFound("No Post with that id");
    return;
  }
  static async remove(data) {
    const post = await prisma.post.findUnique({
      where: {
        id: data.id
      }
    });
    if (post) {
      await prisma.post.delete({
        where: {
          id: data.id
        }
      });
    }
    return;
  }
  static async all() {
    const allPosts = await prisma.post.findMany({
      include: {
        carer: true
      }
    });
    return allPosts;
  }
}

module.exports = PostService;