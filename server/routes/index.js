// Routes config

var viewRoute = require('./viewRoute');
var postEditorRoute = require('./postEditorRoute');
var loginRoute = require('./loginRoute');


module.exports = function(app) {

    app.use('/', viewRoute);
    app.use('/post-editor', postEditorRoute);
    app.use('/login', loginRoute);
};