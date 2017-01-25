// Post Controller
//---------------------------------
var errorHelper = require('../util/errorHelper');
var Post = require('../models/postModel');
var _ = require('lodash');


// POST = Create
exports.createPost = (req, res) => {

    var entry = new Post({
        title: req.body.title,
        body: req.body.body,
    });

    entry.save().then( post => { //Newly saved object would go into this functions parameters.

        console.log('created' + post.title);
        res.redirect(301, '/viewAllPosts/?success=true');

        }).catch( err => {
            var error = err;

            if(err.name === 'ValidationError') {
                // This is to check the type of error being given back. (error.name)
                error = errorHelper(err);
            }
        
            res.render('postWrapper', {
                pageTitle: "Create Post",
                failed: true,
                hasForm: true,
                prefillTitle: req.body.title,
                prefillBody: req.body.body,
                errors: error
        });
    });
};

// GET = Read (view/find all posts)
exports.findAllPosts = (req, res) => {

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

// GET = Read (view/find all posts) AND display a div that alerts the user to a previous action
exports.findAllPostsWithAlert = (req, res) => {

    alertMsg = req.query;

    Post.find({}).then( results => {

        res.render('postWrapper', { 
            pageTitle: "All Recipes",
            hasForm: false, 
            hasAllPosts: true,
            foundPosts: results,
            alert: alertMsg
        });

    }).catch( err => {

        if (err) throw err;

    });
};

// GET = Read (view/show ONLY 3 posts)
exports.findSomePosts = (req, res) => {

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
exports.findOnePost = (req, res) => {

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
exports.editPost = (req, res) => {

    var postId = req.params.id;

    Post.findById(postId).then( post => {

        if(!post) {

            console.log('no post with given id number found');

        } else {

            res.render('postWrapper', { 
                pageTitle: "Edit Post",
                hasPrefilledForm: true,
                editPost: post,
            });
        }
    }).catch( err => {

        if (err) throw err;

    });
};

// POST = Using information from url and browser body, function updates post with new strings.
exports.updatePost = (req, res) => {

    var postId = req.params.id;

    Post.findByIdAndUpdate(postId, {

        title: req.body.title,
        body: req.body.body,
        updated: new Date()

    }).then( post => {

        console.log('UPDATED POST: ' + post.title);
        res.redirect(301, '/viewAllPosts/?update=true');

    }).catch( err => {

        if (err) throw err;

    });
};

// GET = find by id and delete post
exports.deletePost = (req, res) => {

    var postId = req.params.id;

    Post.findByIdAndRemove(postId).then( post => {

        console.log('DELETED POST: ' + post.title);
        res.redirect(301, '/viewAllPosts/?delete=true');

    }).catch( err => {

        if (err) throw err;

    });
};

