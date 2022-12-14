const express = require('express')
const bodyParse = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const PostController = require("./controllers/PostController");
const Authentication = require("./controllers/Authentication");
const S3Controller = require("./controllers/S3Controller");

const app = express()
const port = 5000;
const jwtKey = process.env.MY_SECRET_KEY || "phuongjolly_blog";
const jwtExpirySeconds = 30 * 24 * 60 * 60;
dotenv.config();

console.log("dotenv", process.env);

app.use(bodyParse.urlencoded({
    extended: true
}));

app.use(bodyParse.json());
app.use(cookieParser())

app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/portfolio");

const authenticate = (req, res, next) => {
    const { token } = req.cookies;

    if (token) {
        try {
            const payload = jwt.verify(token, jwtKey);
            req.currentUser = payload.username;

        } catch (e) {
           console.log(e);
        }
    }

    next();
};

app.use(authenticate);

app.get('/', (req, res) => {
    res.send("Hello world");
});

app.post('/api/posts', async (req, res) => {
    const { currentUser } = req;
    if (!currentUser) {
        res.send(403);
    } else {
        const { title, description, content, avatar } = req.body;
        const response = await PostController.createPost({ title, description, content, avatar });
        res.send(response);
    }
});

app.put('/api/posts/:id', async (req, res) => {
    const { currentUser } = req;
    if (!currentUser) {
        res.send(403);
    } else {
        const {id} = req.params;
        const data = req.body;

        const response = await PostController.updatePost(id, data);
        res.send(response);
    }
})

app.get('/api/posts',async (req, res) => {
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

app.get('/api/posts/:id', async (req, res) => {
    const {id} = req.params;
    const response = await PostController.getPostById(id);
    if (!response) {
        res.send(404, "Not Found");
    } else {
        res.send(response);
    }
});

app.delete('/api/posts/:id', async (req, res) => {
    const { id } = req.params;
    const response = await PostController.deletePostById(id);
    res.send(response);
});

app.post("/api/users", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.send(401);
    }

    console.log("username and password", username, password);

    const response = await Authentication.createUser({ username, password });
    console.log("create new user", response);
    res.send(response);
});

app.post("/api/users/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await Authentication.login({ username, password });

    if (!user) {
        res.send(401);
    }

    const token = jwt.sign({ username: user.username }, jwtKey, {
        algorithm: "HS256",
        expiresIn: jwtExpirySeconds,
    });


    res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 });
    res.send(user);
});

app.get("/api/me", async(req, res) => {
    const { currentUser } = req;
    res.send({ currentUser });
})

app.post("/api/image/generateUrl", async (req, res) =>{
    const response = await S3Controller.generateURL();
    res.send(response);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})