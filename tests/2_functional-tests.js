/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

var threadId;
var threadIdToDel;

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      // add new thread
      test('New Thread', function(done) {
        chai.request(server)
        .post('/api/threads/freecodecamp')
        .send({text: "Now is the time for all good men to come to the aid of their country.", delete_password: 'abc123'})
        .end(function(err, res) {
          assert.equal(res.status, 200);          
          done();
        });
      });

      // add new thread to be deleted
      test('New Thread', function(done) {
        chai.request(server)
        .post('/api/threads/freecodecamp')
        .send({text: "Delete Me.", delete_password: 'deletePassword'})
        .end(function(err, res) {
          assert.equal(res.status, 200);          
          done();
        });
      });
    });
   });
    
    suite('GET', function() {
      test('Get Threads', function(done) {
        chai.request(server)
        .get('/api/threads/freecodecamp')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body[0], 'text'),
          assert.property(res.body[0], 'created_on'),
          assert.property(res.body[0], 'bumped_on'),
          assert.notProperty(res.body[0], 'reported'),
          assert.notProperty(res.body[0], 'delete_password'),
          assert.isNotNull(res.body[0].replies),
          assert.isArray(res.body[0].replies);
          threadIdToDel = res.body[0]._id;
          threadId = res.body[1]._id;
          done();
        });
      });
    });
    
    suite('DELETE', function() {
      test('Delete Thread - incorrect pass', function(done) {
        chai.request(server)
        .delete('/api/threads/freecodecamp/')
        .send({thread_id: threadIdToDel, delete_password: 'incorrect password'})
        .end(function(err, res) {
          assert.equal(res.status, 200);          
          assert.equal(res.text, 'incorrect password');
          done();
        });
      });

      test('Delete Thread - correct pass', function(done) {
        chai.request(server)
        .delete('/api/threads/freecodecamp/')
        .send({thread_id: threadIdToDel, delete_password: 'deletePassword'})
        .end(function(err, res) {
          assert.equal(res.status, 200);          
          assert.equal(res.text, 'success');
          done();
        });
      });
    });
    
    suite('PUT', function() {
      test('Report Thread', function(done) {
        chai.request(server)
        .put('/api/threads/freecodecamp/')
        .send({thread_id: threadId})
        .end(function(err, res) {
          assert.equal(res.status, 200);          
          assert.equal(res.text, 'success');
          done();
        });  
      });
    });
  
  suite('API ROUTING FOR /api/replies/:board', function() {

    var replyId;
    
    suite('POST', function() {
     
      test('Post Reply', function(done){
        chai.request(server)
        .post('/api/replies/freecodecamp')
        .send({thread_id: threadId, text: "Hey, JFK said that, didn't he?", delete_password: 'jfk1'})
        .end(function(err,res){
          assert.equal(res.status, 200);
          done();
        });
      });
    });
    
    suite('GET', function() {
      test('Get Thread', function(done) {
        chai.request(server)
        .get(`/api/replies/freecodecamp?thread_id=${threadId}`)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body[0], 'text'),
          assert.property(res.body[0], 'created_on'),
          assert.property(res.body[0], 'bumped_on'),
          assert.notProperty(res.body[0], 'reported'),
          assert.notProperty(res.body[0], 'delete_password'),
          assert.isNotNull(res.body[0].replies),
          assert.isArray(res.body[0].replies);
          threadId = res.body[0]._id;
          replyId = res.body[0].replies[0]._id;
          done();
        });
      });
    });
    
    suite('PUT', function() {
      test('Report Reply', function(done) {
        chai.request(server)
        .put('/api/replies/freecodecamp/')
        .send({thread_id: threadId, reply_id: replyId})
        .end(function(err, res) {
          assert.equal(res.status, 200);          
          assert.equal(res.text, 'success');
          done();
        });
      });
    });

    suite('DELETE', function() {
      test('Delete Reply - incorrect password', function(done) {
        chai.request(server)
        .delete('/api/replies/freecodecamp')
        .send({thread_id: threadId, reply_id: replyId, delete_password: 'notThePassword'})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        });
      });
    });
    
    suite('DELETE', function() {
      test('Delete Reply - correct password', function(done) {
        chai.request(server)
        .delete('/api/replies/freecodecamp')
        .send({thread_id: threadId, reply_id: replyId, delete_password: 'jfk1'})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
    });
  });
});

