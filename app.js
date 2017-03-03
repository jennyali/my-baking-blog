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
var passport = require('passport');
var session = require('express-session');
var flash = require("connect-flash");
var cookieParser = require('cookie-parser');
var connectMongo = require('connect-mongo');
var _ = require('lodash');
require('./server/util/passportConfig')(passport);


// Database connection ========================================
mongoose.connect('mongodb://localhost/jentestdb', function() {
    console.log('Database connected');
});

var MongoStore = connectMongo(session);
var sessionStore = new MongoStore({mongooseConnection:mongoose.connections[0]});

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
        /*times: function(n, block) {
            console.log(block);
            console.log(n);

            var accum = '';
            for(var i = 1; i <= n; ++i)
                accum += block.fn(i);

            console.log(accum);
            return accum;
        }*/
        paginator: function(pageData) {

            var pages = pageData.pages;
            var currentPage = pageData.page;
            var pageName = pageData.pageName;
            var paginator = '<ul class="paginator pagination text-center row">';

            _.times(pages, page => {

                currentPage = parseInt(currentPage);
                page = page + 1;
                paginator += (
                    `<li class="${page === currentPage ? 'active': ''}">
                            <a href="/${pageName}?p=${page}">${page}</a>
                        </li>`
                );
            });

            paginator += "</ul>";

            console.log(paginator);

            return paginator;                
        }
    }
}));

app.set('view engine', 'handlebars');
app.use(morgan('dev'));
app.use(session({ 
    secret: 'cake',
    resave: true,
    saveUninitialized: true,
    store: sessionStore
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

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