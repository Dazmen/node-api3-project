const express = require('express');
const router = express.Router();
const Posts = require('./postDb.js');

router.get('/', (req, res) => {
  Posts.get()
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Server could not process your request" })
    })
});

router.get('/:id', validatePostId, (req, res) => {
  const { id } = req.params;
  Posts.getById(id)
    .then(post => {
      res.status(200).json(post)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Server could not process your request" })
    })
});

router.delete('/:id', validatePostId, (req, res) => {
  const { id } = req.params;
  Posts.remove(id)
    .then(post => {
      res.status(200).json(post)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Server could not process your request" })
    })
});

router.put('/:id', validatePostId, validatePost, (req, res) => {
  const post = req.post;
  Posts.update(post.id, req.body)
    .then(editPost => {
      res.status(200).json(editPost)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Server could not process your request" })
    })
});

// custom middleware

function validatePostId(req, res, next) {
  const { id } = req.params;
  const post = Posts.getById(id)
  if(post){
    req.post = post;
    next();
  } else {
    res.status(404).json({ error: "No posts with this ID exist" })
  }
};

function validatePost(req, res, next) {
  const { id } = req.params;
  const body = req.body;
  if(body.text){
    req.body.user_id = id
    next();
  } else {
    res.status(400).json({ error: "missing required text field"})
  }
}

// function validatePost(req, res, next) {
//   const { id } = req.params;
//   const body = req.body;
//   const editPost = req.post
//   if(body.text){
//     req.body.user_id = editPost.user_id
//     next();
//   } else {
//     res.status(400).json({ error: "missing required text field"})
//   }
// }

module.exports = router;
