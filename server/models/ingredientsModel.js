// Ingredients Model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird');


var ingredientSchema = new Schema ({
    name: String,
    quantity: Number,
    unit: String
});

module.exports = ingredientSchema;