var async = require('async');
var mongoose = require('mongoose');

// CONTENT
exports.index = function(req, res) {
    res.render('content', {});
};

exports.save = function(req, res) {
    var Content = mongoose.model('Content');
    var item = new Content(req.body);
    if (req.body._id) {
        Content.findByIdAndUpdate(item._id, {
            $set : {
                section : item.section,
                category : item.category,
                title : item.title,
                subtitle : item.subtitle,
                initialText : item.initialText,
                fullText : item.fullText
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

exports.remove = function(req, res) {
    var Content = mongoose.model('Content');
    Content.remove({
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
    var Content = mongoose.model('Content');
    Content.find({}).populate([ 'section', 'category' ]).exec(function(error, items) {
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
    var Content = mongoose.model('Content');
    Content.paginate({}, page, 5, function(error, pageCount, items, itemCount) {
        if (error) {
            console.error(error);
        } else {
            res.json({
                items : items,
                pageCount : pageCount
            });
        }
    }, {
        populate : [ 'category', 'section' ]
    });
};

exports.find = function(req, res) {
    var Content = mongoose.model('Content');
    Content.findOne({
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