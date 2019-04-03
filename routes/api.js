/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var threads = require('../controllers/threads');
var replies = require('../controllers/replies');

var expect = require('chai').expect;

module.exports = function (app) {
  
  app.route('/api/threads/:board')
     .post(threads.postHandler)
     .get(threads.getHandler)
     .put(threads.putHandler)
     .delete(threads.deleteHandler);
    
  app.route('/api/replies/:board')
     .post(replies.postHandler)
     .get(replies.getHandler)
     .put(replies.putHandler)
     .delete(replies.deleteHandler);
};
