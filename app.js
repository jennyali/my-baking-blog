// App Start point

//==== Requires
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Error.messages.general.required = "The '{PATH}' field is required";
var port =  process.env.PORT || 3000;
var routes = require('./server/routes');
var path = require('path');
var morgan = require('morgan');

//==== Database connection
mongoose.connect('mongodb://localhost/jentestdb', function() {
    console.log('Database connected');
});

//==== app + middleware
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/assets', express.static(__dirname + '/public'));
app.set('views', './server/views');
app.engine('handlebars', exphbs({
    layoutsDir: './server/views/layouts',
    partialsDir: './server/views/partials',
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use(morgan('dev'));

//==== Routes
routes(app);

//==== Error handler
app.use(function(err, req, res, next) {
    if(err === 404) {
        console.log(err);
    }
    console.log(err);
});

//==== End process
app.listen(port, function() {
    console.log('Server started');
});