const express = require('express');

const Post = require('./postDb')
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.get()
    if (posts.length) {
      return res.status(200).json({ message: 'Ok', posts})
    } else {
      next({statusCode: 500})
    }
  } catch (error) {
    next({statusCode: 500})
  }
});

router.get('/:id', validatePostId, (req, res) => {
  const { post } = req.body
  return res.status(200).json({ message: 'OK', post})
});

router.delete('/:id', validatePostId, async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Post.remove(id);
    if (deleted) {
      return res.status(200).json({ message: "Post deleted"})
    } else {
       next({statusCode: 500})
    }
  } catch (error) {
    next({statusCode: 500})
  }
});

router.put('/:id',  validatePostId, async (req, res, next) => {
 try {
   const { id } = req.params
   const { text, post } = req.body
   if (!text ) {
     next({statusCode: 400, message: 'missing requires text field'})
   }  else {
       const updated = await Post.update(id, { text, user_id: post.user_id})
       if (updated) {
         return res.status(200).json({message: 'Post updated successfully'})
       } else {
        next({statusCode: 500})
       }
     }
 } catch (error) {
  next({statusCode: 500})
 }
});

// custom middleware

async function validatePostId(req, res, next) {
  const { id } = req.params;
  if(!id || !Number(id)) {
    next({statusCode: 400, message:"invalid post id" })
  } else {
    const post = await Post.getById(id);
    if (post) {
      req.body.post = post;
      next()
    } else {
      next({statusCode: 400, message:"invalid post id"})
    }
  }
};

module.exports = {
  router
}