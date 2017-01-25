// Post Route

var router = require('express').Router();
var postController = require('../controllers/postController');
var viewController = require('../controllers/viewController');


router
    .route('/')
    .get(postController.findAllPosts);

router
    .route('/:id')
    .get(postController.findOnePost);

router
    .route('/editPost/:id')
    .get(postController.editPost)
    .post(postController.updatePost);

router
    .route('/deletePost/:id')
    .get(postController.deletePost);

module.exports = router;