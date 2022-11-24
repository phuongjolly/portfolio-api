const Post = require("../models/Post");

class PostController {
    async getPosts() {
        const response = await Post.find();
        console.log(response);
        return response;
    }
}

module.exports = new PostController();

