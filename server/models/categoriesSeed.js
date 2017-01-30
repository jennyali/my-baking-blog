// Seed for creating Categories

var _ = require('lodash');
var mongoose = require('mongoose');
var Promise = require('bluebird');
var Category = require('./categoriesModel');
var Post = require('./postModel');

//-----------------------------------------
// Categories

var categories = [
    {category: 'cake'},
    {category: 'pancake'},
    {category: 'muffin'},
    {category: 'chocolate'}
];


//-------------------------------------------------------
// Below: Code for inserting Categories into DB for use...

/*
Promise.map(categories, function(data) {

    Category.create(data);

}).then(function() {
    console.log('categories added to DB');
}).catch( function(err) {
    console.log('Found Error making categories' + err);
});
*/

exports.categoryList = function(req, res) {

    return Category
        .find({})
        .sort({category : 'asc'})
        .then(function(results) {

             return results;

    });
};

exports.allCategoriesWithPosts = function(req, res) {

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

                        postsCropped = _.slice(posts, [0], [3]);

                        category = category.toObject(); // turns into normal object
                        category.posts = posts; // adds a posts property to category object, equals the posts found
                        category.postsCropped = postsCropped;
                        return category; // this 'then' block finishes with these 'category object' results being sent back
            });
        });
    });
};

exports.oneCategoryWithPosts = function(req, res) {
    catergoryForRender = req.params.category;

    return Category.find({ _id : catergoryForRender})
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
    });
};