// Post Controller
//---------------------------------
var errorHelper = require('../util/errorHelper');
var Post = require('../models/postModel');
var _ = require('lodash');

// GET = Render this page
exports.renderFormPost = function(req, res) {

    res.render('formPost', { 
        pageTitle: "Create Post",
        hasForm: true
    });

};


// POST = Create
exports.createPost = function(req, res) {

    var entry = new Post({
        title: req.body.title,
        body: req.body.body,
    });

    entry.save(function(err) {
        if(err) {

            var validation = errorHelper(err);
       
            res.render('formPost', {
                pageTitle: "Create Post",
                failed: true,
                hasForm: true,
                prefillTitle: req.body.title,
                prefillBody: req.body.body,
                errors: validation
            });

        } else {
            res.redirect(301, '/viewAllPosts');
        }
    });

};

// GET = Read (view/find all posts)
exports.findAllPosts = function(req, res) {

    Post.find({}, function(err, results) {
        if (err) throw err;

        //console.log(results);

        res.render('formPost', { 
            pageTitle: "All Recipes",
            hasForm: false, 
            hasAllPosts: true,
            foundPosts: results
        });
    });
};

// GET = Read (view/show ONLY several posts)
exports.findSomePosts = function(req, res) {

    Post.find({}, function(err, results) {
        if (err) throw err;

        var someResults = _.slice(results, 0, 3);

        res.render('home', { 
            foundPosts: someResults
        });
    });
}

// GET = Render Edit page linked to :id given
exports.editPost = function(req, res) {
    var postId = req.params.id;

    Post.findById(postId, function(err, post) {
        if (err) throw err;

        res.render('formPost', { 
            pageTitle: "Edit Post",
            hasPrefilledForm: true,
            editPost: post
        });
    });
};

// POST = Using information from url and browser body, function updates post with new strings.
exports.updatePost = function(req, res) {

    var postId = req.params.id;

    Post.findByIdAndUpdate(postId, {
         title: req.body.title,
         body: req.body.body,
         updated: new Date()
    }, function(err, post) {
        
        if (err) throw err;

        //console.log(post);
        res.redirect(301, '/viewAllPosts');
    });  
};

// GET = find by id and delete post
exports.deletePost = function(req, res) {
    var postId = req.params.id;

    Post.findByIdAndRemove(postId, function(err) {
        if (err) throw err;

        console.log('post deleted');
        res.redirect(301, '/viewAllPosts');
    });
};