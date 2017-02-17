// Login Route

var router = require('express').Router();
var loginController = require('../controllers/loginController');
var passport = require('passport');

router
    .route('/')
    .get(loginController.pageRender)
    .post(passport.authenticate('local', {
        successRedirect: '/post-editor',
        failureRedirect: '/login',
        failureFlash: true }));

module.exports = router;