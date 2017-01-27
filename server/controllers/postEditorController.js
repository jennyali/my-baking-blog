// Post Manage Contoller
//---------------------------------
var errorHelper = require('../util/errorHelper');
var Post = require('../models/postModel');
var _ = require('lodash');

// GET to render inital page / Uses the 'findAllPosts' function
exports.pageRender = function(req, res) {

    Post
        .find({})
        .sort({created: 'desc'})
        .then( results => {

        res.render('postEditor', { 
            pageTitle: "Post Editor",
            hasForm: true,
            hasAllPosts: true,
            foundPosts: results,
        });

    }).catch( err => {
        if (err) throw err;
    });
};


// POST = Create
exports.createPost = function(req, res) {

    var entry = new Post({
        title: req.body.title,
        category: req.body.category,
        body: req.body.body,
    });

    entry.save().then( post => { //Newly saved object would go into this functions parameters.

        var alertMsg = post.title;

        console.log('CREATED POST: ' + post.title);

        Post.find({}).then( results => {

            res.render('postEditor', { 
                pageTitle: "Post Editor",
                hasForm: true,
                hasAllPosts: true,
                foundPosts: results,
                success: true,
                alertMsg: alertMsg
            });

            }).catch( err => {
                if (err) throw err;
            });
        
        }).catch( err => {
            var error = err;

            if(err.name === 'ValidationError') {
                // This is to check the type of error being given back. (error.name)
                error = errorHelper(err);
            }

            Post.find({}).then( results => {
                // repeats the renderPage function to validate the form and render the recipe index.
                res.render('postEditor', { 
                    pageTitle: "Post Editor",
                    hasForm: true,
                    hasAllPosts: true,
                    foundPosts: results,
                    failed: true,
                    prefillTitle: req.body.title,
                    prefillBody: req.body.body,
                    errors: error
                });

                }).catch( err => {
                    if (err) throw err;
        });
    });
};

// GET = Read (view/find all posts)
exports.findAllPosts = function(req, res) {

    Post.find({}).then( results => {

        res.render('postWrapper', { 
            pageTitle: "All Recipes",
            hasForm: false, 
            hasAllPosts: true,
            foundPosts: results,
        });

    }).catch( err => {

        if (err) throw err;

    });
};


// GET = Read (view/show ONLY 3 posts)
exports.findSomePosts = function(req, res) {

    Post.find({}).then( results => {
        
        var someResults = _.slice(results, 0, 3);

        res.render('home', { 
            foundPosts: someResults
        });

    }).catch( err => {

        if (err) throw err;

    });
};

// GET = Read (view/show ONLY 1 post)
exports.findOnePost = function(req, res) {

    var postId = req.params.id;

    Post.find({ _id: postId}).then( post => {

        res.render('postWrapper', {
            pageTitle: post[0].title,
            hasViewPost: true,
            foundPost: post[0]
        });

    }).catch( err => {

        if (err) throw err;

    });
};

// GET = Render Edit page linked to :id given
exports.editPost = function(req, res) {

    var postId = req.params.id;

    Post.findById(postId).then( post => {

        if(!post) {

            console.log('no post with given id number found');

        } else {

            res.render('postEditor', { 
                pageTitle: "Post Editor",
                hasPrefilledForm: true,
                hasViewPost: true,
                foundPost: post,
                editPost: post,
            });
        }
    }).catch( err => {
        if (err) throw err;
    });
};

// POST = Using information from url and browser body, function updates post with new strings.
exports.updatePost = function(req, res) {

    var postId = req.params.id;

    Post.findByIdAndUpdate(postId, {

        title: req.body.title,
        category: req.body.category,
        body: req.body.body,
        updated: new Date()

    }).then( function(post) {

        var alertMsg = post.title;

        console.log('CREATED POST: ' + post.title);

        Post.find({}).then( results => {

            res.render('postEditor', { 
                pageTitle: "Post Editor",
                hasForm: true,
                hasAllPosts: true,
                foundPosts: results,
                update: true,
                alertMsg: alertMsg
        });

        }).catch( err => {
            if (err) throw err;
        });
    });
};

// GET = find by id and delete post
exports.deletePost = function(req, res) { // TRY REDIRECTING WITH  QUERY STRING WITH TITLE, ALERT, ALERTmsg

    var postId = req.params.id;

    Post.findByIdAndRemove(postId).then( post => {

        var alertMsg =  post.title;

        console.log('DELETED POST: ' + post.title);

        Post.find({}).then( results => {

            res.render('postEditor', { 
                pageTitle: "Post Editor",
                hasForm: true,
                hasAllPosts: true,
                foundPosts: results,
                delete: true,
                alertMsg: alertMsg
            });

            }).catch( err => {
                if (err) throw err;
            });

    }).catch( err => {
        if (err) throw err;
    });
};

