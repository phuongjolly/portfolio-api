const express = require('express')
const bodyParse = require("body-parser");
const mongoose = require("mongoose");
const PostController = require("./controllers/PostController");
const app = express()
const port = 5000;

app.use(bodyParse.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/portfolio");


app.get('/', (req, res) => {
    res.send("Hello world");
});

app.get('/posts',async (req, res) => {
    const response = await PostController.getPosts();
    if (!response) {
        res.send("error");
    } else {
        res.send(response);
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})