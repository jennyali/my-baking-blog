// Routes config

var homeRoute = require('./homeRoute');
var postRoute = require('./postRoute');
var viewRoute = require('./viewRoute');
var postEditorRoute = require('./postEditorRoute');

module.exports = function(app) {

    app.use('/', homeRoute);
    app.use('/createPost', viewRoute);
    app.use('/viewAllPosts', postRoute);
    app.use('/viewPost', postRoute);
    app.use('/post-editor', postEditorRoute);

};