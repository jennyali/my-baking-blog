// View Controller

var errorHelper = require('../util/errorHelper');
var Post = require('../models/postModel');
var Category = require('../models/categoriesModel');
var categoryHelper = require('../helpers/categoryHelpers');
var Promise = require('bluebird');
var _ = require('lodash');
var fs = require('fs');
var imageFiles = fs.readdirSync('../my-baking-blog/public/images');


/*==========================

            GET

=============================*/

// GET = Read (view/show ONLY 5 posts)
exports.homeRender = function(req, res, next) {

    Post
        .find({})
        .sort({created: 'desc'})
        .then( results => {
            var someResults = _.slice(results, 0, 5);

            res.render('main', {
                pageTitle: 'Home page', 
                homePage: true,
                foundPosts: someResults,
                isAdmin: !!req.user,
                isHomePage: true,
            }
        );
    }).catch( err => {

        next(err);

    });
};

// GET = Read (view/show ONLY 5 posts)
exports.homeRenderPagi = function(req, res, next) {

    var perPage = 4;
    var currentPage = req.query.p || 1;
    var page = (currentPage - 1);
    
    Post
        .find({})
        .skip(perPage * page)
        .limit(perPage)
        .sort({updated: 'desc'})
        .exec()
        .then( results => {

            Post
                .count()
                .exec()
                .then( count => {


                pagesQuantity = ((count / perPage));
                pagesQuantity = Math.ceil(pagesQuantity);

                res.render('main', { 
                    pageTitle: 'Home page', 
                    homePage: true,
                    foundPosts: results,
                    isAdmin: !!req.user,
                    pageData: {
                        page: currentPage,
                        pages: pagesQuantity,
                        pageName: "",
                    }
                }
            );
        });
    }).catch( err => {

        next(err);

    });
};

// GET = Renders the gallery page inc pagination

exports.galleryRender = function(req, res, next) {

    var perPage = 8;
    var currentPage = req.query.p || 1;
    var page = (currentPage - 1);
    
    Post
        .find('primaryPhoto')
        .skip(perPage * page)
        .limit(perPage)
        .sort({updated: 'desc'})
        .exec()
        .then( results => {

            Post
                .find({'primaryPhoto': { $exists: true }})       
                .then( count => {

                    pagesQuantity = ((count.length / perPage));
                    pagesQuantity = Math.ceil(pagesQuantity);

                    res.render('main', { 
                        pageTitle: 'Gallery', 
                        galleryPage: true,
                        foundPosts: results,
                        isAdmin: !!req.user,
                        pageData: {
                            page: currentPage,
                            pages: pagesQuantity,
                            pageName: "gallery",
                    }
                }
            );
        });

    }).catch( err => {

        next(err);

    });
};


// GET = Read (view/find all posts)
exports.recipeIndexRender = function(req, res, next) {

    Post
        .find({})
        .sort({created: 'desc'})
        .then( results => {

            res.render('main', { 
                //pageTitle: "Recipe Index",
                recipeIndexPage: true,
                foundPosts: results,
                isAdmin: !!req.user
            }
        );
    }).catch( err => {

        next(err);

    });
};

// GET = Read (view/find all posts)
exports.recipeIndexCategories = function(req, res, next) {

    categoryHelper
        .allCategoriesWithPosts()
        .then( results => {

            res.render('main', { 
                //pageTitle: "Recipe Index",
                recipeIndexPage: true,
                foundPosts: results,
                isAdmin: !!req.user
            }
        );  
    }).catch( err => {

        next(err);

    });
};

//GET = render the page for different categories to load into
exports.categoryRender = function(req, res, next) {
 
    categoryHelper
        .oneCategoryWithPosts(req)
        .then( results => {

            res.render('main', { 
                pageTitle: results[0].category,
                viewCategoryPage: true,
                foundPosts: results[0],
                isAdmin: !!req.user
            }
        );
    }).catch( err => {

        next(err);

    });
};

// GET = Read (view/find all posts)
exports.recipeIndexPagi = function(req, res, next) {

    var perPage = 4;
    var currentPage = req.query.p || 1;
    var page = (currentPage - 1);
    
    Post
        .find({})
        .skip(perPage * page)
        .limit(perPage)
        .sort({created: 'desc'})
        .exec()
        .then( results => {

            Post
                .count()
                .exec()
                .then( count => {

                pagesQuantity = ((count / perPage) + 1);

                res.render('main', { 
                    //pageTitle: "Recipe Index",
                    recipeIndexPage: true,
                    foundPosts: results,
                    isAdmin: !!req.user,
                    pageData: {
                        page: currentPage,
                        pages: pagesQuantity,
                        pageName: "/recipe-index/page",
                    }
                }
            );
        });
    }).catch( err => {

        next(err);

    });
};

// GET = Read (view/show ONLY 1 post)
exports.viewPostRender = function(req, res, next) {
    var postId = req.params.id;

    Post
        .find({ _id: postId})
        .then( post => {

            res.render('main', {
                viewPostPage: true,
                foundPost: post[0],
                isAdmin: !!req.user
        });

    }).catch( err => {
        next(err);

    });
};


//GET = currently render simple About route/page
exports.aboutRender = function(req, res, next) {

    res.render('main', {
        pageTitle: 'About Us',
        aboutPage: true,
        isAdmin: !!req.user
    });
};

/* ============================

        Ajax requests

=============================== */

// GET = for aside search bar

exports.searchRender = function(req, res, next) {

    filter = {};

    if(req.query.search) {
        filter.title = {$regex : new RegExp(req.query.search, 'i')};
    
        Post.find(filter)
            .then( recipes => {

                //console.log(recipes); // is an array

                    res.render('main', {
                        pageTitle: 'Search Results',
                        searchResultsPage: true,
                        isAdmin: !!req.user,
                        results: recipes,
                        searchText: req.query.search,
                        searchAmount: recipes.length,
                    });

            }).catch( err => {

                next(err);

        });
    } else {

        var errMsg = "Sorry no matching results found!";

        res.render('main', {
            pageTitle: 'Search Results',
            searchResultsPage: true,
            isAdmin: !!req.user,
            errMsg: errMsg
        });
    }

};

exports.fillCategoryPanel = function(req, res, next) {

    Category.find({})
            .then( categories => {
                
                res.send(categories);

            }).catch( err => {
                
                next(err);
    });
};

exports.findGalleryPhoto = function(req, res, next) {
    var recipeId = req.body.recipeId;

    Post.findById(recipeId)
        .then( recipe => {

            if(!recipe) {
                return next({
                    status: 404,
                    message: 'post not found by ID'
                });
            }

            res.send(recipe);

        }).catch ( err => {
            next(err);
    });
};