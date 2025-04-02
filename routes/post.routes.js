const router = require('express').Router();
const postController = require('../controllers/post.controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


// dossier de destination pour les images
router.get('/', postController.readPost); // get all posts
router.post('/',upload.single('file'), postController.createPost); // create a post
router.put('/:id', postController.updatePost); // update a post
router.delete('/:id', postController.deletePost); // delete a post
router.patch('/like-post/:id', postController.likePost); // like a post
router.patch('/unlike-post/:id', postController.unlikePost); // unlike a post
// gestion des commentaires
router.patch('/comment-post/:id', postController.commentPost); // comment a post
router.patch('/edit-comment-post/:id', postController.editCommentPost); // edit a comment
router.patch('/delete-comment-post/:id', postController.deleteCommentPost); // delete a comment

 module.exports = router;
        