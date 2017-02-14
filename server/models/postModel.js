// Post Model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ingredients = require('./ingredientsModel');

var postSchema = new Schema ({
    title: { type: String, required: true },
    category: [{
        ref: 'categories', 
        type: Schema.Types.ObjectId,
        required: true,
    }],
    body: { type: String, required: true },
    ingredientList: [ingredients],
    instructions: {  type: Array },
    primaryPhoto: { type: String },
    created: Date,
    updated: Date
});

// custom validation to check array length on the categories property
postSchema.path('category').validate(function(category) {
    if(!category) {
        return false;
    } else if (category.length === 0) {
        return false;
    }
    return true;
}, 'Needs to be one category selected');


// this PRE hook is to config the created and updated dates before it saves to DB
postSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updated = currentDate;

    if(!this.created) {
        this.created = currentDate;
    }

    next();
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;