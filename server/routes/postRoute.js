//Post Route

var router = require('express').Router();
var postController = require('../controllers/postController');

router
    .route('/')
    .get(postController.renderFormPost)
    .post(postController.createPost);

module.exports = router;