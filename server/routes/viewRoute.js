// View Route

var router = require('express').Router();
//var viewPageController = require('../controllers/viewPageController');
var postController = require('../controllers/postController');


router
    .route('/')
    .get(postController.findAllPosts);

router
    .route('/editPost/:id')
    .get(postController.editPost)
    .post(postController.updatePost);

router
    .route('/deletePost/:id')
    .get(postController.deletePost);

module.exports = router;