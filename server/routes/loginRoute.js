// Login Route

var router = require('express').Router();
var loginController = require('../controllers/loginController');

router
    .route('/')
    .get(loginController.pageRender);

module.exports = router;