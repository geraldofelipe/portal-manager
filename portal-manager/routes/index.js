/*
 * GET home page.
 */
var async = require('async');
var mongoose = require('mongoose');
var passport = require('passport');

exports.index = function(req, res) {
    res.render('index', {});
};

exports.settings = function(req, res) {
    res.render('settings', {});
};

exports.login = function(req, res) {
    if (req.user) {
        res.redirect('/');
    } else {
        res.render('login');
    }
};

exports.doLogin = function(req, res, next) {
    passport.authenticate('local', function(error, user, info) {
        if (error) {
            return next(error);
        }

        if (!user) {
            return res.redirect(403, '/login');
        }

        req.logIn(user, function(error) {
            if (error) {
                return next(error);
            }
            var post = req.body;
            if (post.rememberMe) {
                res.cookie('remember', {
                    username : post.username,
                    password : post.password
                });
            } else {
                res.clearCookie('remember');
            }
            req.session['user-id'] = user._id;
            var url = req.session['redirect-to'] || '/';
            delete req.session['redirect-to'];
            return res.json({
                id : user._id,
                email : user.email,
                name : user.name,
                managerType : user.managerType,
                status : user.status,
                redirectTo : url
            });
        });

    })(req, res, next);
};

exports.logout = function(req, res) {
    if (req.isAuthenticated()) {
        req.logout();
    }
    delete req.session['user-id'];
    res.redirect('/');
};