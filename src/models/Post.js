const mongoose = require("mongoose");
const postsSchema = {
    title: String,
    description: String,
    content: String,
    images: Array,
    avatar: String
};

const Post = mongoose.model("posts", postsSchema);
module.exports = Post;