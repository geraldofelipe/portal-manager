var async = require('async');
var mongoose = require('mongoose');

// SECTION
exports.index = function(req, res) {
    res.render('section', {});
};

exports.save = function(req, res) {
    var History = mongoose.model('History');
    var Section = mongoose.model('Section');
    var item = new Section(req.body);
    if (req.body._id) {
        Section.findOne({
            _id : item._id
        }, function(error, oldItem) {
            if (error) {
                res.send(500);
            }
            var content = JSON.stringify(oldItem);
            var history = new History({
                type : "Section",
                cid : oldItem.id,
                content : content,
                user : item.user
            });
            history.save(function(error, obj) {
                if (error) {
                    console.log(error);
                    res.send(500);
                }
                Section.findByIdAndUpdate(item._id, {
                    $set : {
                        user : item.user,
                        code : item.code,
                        name : item.name,
                        description : item.description,
                        version : item.version + 1
                    }
                }, function(error, content) {
                    if (error) {
                        console.log(error);
                        res.send(500);
                    }
                });
            });
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
    var Section = mongoose.model('Section');
    Section.remove({
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
    var Section = mongoose.model('Section');
    Section.find({}, function(error, items) {
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
    var Section = mongoose.model('Section');
    Section.paginate({}, page, 5, function(error, pageCount, items, itemCount) {
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

exports.find = function(req, res) {
    var page = req.param('page') || 1;
    var Section = mongoose.model('Section');
    Section.findOne({
        _id : req.params.id
    }, function(error, item) {
        if (error) {
            res.send(500);
        }
        history({
            type : 'Section',
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

exports.history = function(req, res) {
    var History = mongoose.model('History');
    var page = req.param('page') || 1;
    var cid = req.param('cid') || 1;
    History.paginate({
        type : 'Section',
        cid : cid
    }, page, 5, function(error, pageCount, items, itemCount) {
        if (error) {
            console.error(error);
        } else {
            res.json({
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