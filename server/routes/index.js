// Routes config

var homeRoute = require('./homeRoute');

module.exports = function(app) {

    app.use('/', homeRoute);

};