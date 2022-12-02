const mongoose = require("mongoose");
const usersSchema = {
    username: String,
    password: String,
};

const User = mongoose.model("users", usersSchema);
module.exports = User;