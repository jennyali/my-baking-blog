// Categories Model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird');


var categorySchema = new Schema ({
    category: { type : String, required: true },
});

var Category = mongoose.model('Category', categorySchema);


module.exports = Category;

