// User Model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean }
});

var User = mongoose.model('User', userSchema);

module.exports = User;