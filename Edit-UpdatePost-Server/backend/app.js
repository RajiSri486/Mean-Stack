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
    "GET, POST, PUT, DELETE, OPTIONS"
    );
  next();
});

app.post("/api/posts",(req, res, next) => {
  const post = new Post ({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json ({
      message: 'Posts Added Successfully',
      postId: createdPost._id
    });
  });
});

app.put("/api/posts/:id",(req, res, next) => {
  const post = new Post ({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({ _id:req.params.id}, post).then(result => {
    res.status(200).json({ message: "Post Updated Successfully"});
  });
});

app.get("/api/posts",(req, res, next) => {
  Post.find().then( documents => {
    res.status(200).json ({
      message: 'Posts added successfully',
      posts: documents
    });
  });
});

app.get("/api/posts/:id",(req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post Not Found" });
    }
  });
});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Post Deleted' });
  });
});

module.exports = app;
