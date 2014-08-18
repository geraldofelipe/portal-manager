/**
 * Module dependencies.
 */
// ASYNC
var async = require('async');
// CRYPTO
var crypto = require('crypto');
var crypt = function(value) {
    return crypto.createHash('sha256').update(value).digest('base64');
};
// EXPRESS
var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var errorHandler = require('errorhandler');
var favicon = require('serve-favicon');
var methodOverride = require('method-override');
var morgan = require('morgan');
var session = require('express-session');
var models = require('./models');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
// I18N
var i18n = require('i18n');
i18n.configure({
    locales : [ 'pt' ],
    directory : __dirname + '/locales'
});
// MOONGOOSE
var mongoose = require('mongoose');
// PASSPORT
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(function(username, password, done) {
    var User = mongoose.model('User');
    User.findOne({
        email : username
    }, function(error, user) {
        if (error) {
            return done(error);
        }
        if (!user) {
            return done(null, false, {
                message : 'Incorrect username.'
            });
        }
        console.log('senha:' + password);
        console.log(user.authenticate(password));
        if (!user.authenticate(password)) {
            return done(null, false, {
                message : 'Incorrect password.'
            });
        }
        return done(null, user);
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    var User = mongoose.model('User');
    User.findOne({
        _id : id
    }, function(error, user) {
        if (error) {
            return done(new Error('User ' + id + ' does not exist'));
        }
        return done(null, user);
    });
});

var app = express();

// all environments
app.use(i18n.init);
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(favicon(path.join(__dirname, 'public/images/favicon.ico')));
app.use(compression());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended : false
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cookieSession({
    secret : '1234567890QWERTY',
    cookie : {
        maxAge : 60 * 60 * 1000
    }
}));
app.use(session({
    secret : '1234567890QWERTY',
    resave : true,
    saveUninitialized : true
}));
app.use(methodOverride());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
// development only
var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
    app.use(errorHandler());
}

var checkAuth = function(req, res, next) {
    if (!req.isAuthenticated()) {
        req.session['redirect-to'] = req.originalUrl;
        res.redirect('/login');
    }
    next();
};

app.get('/', checkAuth, function(req, res) {
    routes.index(req, res, '');
});
app.get('/settings', checkAuth, routes.settings);
// SECTION
app.get('/section', checkAuth, function(req, res) {
    routes.index(req, res, 'section');
});
app.get('/section/:id', checkAuth, function(req, res) {
    routes.find(req, res, 'Section');
});
app.del('/section/:id', checkAuth, function(req, res) {
    routes.remove(req, res, 'Section');
});
app.post('/section', checkAuth, function(req, res) {
    routes.save(req, res, 'Section', function(item) {
        return {
            user : item.user,
            code : item.code,
            name : item.name,
            description : item.description,
            version : item.version + 1
        };
    });
});
app.get('/sections', checkAuth, function(req, res) {
    routes.list(req, res, 'Section');
});
app.get('/page-sections', checkAuth, function(req, res) {
    routes.page(req, res, 'Section');
});
app.get('/section-history', checkAuth, function(req, res) {
    routes.history(req, res, 'Section');
});
// CATEGORY
app.get('/category', checkAuth, function(req, res) {
    routes.index(req, res, 'category');
});
app.get('/category/:id', checkAuth, function(req, res) {
    routes.find(req, res, 'Category');
});
app.del('/category/:id', checkAuth, function(req, res) {
    routes.remove(req, res, 'Category');
});
app.post('/category', checkAuth, function(req, res) {
    routes.save(req, res, 'Category', function(item) {
        return {
            user : item.user,
            code : item.code,
            name : item.name,
            description : item.description,
            version : item.version + 1
        };
    });
});
app.get('/categories', checkAuth, function(req, res) {
    routes.list(req, res, 'Category');
});
app.get('/page-categories', checkAuth, function(req, res) {
    routes.page(req, res, 'Category');
});
app.get('/category-history', checkAuth, function(req, res) {
    routes.history(req, res, 'Category');
});
// CONTENT
app.get('/content', checkAuth, function(req, res) {
    routes.index(req, res, 'content');
});
app.get('/content/:id', checkAuth, function(req, res) {
    routes.find(req, res, 'Content');
});
app.del('/content/:id', checkAuth, function(req, res) {
    routes.remove(req, res, 'Content');
});
app.post('/content', checkAuth, function(req, res) {
    routes.save(req, res, 'Content', function(item) {
        return {
            user : item.user,
            section : item.section,
            category : item.category,
            title : item.title,
            subtitle : item.subtitle,
            initialText : item.initialText,
            fullText : item.fullText,
            version : item.version + 1
        };
    });
});
app.post('/content-status', checkAuth, function(req, res) {
    routes.status(req, res, 'Content');
});
app.get('/contents', checkAuth, function(req, res) {
    routes.list(req, res, 'Content', [ 'category', 'section', 'user' ]);
});
app.get('/page-contents', checkAuth, function(req, res) {
    routes.page(req, res, 'Content', [ 'category', 'section', 'user' ]);
});
app.get('/content-history', checkAuth, function(req, res) {
    routes.history(req, res, 'Content');
});
// USER
app.get('/user', checkAuth, function(req, res) {
    routes.index(req, res, 'user');
});
app.get('/user/:id', checkAuth, function(req, res) {
    routes.find(req, res, 'User');
});
app.del('/user/:id', checkAuth, function(req, res) {
    routes.remove(req, res, 'User');
});
app.post('/user', checkAuth, function(req, res) {
    routes.save(req, res, 'User', function(item) {
        return {
            name : item.name
        };
    });
});
app.get('/users', checkAuth, function(req, res) {
    routes.list(req, res, 'User');
});
app.get('/page-users', checkAuth, function(req, res) {
    routes.page(req, res, 'User');
});
app.post('/user-status', checkAuth, function(req, res) {
    routes.status(req, res, 'User');
});
app.post('/user-type', checkAuth, user.managerType);
app.get('/user-logged', checkAuth, user.logged);
app.get('/user-password', checkAuth, user.password);
app.post('/user-password', checkAuth, user.changePassword);
// HISTORY
app.get('/histories', routes.histories);
// LOGIN
app.get('/login', routes.login);
app.post('/login', routes.doLogin);
app.get('/logout', routes.logout);

app.listen(app.get('port'), function() {
    console.log(i18n.__('Portal Manager'));
    console.log('Express server listening on port ' + app.get('port'));
});