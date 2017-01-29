// Post Model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema ({
    title: { type: String, required: true },
    category: [{ref: 'categories', type: Schema.Types.ObjectId}],
    body: { type: String, required: true },
    created: Date,
    updated: Date
});

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