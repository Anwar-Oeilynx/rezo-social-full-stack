const   router = require('express').Router();
 const postController = require('../controllers/post.controller');

router.get('/', postController.readPost); // get all posts
router.post('/', postController.createPost); // create a post
router.put('/:id', postController.updatePost); // update a post
router.delete('/:id', postController.deletePost); // delete a post
router.patch('/like-post/:id', postController.likePost); // like a post
router.patch('/unlike-post/:id', postController.unlikePost); // unlike a post

 module.exports = router;
        