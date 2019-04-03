// threads.js
// Handles request to /api/threads/{board}

var db = require('../data/db');

exports.postHandler = function postHandler(req, res) {
    var board = req.params.board;
    var text = req.body.text;
    var delPass = req.body.delete_password;

    db.addPost(board, text, delPass, function (err, data) {
        if (err) {
            res.send(err);
        }
        else {
            res.redirect(`/b/${board}/${data._id}`);
        }
    });
};

exports.getHandler = function getHandler(req, res, callback) {
    var board = req.params.board;

    db.getThreads(board, function(err, data) {
        if (err) {
            res.send(err);            
        }
        else {
            res.json(data);
        }
    });
}

exports.putHandler = function putHandler(req, res, callback) {
    var thread_id = req.body.thread_id;

    db.reportThread(thread_id, function(err, data) {
        if (err) {
            res.send(err);
        }
        else {
            if (data) {
                res.send('success');
            }
            else {
                res.send('failed to report thread');
            }
        }
    });
}

exports.deleteHandler = function deleteHandler(req, res,callback) {
    var thread_id = req.body.thread_id;
    var delete_password = req.body.delete_password;
    
    db.deleteThread(thread_id, delete_password, function(err, data) {
        if (err) {
            res.send(err);            
        }
        else {
            if (data) {
                res.send('success');
            }
            else {
                res.send('incorrect password');
            }
        }
    });
}