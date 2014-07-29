var async = require('async');
var mongoose = require('mongoose');

exports.index = function(req, res) {
    res.render('user', {});
};

exports.password = function(req, res) {
    res.render('user-password', {});
};

exports.save = function(req, res) {
    var User = mongoose.model('User');
    var item = new User(req.body);
    if (req.body._id) {
        User.findByIdAndUpdate(item._id, {
            $set : {
                name : item.name
            }
        }, function(error, item) {
            if (error) {
                console.log(error);
                res.send(500);
            }
        });
    } else {
        item.save(function(error, item) {
            if (error) {
                console.log(error);
                res.send(500);
            }
        });
    }
    res.send(201);
};

exports.changePassword = function(req, res) {
    var User = mongoose.model('User');
    User.findOne({
        _id : req.body._id
    }, function(error, item) {
        if (error) {
            console.log(error);
            res.send(500);
        }
        item.password = req.body.password;
        item.save();
    });
    res.send(201);
};

exports.remove = function(req, res) {
    var User = mongoose.model('User');
    User.remove({
        _id : req.params.id
    }, function(error, item) {
        if (error) {
            console.log(error);
            res.send(500);
        }
    });
    res.send(201);
};

exports.list = function(req, res) {
    var User = mongoose.model('User');
    User.find({}).exec(function(error, items) {
        if (error) {
            res.send(500);
        }

        res.json({
            items : items
        });
    });
};

exports.page = function(req, res) {
    var page = req.param('page') || 1;
    var User = mongoose.model('User');
    User.paginate({}, page, 5, function(error, pageCount, items, itemCount) {
        if (error) {
            console.error(error);
        } else {
            res.json({
                items : items,
                pageCount : pageCount
            });
        }
    });
};

exports.find = function(req, res) {
    var User = mongoose.model('User');
    User.findOne({
        _id : req.params.id
    }, function(error, item) {
        if (error) {
            res.send(500);
        }

        res.json({
            item : item
        });
    });
};

exports.logged = function(req, res) {
    var User = mongoose.model('User');
    User.findOne({
        _id : req.session['user-id']
    }, function(error, item) {
        if (error) {
            res.send(500);
        }
        res.json({
            item : item
        });
    });
};