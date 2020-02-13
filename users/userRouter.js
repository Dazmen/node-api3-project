const express = require('express');
const router = express.Router();
const Users = require('./userDb.js');
const Posts = require('../posts/postDb.js');

router.post('/', validateUser, (req, res) => {
  const user = req.body;
  Users.insert(user)
    .then(newUser => {
      res.status(201).json(newUser)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "Server could not process your request" })
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const post = req.body;
  Posts.insert(post)
    .then(newPost => {
      res.status(201).json(newPost)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Server could not process your request" })
    })

});

router.get('/', (req, res) => {
  Users.get()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "server could not process your request" })
    })
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const user = req.user;
  Users.getUserPosts(user.id)
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Server could not process your request" })
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  const user = req.user;
  Users.remove(user.id)
    .then(delUser => {
      res.status(200).json(delUser)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Server could not process your request" })
    })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  const user = req.user;
  Users.update(user.id, req.body)
    .then(editUser => {
      res.status(200).json(editUser)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Server could not process your request" })
    })
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params
  Users.getById(id)
    .then(user => {
      if(user){
        req.user = user
        next();
      } else {
        res.status(404).json({ error: "invalid user id"})
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "user with this ID doesnt exist" })
    })
};

function validateUser(req, res, next) {
  const body = req.body;
  if(body.name){
    next();
  } else {
    res.status(400).json({ error: "Invalid User Information"})
  }
}

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

module.exports = router;
