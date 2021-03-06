const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./models/post');
const mangoose = require('mongoose');

const app = express();

mangoose.connect("mongodb://localhost:27017/angulardb")
.then(() => {
  console.log("Connected to Db");
})
.catch(() => {
  console.log('Connection Failed');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) =>{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
    );
  next();
});

app.post("/api/posts",(req, res, next) => {
  const post = new Post ({
    title: req.body.title,
    content: req.body.content
  });
  post.save();
  res.status(201).json ({
    message: 'Posts Added Successfully'
  });
});

app.use("/api/posts",(req, res, next) => {
  const posts = [
    {
      id: "1",
      title: "1st Server-Side Post",
      content: "Coming from Server"
    },
    {
      id: "2",
      title: "2nd Server-Side Post",
      content: "Coming from Server"
    },
    {
      id: "3",
      title: "3rd Server-Side Post",
      content: "Coming from Server"
    }
  ];
  res.status(200).json ({
    message: 'Posts added successfully',
    posts: posts
  });
});

module.exports = app;
