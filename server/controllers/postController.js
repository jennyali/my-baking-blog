// Post Controller
//---------------------------------
var errorHelper = require('../util/errorHelper');
var Post = require('../models/postModel');

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

            validation.failed = true;
            validation.pageTitle = "Create Post";
            validation.hasForm = true;

            // to prefill form fields when other fields are incorrect
            validation.prefillTitle = req.body.title;
            validation.prefillBody = req.body.body;
            
            console.log(validation);

            res.render('formPost', validation);

        } else {
            res.render('formPost', { 
                pageTitle: "Create Post",
                hasForm: true, 
                success: true 
            });
        }
    });

};

// GET = Read (view/find all posts)
exports.findAllPosts = function(req, res) {

    Post.find({}, function(err, results) {
        if (err) throw err;

        //console.log(results);

        res.render('formPost', { 
            pageTitle: "All Posts",
            hasForm: false, 
            hasAllPosts: true,
            foundPosts: results
        });
    });
};

//GET = Render Edit page linked to :id given
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