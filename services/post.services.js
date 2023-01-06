const createError = require("http-errors");
const prisma = require("../lib/prisma");

class PostService {
  static async create(data) {
    const newPost = await prisma.post.create({
      data
    });
    if (!newPost) {
      throw createError.BadRequest("Could not create post");
    }
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
    if (!updatedPost) throw createError.NotFound("No Post with that id");
    return;
  }
  static async delete(data) {
    const post = await prisma.post.delete({
      where: {
        postId: data.postId
      }
    });
    if (!post) throw createError.NotFound("Post does not exist");
    return post;
  }
  static async all(user) {
    const allPosts = await prisma.post.findMany({
      include: {
        carer: true
      }
    });
    return allPosts;
  }
}

module.exports = PostService;