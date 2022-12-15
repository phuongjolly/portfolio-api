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
        return await Post.findById(id);
    }

    async getNextPost(id) {
        const post = await Post.findOne({ _id: { $gt: id}}).sort({_id: 1});
        return post?._id;
    }

    async getPreviousPost(id) {
        const post = await Post.findOne({ _id: { $lt: id}}).sort({_id: -1});
        return post?._id;
    }

    async updatePost(id, data) {
        const resonse = await Post.updateOne({_id: id}, {$set: data}, { overwrite: true });
        return this.getPostById(id);
    }

    async deletePostById(id) {
        const response = await Post.deleteOne({_id: id});
        return response;
    }
}

module.exports = new PostController();

