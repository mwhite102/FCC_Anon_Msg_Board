// db.js
// Module for accessing mongoDb

var MongoClient = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var mongoose = require('mongoose');

// Supress deprecation warning in moongoose for useFindAndModify
mongoose.set('useFindAndModify', false);

var replySchema = new mongoose.Schema({
    text: String,
    created_on: Date,
    delete_password: String,
    reported : Boolean
});

var threadSchema = new mongoose.Schema({
    board: String,
    text: String,
    created_on: Date,
    bumped_on : Date,
    reported: Boolean,
    delete_password: String,
    replies: [replySchema]
});


var ThreadModel = mongoose.model('ThreadModel', threadSchema);

var ReplyModel = mongoose.model('ReplyModel', replySchema);

mongoose.connect(process.env.DB, {useNewUrlParser: true}, () => {
    console.log('Connected to database');
  });

  // exports

  exports.addPost = function addPost(board, text, password, callback) {
    var timeStamp = new Date();
        ThreadModel.create({
            board: board,
            text: text,
            created_on: timeStamp,
            bumped_on: timeStamp,
            reported: false,
            delete_password: password,
            replies: []
        }, function (err, post) {
            if (err) {
                return callback(err);
            }
            else {
                return callback(null, post);
            }
        })
  };

  exports.addReply = function addReply(thread_id, text, delete_password, callback) {
      var reply = {
        text: text,
        created_on: new Date(),
        delete_password: delete_password,
        reported : false
      };
      ThreadModel.findOneAndUpdate({_id: thread_id}, {$push: {replies: reply}, bumped_on: new Date()}, function(err, board) {
        if (err) {
            console.error (err);
            callback(err);
        }
        else {
            callback(null, board);
        }
    });

    
  };

  exports.getThreads = function getThreads(board, callback) {
    ThreadModel
    .find({board: board})
    .limit(10)
    .sort({bumped_on: -1})
    .select({
        '_id': 1,
        'text': 1,
        'created_on': 1,
        'bumped_on': 1,
        'replies._id': 1,
        'replies.text': 1,
        'replies.created_on': 1,
        'replies': {$slice: 3}})
    .exec(function (err, threads) {
        if (err) {
            console.error (err);
            callback(err);
        }
        else {
            callback(null, threads);
        }
    });
};

exports.getThread = function getThread(thread_id, callback) {
    ThreadModel
    .find({_id: thread_id})
    .select({
        '_id': 1,
        'text': 1,
        'created_on': 1,
        'bumped_on': 1,
        'replies._id': 1,
        'replies.text': 1,
        'replies.created_on': 1})
    .exec(function (err, thread) {
        if (err) {
            console.error (err);
            callback(err);
        }
        else {
            callback(null, thread);
        }
    });    
};

exports.deleteThread = function deleteThread(thread_id, delete_password, callback) {
    ThreadModel
    .findOneAndDelete({_id: thread_id, delete_password: delete_password}, function(err, data) {
        if (err) {
            console.error (err);
            callback(err);
        }
        else {
            callback(null, data);
        }   
    });
};

exports.reportThread = function reportThread(thread_id, callback) {
    ThreadModel.findByIdAndUpdate({_id: thread_id}, {reported: true}, function(err, data) {
        if (err) {
            console.error (err);
            callback(err);
        }
        else {
            callback(null, data);
        }   
    });
};

exports.deleteReply = function deleteReply(thread_id, reply_id, delete_password, callback) {

    ThreadModel.findOneAndUpdate({'_id': thread_id, 'replies._id': reply_id, 'replies.delete_password': delete_password },
    {'$set': {'replies.$.text': '[deleted]'}},
    function(err, data) {
        if (err) {
            console.error (err);
            callback(err);
        }
        else {
            callback(null, data);
        }   
    });
};


exports.reportReply = function reportReply(thread_id, reply_id, callback) {
    // http://thecodebarbarian.com/a-nodejs-perspective-on-mongodb-36-array-filters.html
    ThreadModel.findByIdAndUpdate({_id: thread_id},
        {
            $set: {
                'replies.$[element].reported': true
            }
        },
        {
            arrayFilters: [{
                'element._id': reply_id,
            }]
        }
        )
        .then(function (data) {
            callback(null, data);
        }).catch(function (err) {
            callback(err)
        });
};

