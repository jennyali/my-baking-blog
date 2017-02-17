// Login Controller 

var errorHelper = require('../util/errorHelper');
var Post = require('../models/postModel');
var Category = require('../models/categoriesModel');
var User = require('../models/userModel');
var categoryHelper = require('../helpers/categoryHelpers');
var Promise = require('bluebird');
var _ = require('lodash');

/*==========================

            GET

=============================*/

// GET = to render the login page

exports.pageRender = function(req, res, next) {
    res.render('postEditor', {
        hasLogin: true,
        message: req.flash('message')
    });
};




/*==========================

            POST

=============================*/