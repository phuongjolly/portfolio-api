const Post = require("../models/Post");
const mongoose = require("mongoose");

class PostController {
    async createPost(data) {
        const newPost = new Post(data);
        return await newPost.save();
    }

    async getPosts() {
        return await Post.find();
    }

    async getPostById(id) {
        console.log(id);
        return await Post.findById(id);
    }

    async updatePost(id, data) {
        const resonse = await Post.updateOne({_id: id}, {$set: data}, { overwrite: true });
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

