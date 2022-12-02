const Post = require("../models/Post");
const mongoose = require("mongoose");

class PostController {
    async createPost(data) {
        const newPost = new Post(data);
        return await newPost.save();
    }

    async getPosts(limit) {
        return await Post.find().limit(limit);
    }

    async getPostById(id) {
        console.log(id);
        return await Post.findById(id);
    }

    async updatePost(id, data) {
        console.log("check update data", data);
        const resonse = await Post.updateOne({_id: id}, {$set: data}, { overwrite: true });
        console.log("check update, ", resonse);
        if (resonse.modifiedCount > 0) {
            return this.getPostById(id);
        }

        return null;
    }

    async deletePostById(id) {
        const response = await Post.deleteOne({_id: id});
        return response;
    }
}

module.exports = new PostController();

