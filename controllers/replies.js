// replies.js
// Handles request to /api/replies/{board}

var db = require('../data/db');

exports.postHandler = function postHandler(req, res) {
    var board = req.params.board;
    var thread_id = req.body.thread_id;
    var text = req.body.text;
    var delPass = req.body.delete_password;

    db.addReply(thread_id, text, delPass, function (err, data) {
        if (err) {
            res.send(err);
        }
        else {
            res.redirect(`/b/${board}/{threadId}`);
        }
    });
};

exports.getHandler = function getHandler(req, res) {
    var thread_id = req.query.thread_id

    db.getThread(thread_id, function (err, data){
        if (err) {
            res.send(err);            
        }
        else {
            res.json(data);
        }
    });
}

exports.putHandler = function putHandler(req, res) {
    var thread_id = req.body.thread_id;
    var reply_id = req.body.reply_id;

    db.reportReply(thread_id, reply_id, function (err, data) {
        if (err) {
            res.send(err);            
        }
        else {
            if (data) {
                res.send('success');
            }
            else {
                res.send('failed to report reply');
            }
        }
    });
}

exports.deleteHandler = function deleteHandler(req, res) {
    var thread_id = req.body.thread_id;
    var reply_id = req.body.reply_id;
    var delete_password = req.body.delete_password;

    db.deleteReply(thread_id, reply_id, delete_password, function (err, data) {
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