const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const passport = require('passport')

// Post model
const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
// validation
const validatePostInput = require('../../validation/post')

// @route     Get api/posts/test
// @desc      Tests posts route
// @access    Public
router.get('/test', (req,res) => res.json({
    msg: "Posts working"
}))

// @route     Get api/posts
// @desc      Get post
// @access    Public
router.get('/', (req,res) => {
    Post.find()
    .sort({ date: -1})
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json(err))
})

// @route     Get api/posts/:id
// @desc      Get post by id
// @access    Public
router.get('/:id', (req,res) => {
    Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json(err))
})


// @route     Post api/posts
// @desc      Create post
// @access    Private
router.post('/', passport.authenticate('jwt', {session: false}), (req,res) => {
    const {errors, isValid} = validatePostInput(req.body);

    if(!isValid){
        return res.status(400).json(errors)
    }
    
    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    })

    newPost.save().then(post => res.json(post))
})

// @route     Delete api/posts
// @desc      Delete post
// @access    Private
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req,res) => {
    Profile.findOne({user: req.user.id})
    .then(profile => {
        Post.findById(req.params.id)
        .then(post => {
            if(post.user.toString() !== req.user.id){
                return res.status(401).json({notAllowed: 'User not authorised'})
            }

            // delete
            post.remove().then(() => res.json({success: true}))
        })
        .catch(err => res.status(404).json({ postNotfound: 'no such posts dear'}))
    })
    .catch(err => res.status(404).json(err))
})

// @route     post api/posts/like/:id
// @desc      Like post
// @access    Private
router.post('/like/:id', passport.authenticate('jwt', {session: false}), (req,res) => {
    Profile.findOne({user: req.user.id})
    .then(profile => {
        Post.findById(req.params.id)
        .then(post => {
          if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({alreadyLiked: 'User already liked this post'})
          }

        //   add user id to likes array
        post.likes.unshift({user: req.user.id})

        post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({ postNotfound: 'no such posts dear'}))
    })
    .catch(err => res.status(404).json(err))
})

// @route     post api/posts/unlike/:id
// @desc      Unlike post
// @access    Private
router.post('/unlike/:id', passport.authenticate('jwt', {session: false}), (req,res) => {
    Profile.findOne({user: req.user.id})
    .then(profile => {
        Post.findById(req.params.id)
        .then(post => {
          if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
            return res.status(400).json({alreadyLiked: 'User have not liked this post'})
          }

        //   remove user id from likes array
          const removeIndex = post.likes
          .map(item => item.user.toString())
          .indexOf(req.user.id);

          post.likes.splice(removeIndex, 1);

          post.save().then(post => res.json(post))
    })
        .catch(err => res.status(404).json({ postNotfound: 'no such posts dear'}))
    })
    .catch(err => res.status(404).json(err))
})

// @route     post api/posts/comment/:id
// @desc      Add comment to post
// @access    Private
router.post('/comment/:id', passport.authenticate('jwt',{session: false}), (req,res)=> {
    const {errors, isValid} = validatePostInput(req.body);

    if(!isValid){
        return res.status(400).json(errors)
    }
   
    Post.findById(req.params.id)
    .then(post => {
        const newComment = {
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.user.id
        }

        // add to comment array
        post.comment.unshift(newComment);

        // save
        post.save().then(post => res.json(post))
    }).catch(err => res.status(404).json(err))
})

// @route     Delete api/posts/comment/:id/:comment_id
// @desc      Delete comment from post
// @access    Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt',{session: false}), (req,res)=> {
   
    Post.findById(req.params.id)
    .then(post => {
        // check to see if comment exist
        if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0){
            return res.status(404).json({commentnotfound: 'No such comment exist'})
        }

        // get remove index
        const removeIndex = post.comments
        .map(item => item._id.toString())
        .indexOf(req.params.comment_id);

        // splice comment out of the array
        post.comment.splice(removeIndex, 1);

        post.save().then(post => res.json(post))
    }).catch(err => res.status(404).json(err))
})

module.exports = router;