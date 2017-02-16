// Post Manage Contoller
//---------------------------------
var errorHelper = require('../util/errorHelper');
var Post = require('../models/postModel');
var Category = require('../models/categoriesModel');
var categoryHelper = require('../helpers/categoryHelpers');
var _ = require('lodash');
var Promise = require('bluebird');
var fs = require('fs');
var imageFiles = fs.readdirSync('../my-baking-blog/public/images');


/*==========================

            GET

=============================*/

// PAGE RENDERS ---------------------------------------------


// GET to render inital page / Uses the 'findAllPosts' function
exports.pageRender = function(req, res, next) {

    var successRes = false;
    var updateRes = false;
    var deleteRes = false;

    if(req.query.delete) {
        
         deleteRes = true;
    
    } else if(req.query.update) {

        updateRes = true;

    } else if(req.query.success) {

        successRes = true;

    } 

        categoryHelper
            .allCategoriesWithPosts()
            .then( results => {

                var perPage = 8;
                var currentPage = req.query.p;
                var page = (currentPage - 1);
                
                Post
                    .find({})
                    .skip(perPage * page)
                    .limit(perPage)
                    .sort({updated: 'desc'})
                    .exec()
                    .then( pagiResults => {

                        Post
                            .count()
                            .then( count => {

                            pagesQuantity = ((count / perPage) + 1);

                            res.render('postEditor', { 
                                pageTitle: "Recipe Editor", 
                                hasAllPosts: true,
                                hasCreateBtn: true,
                                foundPosts: results,
                                pagiResults: pagiResults,
                                page: currentPage,
                                pages: pagesQuantity,
                                success: successRes,
                                update: updateRes,
                                delete: deleteRes,
                            }
                    );
                });
            });
        }).catch( err => {
            next(err);
    });
};

//GET = render the page for different categories to load into
exports.adminCategoryRender = function(req, res, next) {
 
    categoryHelper
        .oneCategoryWithPosts(req)
        .then( results => {

            res.render('postEditor', { 
                pageTitle: "Recipe Editor",
                hasViewCategory: true,
                foundPosts: results[0],
        });
    }).catch( err => {
        next(err);
    });
};


// GET = different Rendering for the Create route/page, uses category model
exports.formRender = function(req, res, next) {

    if(!req.params.id) {
        
        categoryHelper
            .categoryList()
            .then(  results => {

                res.render('postEditor', { 
                    pageTitle: "Create Recipe",
                    hasForm: true,
                    categories: results,
                });

            }).catch( err => {
                next(err);
        });

    } else {

        var postId = req.params.id;



        categoryHelper
            .categoryList()
            .then( results => {

                return Post
                        .findById(postId)
                        .then(post => {

                            if(!post) {
                                return next ({
                                    status: 404,
                                    message: 'post not found by ID'
                                });
                            }

                            results = _.map(results, category => {

                                category.toObject();
                                var matchingCategory = _.find(post.category, postCategory => {
                                    
                                    return postCategory.toString() === category._id.toString();
                                });
                                
                                if(matchingCategory !== undefined) {
                                    category.isChecked = true;
                                }
                                return category;

                            });

                        res.render('postEditor', { 
                            pageTitle: "Edit Recipe",
                            hasForm: true,
                            isEditPost: true,
                            categories: results,
                            postId: postId,
                            prefill: {
                                title: post.title,
                                body: post.body,
                                ingredientList: post.ingredientList,
                                instructions: post.instructions,
                                imageFiles: imageFiles,
                                primaryPhoto: post.primaryPhoto,
                                secondaryPhoto: post.secondaryPhoto,
                                extraPhoto: post.extraPhoto
                            }
                        }
                    );
                });
            }).catch( err => {
                next(err);
        });
    }
};

//GET = Render view post page using req.params.id
exports.viewPost = function(req, res, next) {

    var postId = req.params.id;

    Post
        .findById(postId)
        .then( post => {

        if(!post) {

            return next({
                status: 404,
                message: 'post not found by ID'
            });

        } else {

            res.render('postEditor', { 
                pageTitle: "Recipe Editor",
                hasViewPost: true,
                foundPost: post,
            });
        }
    }).catch( err => {
        next(err);
    });
};

// END GET RENDERS -------------------------------------------------

// GET = find by id and delete post
exports.deletePost = function(req, res, next) { // TRY REDIRECTING WITH  QUERY STRING WITH TITLE, ALERT, ALERTmsg

    var postId = req.params.id;

    Post
        .findByIdAndRemove(postId)
        .then( post => {

            var message =  post.title;

            console.log('DELETED POST: ' + post.title);

            res.redirect(301, '/post-editor?delete=true&alertMsg=' + message);

    }).catch( err => {
        next(err);
    });
};


/*==========================

            POST 

=============================*/

// POST = Create
exports.createPost = function(req, res, next) {

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

            categoryHelper
                .categoryList()
                .then( results => {

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
                    }
            );
        }).catch( err => {
            next(err)
        });
    });
};


// POST = Using information from url and browser body, function updates post with new strings.
exports.editPost = function(req, res, next) {

    var postId = req.params.id;

    Post
        .findById(postId)
        .then( post => {

            if(!post) {
                return next({
                    status: 404,
                    message: 'post not found by ID'
                });
            }

            post.title = req.body.title;
            post.category = req.body.category;
            post.body= req.body.body;
            post.updated = new Date();
            post.instructions = req.body.instructions;
            post.primaryPhoto = req.body.primaryPhoto;
            post.secondaryPhoto = req.body.secondaryPhoto;
            post.extraPhoto = req.body.extraPhoto;

            post
                .save()
                .then( post => {

                    var message = post.title;
                    console.log('EDITED POST: ' + post.title);
                    res.redirect(301, '/post-editor?update=true&alertMsg=' + message);

                })
                .catch( err => {

                    //console.log(err);

                    var error = err;

                    if(err.name === 'ValidationError') {

                       error = errorHelper(err);
                    }

                    categoryHelper
                        .categoryList()
                        .then( results => {

                            var bodyCategories = req.body.category; //array

                            results = _.map(results, category => {

                                category.toObject();

                                var matchingCategory = _.find(bodyCategories, bodyCategory => {

                                    return bodyCategory === category._id.toString();

                                });

                                if(matchingCategory !== undefined) {
                                    category.isChecked = true;
                                }

                                return category;
                            });

                                res.render('postEditor', { 
                                    pageTitle: "Edit Post",
                                    hasForm: true,
                                    isEditPost: true,
                                    categories: results,
                                    postId: postId,
                                    prefill: {
                                        title: req.body.title,
                                        body: req.body.body,
                                    },
                                    failed: true,
                                    errors: error
                                });  

                }).catch( err => {
                    next(err);
            });
        });
    });
};


/*===============================

        AJAX RELATED ROUTES
 
 ================================*/

// POST to delete primaryPhoto from found recipe
exports.deletePrimaryPhoto = function(req, res, next) {
    var postId = req.params.id;

        Post
        .findById(postId)
        .then( post => {

            if(!post) {
                return next({
                    status: 404,
                    message: 'post not found by ID'
                });
            }

            post.primaryPhoto = undefined;
            post.save()
                .then( post => {
                    res.send('204');

                });

        }).catch( err => {
            next(err);
    });
};

// POST to delete secondaryPhoto from found recipe
exports.deleteSecondaryPhoto = function(req, res, next) {
    var postId = req.params.id;

        Post
        .findById(postId)
        .then( post => {

            if(!post) {
                return next({
                    status: 404,
                    message: 'post not found by ID'
                });
            }

            post.secondaryPhoto = undefined;
            post.save()
                .then( post => {
                    res.send('204');

                });

        }).catch( err => {
            next(err);
    });
};


//GET = to get the list of photo files in public/images 
exports.obtainPhotoFiles = function(req, res, next) {
    res.send(imageFiles);
};


 //POST = to update the ingredient with new form values
 exports.updateIngredient = function(req, res, next) {

    var postId = req.params.id;
    var ingredientId = req.body.ingredientId;

    Post
        .findById(postId)
        .then( post => {

            if(!post) {
                return next({
                    status: 404,
                    message: 'post not found by ID'
                });
            }

            var ingredient = post.ingredientList.id(ingredientId);

            ingredient.name = req.body.name;
            ingredient.quantity = req.body.quantity;
            ingredient.unit = req.body.unit;

            post.save()
                .then( post => {

                    var ingredient = post.ingredientList.id(ingredientId);

                    res.send(ingredient);
            });

        }).catch( err => {
            next(err);
    });
 };

// POST = to prep for edit of ingredient, find ingredient and fill in Ingreform
exports.editIngredient = function(req, res, next) {

    var postId = req.params.id;
    var ingreId = req.body.ingreId;

    Post
        .findById(postId)
        .then( post => {

            if(!post) {
                return next({
                    status: 404,
                    message: 'post not found by ID'
                });
            }

            var ingredient = post.ingredientList.id(ingreId);

            res.send(ingredient);

        }).catch(function(err) {
            next(err);
    });
};

//POST = to delete an ingredient from the list of made Ingredients
exports.deleteIngredient = function(req, res, next) {

    var postId = req.params.id;
    var ingreId = req.body.ingreId;

    Post
        .findOneAndUpdate({ _id: postId}, { $pull : { ingredientList : { _id : ingreId }}})
        .then( post => {

            res.send('204');

        }).catch( err => {
        next(err);
    });
};


// POST = Update Post for Ajax request on inserting Ingredients
exports.addIngredient = function(req, res, next) {

    var postId = req.params.id;

    Post
        .findById(postId)
        .then( post => {
            
            if(!post) {
                return next({
                    status: 404,
                    message: 'post not found by ID'
                });
            }

            var list = {
                name : req.body.name,
                quantity: req.body.quantity,
                unit: req.body.unit
            };

            post.ingredientList.push(list);

            post.save(function(err, post) {
                if (err) console.log(err);

                res.send(post.ingredientList);
        });          
    }).catch( err => {
        next(err);
    });
};

