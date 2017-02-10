// App Start point //

// Requires ==================================================
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Error.messages.general.required = "The '{PATH}' field is required";
mongoose.Promise = require('bluebird');
var port =  process.env.PORT || 3000;
var routes = require('./server/routes');
var path = require('path');
var morgan = require('morgan');

// Database connection ========================================
mongoose.connect('mongodb://localhost/jentestdb', function() {
    console.log('Database connected');
});

// app + middleware ===========================================
var app = express();


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/assets', express.static(__dirname + '/public'));
app.set('views', './server/views');

app.engine('handlebars', exphbs({
    layoutsDir: './server/views/layouts',
    partialsDir: './server/views/partials',
    defaultLayout: 'main',
    helpers: {
        times: function(n, block) {
            var accum = '';
            for(var i = 1; i < n; ++i)
                accum += block.fn(i);
            return accum;
        }
    }
}));

app.set('view engine', 'handlebars');
app.use(morgan('dev'));

// Routes ====================================================
routes(app);

// Error handler =============================================
app.use((err, req, res, next) => {
    
    if(err === 404) {
        res.render('error', { 
            error: err,
            msg:  'Not Found 404'
        });
    }

    if(err.status === 404) {
        res.render('error', { 
            error: err.status,
            msg:  err.message
        });
    }

    res.status(500);
    res.render('error', { error: err });
});

// End process ================================================
app.listen(port, () => {
    console.log('Server started');
});