var crypto = require('crypto');
var i18n = require('i18n');
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {
	console.log(i18n.__('Database successfully started!'));
	var Schema = mongoose.Schema;

	var validatePresenceOf = function(value) {
		return value && value.length;
	};

	// USER
	var User = new Schema({
		email : {
			type : String,
			validate : [ validatePresenceOf, i18n.__('Email is required') ],
			index : {
				unique : true
			}
		},
		hashed_password : String,
		salt : String,
		name : {
			type : String,
			required : true
		},
		managerType : {
			type : String,
			required : true,
			'default' : 'NORMAL'
		},
		status : {
			type : String,
			required : true,
			'default' : 'ACTIVE'
		},
		modified : {
			type : Date,
			'default' : Date.now
		}
	});

	User.virtual('id').get(function() {
		return this._id.toHexString();
	});

	User.virtual('password').set(function(password) {
		this._password = password;
		this.salt = this.makeSalt();
		this.hashed_password = this.encryptPassword(password);
	}).get(function() {
		return this._password;
	});

	User.method('authenticate', function(plainText) {
		return this.encryptPassword(plainText) === this.hashed_password;
	});

	User.method('makeSalt', function() {
		return Math.round((new Date().valueOf() * Math.random())) + '';
	});

	User.method('encryptPassword', function(password) {
		return crypto.createHmac('sha1', this.salt).update(password).digest(
				'hex');
	});

	User.pre('save', function(next) {
		if (!validatePresenceOf(this.password)) {
			next(new Error(i18n.__('Invalid password')));
		} else {
			next();
		}
	});

	User.plugin(mongoosePaginate);

	// SECTION
	var Section = new Schema({
		code : {
			type : String,
			unique : true,
			required : true
		},
		name : {
			type : String,
			required : true
		},
		description : {
			type : String,
			required : true
		},
		modified : {
			type : Date,
			'default' : Date.now
		},
		user : {
			type : Schema.Types.ObjectId,
			ref : 'User'
		}
	});

	Section.plugin(mongoosePaginate);

	// CATEGORY
	var Category = new Schema({
		code : {
			type : String,
			unique : true,
			required : true
		},
		name : {
			type : String,
			required : true
		},
		description : {
			type : String,
			required : true
		},
		modified : {
			type : Date,
			'default' : Date.now
		},
		user : {
			type : Schema.Types.ObjectId,
			ref : 'User'
		}
	});

	Category.virtual('id').get(function() {
		return this._id.toHexString();
	});

	Category.plugin(mongoosePaginate);

	// CONTENT
	var Content = new Schema({
		section : {
			type : Schema.Types.ObjectId,
			ref : 'Section'
		},
		category : {
			type : Schema.Types.ObjectId,
			ref : 'Category'
		},
		title : {
			type : String,
			required : true
		},
		subtitle : {
			type : String,
			required : true
		},
		initialText : {
			type : String,
			required : true
		},
		fullText : {
			type : String,
			required : true
		},
		views : {
			type : Number,
			'default' : 0
		},
		clicks : {
			type : Number,
			'default' : 0
		},
		url : {
			type : String
		},
		target : {
			type : String
		},
		position : {
			type : String
		},
		modified : {
			type : Date,
			'default' : Date.now
		},
		status : {
			type : String,
			'default' : 'PENDING'
		},
		user : {
			type : Schema.Types.ObjectId,
			ref : 'User'
		}
	});

	Content.virtual('id').get(function() {
		return this._id.toHexString();
	});

	Content.plugin(mongoosePaginate);

	var UserModel = mongoose.model('User', User);
	mongoose.model('Section', Section);
	mongoose.model('Category', Category);
	mongoose.model('Content', Content);
	UserModel.find({}, function(error, items) {
		if (items.length === 0) {
			var user = new UserModel({
				email : 'admin@activethread.com.br',
				password : '123456',
				name : 'Administer',
				managerType : 'ADMIN'
			});
			user.save(function(error, user) {
			});
		}
	});
});

mongoose.connect('mongodb://localhost/portal');