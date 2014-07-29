var async = require('async');
var mongoose = require('mongoose');

// CONTENT TYPE
exports.index = function(req, res) {
    res.render('category', {});
};

exports.save = function(req, res) {
    var Category = mongoose.model('Category');
    var item = new Category(req.body);
    if (req.body._id) {
        Category.findByIdAndUpdate(item._id, {
            $set : {
                section : item.section,
                code : item.code,
                name : item.name,
                description : item.description
            }
        }, function(error, content) {
            if (error) {
                console.log(error);
                res.send(500);
            }
        });
    } else {
        item.save(function(error, obj) {
            if (error) {
                console.log(error);
                res.send(500);
            }
            req.body._id = obj._id;
        });
    }
    res.send(201);
};

exports.remove = function(req, res) {
    var Category = mongoose.model('Category');
    Category.remove({
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
    var Category = mongoose.model('Category');
    Category.find({}).populate('section').exec(function(error, items) {
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
    var Category = mongoose.model('Category');
    Category.paginate({}, page, 5, function(error, pageCount, items, itemCount) {
        if (error) {
            console.error(error);
        } else {
            res.json({
                items : items,
                pageCount : pageCount
            });
        }
    }, {
        populate : 'section'
    });
};

exports.find = function(req, res) {
    var Category = mongoose.model('Category');
    Category.findOne({
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