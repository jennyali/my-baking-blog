// Post Controller
//---------------------------------
var errorHelper = require('../util/errorHelper');
var postSchema = require('../models/postModel');

// GET = Render this page
exports.renderFormPost = function(req, res) {
    res.render('formPost', { pageTitle: "Create Post" });

};


// POST = Create
exports.createPost = function(req, res) {

    var entry = new postSchema({
        title: req.body.title,
        body: req.body.body,
    });

    entry.save(function(err) {
        if(err) {

            var validation = errorHelper(err);
            validation.failed = true;
            validation.pageTitle = "Create Post";
            
            console.log(validation);

            res.render('formPost', validation);

        } else {
            res.render('formPost', { pageTitle: "Create Post", success: true });
        }
    });

};