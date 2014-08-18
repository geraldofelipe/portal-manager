/*
 * GET home page.
 */
var async = require('async');
var mongoose = require('mongoose');
var passport = require('passport');

exports.index = function(req, res, view) {
    res.render((view && view.length > 0) ? view : 'dashboard', {});
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

exports.histories = function(req, res) {
    var History = mongoose.model('History');
    History.find({}).exec(function(error, items) {
        if (error) {
            res.send(500);
        }

        res.json({
            items : items
        });
    });
};

exports.save = function(req, res, model, data) {
    var History = mongoose.model('History');
    var Model = mongoose.model(model);
    var item = new Model(req.body);
    if (req.body._id) {
        Model.findOne({
            _id : item._id
        }, function(error, oldItem) {
            if (error) {
                res.send(500);
            }
            var content = JSON.stringify(oldItem);
            var history = new History({
                type : model,
                cid : oldItem.id,
                content : content,
                user : item.user
            });
            history.save(function(error, obj) {
                if (error) {
                    console.log(error);
                    res.send(500);
                }
                Model.findByIdAndUpdate(item._id, {
                    $set : data(item)
                }, function(error, obj) {
                    if (error) {
                        console.log(error);
                        res.send(500);
                    }
                    res.json({
                        item : obj
                    });
                });
            });
        });
    } else {
        item.save(function(error, obj) {
            if (error) {
                console.log(error);
                res.send(500);
            }
            res.json({
                item : obj
            });
        });
    }
    // res.send(201);
};

exports.remove = function(req, res, model) {
    var Model = mongoose.model(model);
    Model.remove({
        _id : req.params.id
    }, function(error, item) {
        if (error) {
            console.log(error);
            res.send(500);
        }
    });
    res.send(201);
};

exports.list = function(req, res, model, populate) {
    if (!populate) {
        populate = '';
    }
    var Model = mongoose.model(model);
    Model.find({}).populate(populate).exec(function(error, items) {
        if (error) {
            res.send(500);
        }

        res.json({
            items : items
        });
    });
};

exports.page = function(req, res, model, populate) {
    if (!populate) {
        populate = '';
    }
    var page = req.param('page') || 1;
    var Model = mongoose.model(model);
    Model.paginate({}, page, 5, function(error, pageCount, items, itemCount) {
        if (error) {
            console.error(error);
        } else {
            res.json({
                items : items,
                pageCount : pageCount
            });
        }
    }, {
        populate : populate
    });
};

var history = function(filter, page, callback) {
    var History = mongoose.model('History');
    History.paginate(filter, page, 5, function(error, pageCount, items, itemCount) {
        if (error) {
            console.error(error);
        } else {
            callback(error, {
                items : items,
                pageCount : pageCount
            });
        }
    }, {
        sortBy : {
            version : -1
        }
    });
};
exports.find = function(req, res, model) {
    var page = req.param('page') || 1;
    var Model = mongoose.model(model);
    Model.findOne({
        _id : req.params.id
    }, function(error, item) {
        if (error) {
            res.send(500);
        }
        history({
            type : model,
            cid : item.id
        }, page, function(error, history) {
            if (error) {
                res.send(500);
            }
            res.json({
                item : item,
                history : history
            });
        });
    });
};

exports.history = function(req, res, model) {
    var History = mongoose.model('History');
    History.find({
        type : model
    }).exec(function(error, items) {
        if (error) {
            res.send(500);
        }

        res.json({
            items : items
        });
    });
};

exports.status = function(req, res, model) {
    var Model = mongoose.model(model);
    var item = req.body;
    Model.findByIdAndUpdate(item.id, {
        $set : {
            status : item.status
        }
    }, function(error, item) {
        if (error) {
            console.log(error);
            res.send(500);
        }
    });
    res.send(201);
};