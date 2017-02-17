// User Model
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean }
});

userSchema.methods.isValidPassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isValid) {
        return callback(err, isValid);
    });
};

var User = mongoose.model('User', userSchema);


User.findOne({}, function(err, user) {

    if(user) {
        return;
    }

    bcrypt.genSalt(8, function(err, salt) {

        bcrypt.hash('password', salt, function(){}, function(err, password) {

            var admin = new User({name: 'Admin', password: password});

            admin.save(function() {

                console.log('admin created');

            });
        });

    });
    
});


module.exports = User;

