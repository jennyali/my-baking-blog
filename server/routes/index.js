// Routes config

var homeRoute = require('./homeRoute');
var postRoute = require('./postRoute');

module.exports = function(app) {

    app.use('/', homeRoute);
    app.use('/createPost', postRoute);

};