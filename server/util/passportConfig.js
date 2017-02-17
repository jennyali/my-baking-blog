// MY passport local stratedy config

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('../models/userModel');
var LocalStrategy = require('passport-local').Strategy;


module.exports = function(passport) {

     // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    passport.use(new LocalStrategy ({
        passReqToCallback: true
    }, function(req, username, password, done) {
        console.log(username);
        User.findOne({ name: username }, function (err, user) {

            if(err) {
                return done(err); 
            }

            if(!user) {
                return done(null, false, req.flash('message', 'Incorrect username or password'));
            }

            user.isValidPassword(password, function(err, isValid) {

                if(!isValid) {
                     return done(null, false, req.flash('message', 'Incorrect username or password'));
                } 

                return done(null, user);

            });

        });        
    }
));







}
