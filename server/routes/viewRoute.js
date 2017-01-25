//View Route

var router = require('express').Router();
var postController = require('../controllers/postController');
var viewController = require('../controllers/viewController');

router
    .route('/')
    .get(viewController.postWrapper)
    .post(postController.createPost);

module.exports = router;