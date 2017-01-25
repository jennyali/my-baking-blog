// Routes config

var homeRoute = require('./homeRoute');
var postRoute = require('./postRoute');
var viewRoute = require('./viewRoute');

module.exports = function(app) {

    app.use('/', homeRoute);
    app.use('/createPost', viewRoute);
    app.use('/viewAllPosts', postRoute);
    app.use('/viewPost', postRoute);

};