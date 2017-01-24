// Home Route

var router = require('express').Router();
var homeController = require('../controllers/homeController');
var postController = require('../controllers/postController');

router
    .route('/')
    .get(postController.findSomePosts);

module.exports = router;