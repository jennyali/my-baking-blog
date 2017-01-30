// Post Manage Contoller
//---------------------------------
var errorHelper = require('../util/errorHelper');
var Post = require('../models/postModel');
var Category = require('../models/categoriesModel');
var categorySeed = require('../models/categoriesSeed');
var _ = require('lodash');
var Promise = require('bluebird')

// GET to render inital page / Uses the 'findAllPosts' function
exports.pageRender = function(req, res) {

    if(req.query.delete) {

        categorySeed
            .allCategoriesWithPosts()
            .then( results => {

            res.render('postEditor', { 
                pageTitle: "Post Editor",
                hasAllPosts: true,
                hasCreateBtn: true,
                foundPosts: results,
                alertMsg: req.query.alertMsg,
                delete: true
            });

        }).catch( err => {
            if (err) throw err;
        });

    } else if(req.query.update) {

        categorySeed
            .allCategoriesWithPosts()
            .then( results => {

            res.render('postEditor', { 
                pageTitle: "Post Editor",
                hasAllPosts: true,
                hasCreateBtn: true,
                foundPosts: results,
                alertMsg: req.query.alertMsg,
                update: true
            });

        }).catch( err => {
            if (err) throw err;
        });

    } else if(req.query.success) {

        categorySeed
            .allCategoriesWithPosts()
            .then( results => {

            res.render('postEditor', { 
                pageTitle: "Post Editor",
                hasAllPosts: true,
                hasCreateBtn: true,
                foundPosts: results,
                alertMsg: req.query.alertMsg,
                success: true
            });

        }).catch( err => {
            if (err) throw err;
        });
    
    } else {

        categorySeed
            .allCategoriesWithPosts()
            .then( results => {

                res.render('postEditor', { 
                    pageTitle: "Post Editor",
                    hasAllPosts: true,
                    hasCreateBtn: true,
                    foundPosts: results,
                });

            }).catch( err => {
                if (err) throw err;
        });
    }
};

//GET = render the page for different categories to load into
exports.adminCategoryRender = function(req, res) {
 
    categorySeed
        .oneCategoryWithPosts(req)
        .then( results => {

            res.render('postEditor', { 
                pageTitle: "Post Editor",
                hasViewCategory: true,
                foundPosts: results[0],
        });
    });
};

// GET = different Rendering for the Create route/page, uses category model
exports.formRender = function(req, res) {

    if(!req.params.id) {
        
        categorySeed
            .categoryList()
            .then(function(results) {

                res.render('postEditor', { 
                    pageTitle: "Create Post",
                    hasForm: true,
                    categories: results,
                });

            }).catch(function(err) {
                if (err) throw err;
        });

    } else {

        var postId = req.params.id;

        categorySeed
            .categoryList()
            .then(function(results) {

                return Post.findById(postId)
                    .exec()
                    .then(post => {

                        res.render('postEditor', { 
                            pageTitle: "Edit Post",
                            hasForm: true,
                            categories: results,
                            prefill: {
                                title: post.title,
                                body: post.body
                            }
                        });

                    });

            }).catch(function(err) {
                if (err) throw err;
        });
    }
};

// POST = Create
exports.createPost = function(req, res) {

    var postEntry = new Post({
        title: req.body.title,
        category: req.body.category,
        body: req.body.body,
    });

    postEntry
        .save()
        .then( post => {

            var message = post.title;
            console.log('CREATED POST: ' + post.title);
            res.redirect(301, '/post-editor?success=true&alertMsg=' + message);

        })
        .catch( err => {
            var error = err;

            if(err.name === 'ValidationError') {
                // This is to check the type of error being given back. (error.name)
                error = errorHelper(err);
            }

            categorySeed
                .categoryList()
                .then(function(results) {

                    res.render('postEditor', { 
                        pageTitle: "Create Post",
                        hasForm: true,
                        categories: results,
                        failed: true,
                        prefill: {
                            title: req.body.title,
                            body: req.body.body
                        },
                        errors: error
                    });
                })
                .catch( err => {
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



//GET = Render view post page using req.params.id
exports.viewPost = function(req, res) {

    var postId = req.params.id;

    Post.findById(postId).then( post => {

        if(!post) {

            console.log('no post with given id number found');

        } else {

            res.render('postEditor', { 
                pageTitle: "Post Editor",
                hasViewPost: true,
                foundPost: post,
            });
        }
    }).catch( err => {
        if (err) throw err;
    });

};


// POST = Using information from url and browser body, function updates post with new strings.
exports.editPost = function(req, res) {

    var postId = req.params.id;

    Post.findByIdAndUpdate(postId, {

        title: req.body.title,
        category: req.body.category,
        body: req.body.body,
        updated: new Date()

    }).then( function(post) {

        var message = post.title;

        console.log('CREATED POST: ' + post.title);

        res.redirect(301, '/post-editor?update=true&alertMsg=' + message);

    }).catch( err => {
        if (err) throw err;
    });
};

// GET = find by id and delete post
exports.deletePost = function(req, res) { // TRY REDIRECTING WITH  QUERY STRING WITH TITLE, ALERT, ALERTmsg

    var postId = req.params.id;

    Post.findByIdAndRemove(postId).then( post => {

        var message =  post.title;

        console.log('DELETED POST: ' + post.title);

        res.redirect(301, '/post-editor?delete=true&alertMsg=' + message);

    }).catch( err => {
        if (err) throw err;
    });
};

