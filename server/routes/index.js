// Routes config

var viewRoute = require('./viewRoute');
var postEditorRoute = require('./postEditorRoute');

module.exports = function(app) {

    app.use('/', viewRoute);
    app.use('/post-editor', postEditorRoute);

};