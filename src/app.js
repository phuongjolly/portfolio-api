const express = require('express')
const bodyParse = require("body-parser");
const mongoose = require("mongoose");
const PostController = require("./controllers/PostController");
const app = express()
const port = 5000;

app.use(bodyParse.urlencoded({
    extended: true
}));

app.use(bodyParse.json());

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/portfolio");


app.get('/', (req, res) => {
    res.send("Hello world");
});

app.post('/posts', async (req, res) => {
    const { title, description, content } = req.body;
    const response = await PostController.createPost({ title, description, content });
    res.send(response);
});

app.put('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    console.log("check data", data);
    const response = await PostController.updatePost(id, data);
    res.send(response);
})

app.get('/posts',async (req, res) => {
    const response = await PostController.getPosts();
    console.log("getting ", response);
    if (!response) {
        res.send("error");
    } else {
        res.send(response);
    }
});

app.get('/posts/:id', async (req, res) => {
    const {id} = req.params;
    const response = await PostController.getPostById(id);
    if (!response) {
        res.send(404, "Not Found");
    } else {
        res.send(response);
    }
});

app.delete('/posts/:id', async (req, res) => {
    console.log("hello....");
    const { id } = req.params;
    console.log("check id before delete ", id);
    const response = await PostController.deletePostById(id);
    res.send(response);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})