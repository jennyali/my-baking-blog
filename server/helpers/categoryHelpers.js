
// Helper functions related to Categories


var _ = require('lodash');
var mongoose = require('mongoose');
var Promise = require('bluebird');
var Category = require('../models/categoriesModel');
var Post = require('../models/postModel');

//============================================================

// finds all the catergories from db.
exports.categoryList = function(req, res) {

    return Category
        .find({})
        .sort({category : 'asc'})
        .then(function(results) {

             return results;
    });
};

// finds all categories with their linked/related recipes.
exports.allCategoriesWithPosts = function(req, res, next) {

    return Category.find({})
        .sort({updated: 'desc'})
        .exec()
        .then(categories => {

            return Promise.map(categories, function(category) {

                return Post.find({category: category._id})
                    .sort({updated: 'desc'})
                    .lean()
                    .exec()
                    .then( posts => {

                        var postsCropped = _.slice(posts, [0], [3]);

                        category = category.toObject(); // turns into normal object
                        category.posts = posts; // adds a posts property to category object, equals the posts found
                        category.postsCropped = postsCropped;
                        return category; // this 'then' block finishes with these 'category object' results being sent back
            });
        });
    }).catch( err => {
        next(err);
    });
};

// finds just one category mentioned with all its linked/related recipes.
exports.oneCategoryWithPosts = function(req, res, next) {
    catergoryForRender = req.params.category;

    return Category
            .find({ _id : catergoryForRender})
            .then(categories => {

                return Promise.map(categories, function(category) {

                    return Post.find({category: category._id})
                        .sort({updated: 'desc'})
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
        }).catch( err => {
            next(err);
    });
};