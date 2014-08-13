/**
 * Module dependencies.
 */

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var async = require('async');
var crypto = require('crypto');
var express = require('express');
var i18n = require('i18n');
var mongoose = require('mongoose');
var models = require('./models');
var routes = require('./routes');
var section = require('./routes/section');
var category = require('./routes/category');
var content = require('./routes/content');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

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

i18n.configure({
    locales : [ 'pt' ],
    directory : __dirname + '/locales'
});

var crypt = function(value) {
    return crypto.createHash('sha256').update(value).digest('base64');
};

var app = express();

// all environments
app.use(i18n.init);
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon(path.join(__dirname, 'public/images/favicon.ico')));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.cookieParser());
app.use(express.cookieSession({
    secret : '1234567890QWERTY',
    cookie : {
        maxAge : 60 * 60 * 1000
    }
}));
app.use(express.session({
    secret : '1234567890QWERTY'
}));
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}

var checkAuth = function(req, res, next) {
    if (!req.isAuthenticated()) {
        req.session['redirect-to'] = req.originalUrl;
        res.redirect('/login');
    }
    next();
};

app.get('/', checkAuth, routes.index);
app.get('/settings', checkAuth, routes.settings);
// SECTION
app.get('/section', checkAuth, section.index);
app.get('/section/:id', checkAuth, section.find);
app.del('/section/:id', checkAuth, section.remove);
app.post('/section', checkAuth, section.save);
app.get('/sections', checkAuth, section.list);
app.get('/page-sections', checkAuth, section.page);
app.get('/section-history', checkAuth, section.history);
// CATEGORY
app.get('/category', checkAuth, category.index);
app.get('/category/:id', checkAuth, category.find);
app.del('/category/:id', checkAuth, category.remove);
app.post('/category', checkAuth, category.save);
app.get('/categories', checkAuth, category.list);
app.get('/page-categories', checkAuth, category.page);
app.get('/category-history', checkAuth, category.history);
// CONTENT
app.get('/content', checkAuth, content.index);
app.get('/content/:id', checkAuth, content.find);
app.del('/content/:id', checkAuth, content.remove);
app.post('/content', checkAuth, content.save);
app.post('/content-status', checkAuth, content.status);
app.get('/contents', checkAuth, content.list);
app.get('/page-contents', checkAuth, content.page);
app.get('/content-history', checkAuth, content.history);
// USER
app.get('/user', checkAuth, user.index);
app.get('/user/:id', checkAuth, user.find);
app.del('/user/:id', checkAuth, user.remove);
app.post('/user', checkAuth, user.save);
app.post('/user-type', checkAuth, user.managerType);
app.post('/user-status', checkAuth, user.status);
app.get('/users', checkAuth, user.list);
app.get('/page-users', checkAuth, user.page);
app.get('/user-logged', checkAuth, user.logged);
app.get('/user-password', checkAuth, user.password);
app.post('/user-password', checkAuth, user.changePassword);
//HISTORY
app.get('/histories', routes.histories);
// LOGIN
app.get('/login', routes.login);
app.post('/login', routes.doLogin);
app.get('/logout', routes.logout);

http.createServer(app).listen(app.get('port'), function() {
    console.log(i18n.__('Portal Manager'));
    console.log('Express server listening on port ' + app.get('port'));
});