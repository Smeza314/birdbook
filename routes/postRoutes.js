const router = require('express').Router()
const { Post, User } = require('../models')
const passport = require('passport')

router.get('/posts', passport.authenticate('jwt'), (req, res) => {
  Post.find({})
    .populate('author')
    .populate('likes')
    .populate('comments')
    .then(posts => res.json(posts))
    .catch(err => console.log(err))
})

router.post('/posts', passport.authenticate('jwt'), (req, res) => {
  Post.create({
    post_content: req.body.post_content,
    author: req.user._id,
    post_image: req.body.post_image,
    post_imageName: req.body.post_imageName,
    post_date: Date.now()
  })
    .then(post => {
      User.findByIdAndUpdate(req.user._id, { $push: { posts: post._id } })
        .then(() => {
          res.json({
            _id: post._id,
            post_content: post.post_content,
            author: req.user,
            post_image: post.post_image,
            post_imageName: post.post_imageName,
            post_date: post.post_date
          })
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

router.put('/posts/likes/:id', passport.authenticate('jwt'), (req, res) => {
  Post.findByIdAndUpdate(req.params.id, { $addToSet: { likes: req.user._id } })
    .then(() => {
      res.sendStatus(200)
    })
    .catch(err => console.log(err))
})

module.exports = router
