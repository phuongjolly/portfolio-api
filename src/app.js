const express = require('express')
const bodyParse = require("body-parser");
const mongoose = require("mongoose");
const PostController = require("./controllers/PostController");
const Authentication = require("./controllers/Authentication");
const jwt = require("jsonwebtoken");

const app = express()
const port = 5000;
const jwtKey = process.env.MY_SECRET_KEY || "phuongjolly_blog";
const jwtExpirySeconds = 300;

app.use(bodyParse.urlencoded({
    extended: true
}));

app.use(bodyParse.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/portfolio");


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
    const { limit } = req.query || 10;

    console.log("get limit ", limit);
    const response = await PostController.getPosts(limit);
    console.log(response);
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
    const { id } = req.params;
    const response = await PostController.deletePostById(id);
    res.send(response);
});

app.post("/users", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.send(401);
    }

    console.log("username and password", username, password);

    const response = await Authentication.createUser({ username, password });
    console.log("create new user", response);
    res.send(response);
});

app.post("/users/login", async (req, res) => {
    const { username, password } = req.body;
    const user = Authentication.login({ username, password });

    if (!user) {
        res.send(401);
    }

    const token = jwt.sign({ username: user.username }, jwtKey, {
        algorithm: "HS256",
        expiresIn: jwtExpirySeconds,
    });

    console.log(token);
    res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 });
    res.send(user);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})