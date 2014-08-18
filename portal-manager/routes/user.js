var async = require('async');
var mongoose = require('mongoose');

exports.index = function(req, res) {
	res.render('user', {});
};

exports.password = function(req, res) {
	res.render('user-password', {});
};

exports.managerType = function(req, res) {
    var User = mongoose.model('User');
    var item = req.body;
    User.findByIdAndUpdate(item.id, {
        $set : {
            managerType : item.managerType
        }
    }, function(error, item) {
        if (error) {
            console.log(error);
            res.send(500);
        }
    });
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