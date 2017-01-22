// Home Route

var router = require('express').Router();
var homeController = require('../controllers/homeController');

router
    .route('/')
    .get(homeController);

module.exports = router;