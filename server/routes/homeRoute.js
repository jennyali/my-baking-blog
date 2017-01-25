// Home Route

var router = require('express').Router();
var viewController = require('../controllers/viewController');
var postController = require('../controllers/postController');

router
    .route('/')
    .get(postController.findSomePosts);

module.exports = router;