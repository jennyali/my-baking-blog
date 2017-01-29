// View Controller

var errorHelper = require('../util/errorHelper');
var Post = require('../models/postModel');
var Category = require('../models/categoriesModel');
var categories = require('../models/categoriesSeed');
var Promise = require('bluebird');
var _ = require('lodash');

// GET = Read (view/show ONLY 3 posts)
exports.homeRender = function(req, res) {

    Post
        .find({})
        .sort({created: 'desc'})
        .then( results => {
        
        var someResults = _.slice(results, 0, 5);

        res.render('main', {
            pageTitle: 'Home page', 
            homePage: true,
            foundPosts: someResults,
        });

    }).catch( err => {
        if (err) throw err;
    });
};

// GET = Read (view/find all posts)
exports.recipeIndexRender = function(req, res) {

    Post
        .find({})
        .sort({created: 'desc'})
        .then( results => {

        res.render('main', { 
            pageTitle: "Recipe Index",
            recipeIndexPage: true,
            foundPosts: results,
        });

    }).catch( err => {
        if (err) throw err;
    });
};

// GET = Read (view/find all posts)
exports.recipeIndexCategories = function(req, res) {

    Category.find({})
        .then(categories => {

            return Promise.map(categories, function(category) {

                return Post.find({category: category._id})
                    .lean()
                    .exec()
                    .then( posts => {

                        postsCropped = _.slice(posts, [0], [3]);
                  
                        category = category.toObject(); // turns into normal object
                        category.posts = posts; // adds a posts property to category object, equals the posts found
                        category.postsCropped = postsCropped;
                        return category; // this 'then' block finishes with these 'category object' results being sent back
                });
            });
        }).then( results => {

            console.log(results);

            res.render('main', { 
                pageTitle: "Recipe Index",
                recipeIndexPage: true,
                foundPosts: results,
            });
            
        });
};

// GET = Read (view/find all posts)
exports.recipeIndexPagi = function(req, res) {

    var perPage = 4;
    var currentPage = req.query.p;
    var page = (currentPage - 1);
    
    Post
        .find({})
        .skip(perPage * page)
        .limit(perPage)
        .sort({created: 'desc'})
        .exec(function(err, results) {

            Post.count().exec(function(err, count) {

                pagesQuantity = ((count / perPage) + 1);

                res.render('main', { 
                pageTitle: "Recipe Index",
                recipeIndexPage: true,
                foundPosts: results,
                page: currentPage,
                pages: pagesQuantity

            });
        });
    });
};

// GET = Read (view/show ONLY 1 post)
exports.viewPostRender = function(req, res) {
    
    var postId = req.params.id;

    Post.find({ _id: postId}).then( post => {

        res.render('main', {
            viewPostPage: true,
            foundPost: post[0],
        });

    }).catch( err => {
        if (err) throw err;
    });
};


exports.aboutRender = function(req, res) {

    res.render('main', {
        pageTitle: 'About Us',
        aboutPage: true,
    });
};