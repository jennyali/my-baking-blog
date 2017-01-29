// Seed for creating Categories

var _ = require('lodash');
var mongoose = require('mongoose');
var Promise = require('bluebird');
var Category = require('./categoriesModel');

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
