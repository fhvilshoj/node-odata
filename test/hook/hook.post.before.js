var bookSchema, conn, odata, request, should, support;

should = require('should');

request = require('supertest');

odata = require('../../.');

support = require('../support');

conn = 'mongodb://localhost/odata-test';

bookSchema = {
  author: String,
  description: String,
  genre: String,
  price: Number,
  publish_date: Date,
  title: String
};

describe('hook.post.before', function() {
  it('should work', function(done) {
    var PORT, server;
    PORT = 0;
    server = odata(conn);
    server.resource('book', bookSchema).post().before(function(entity) {
      entity.should.be.have.property('title');
      return done();
    });
    return support(conn, function(books) {
      var s;
      return s = server.listen(PORT, function() {
        PORT = s.address().port;
        return request("http://localhost:" + PORT).post("/book").send({
          title: 'new'
        }).end();
      });
    });
  });
  return it('should work with multiple hooks', function(done) {
    var PORT, doneTwice, server;
    PORT = 0;
    doneTwice = function() {
      return doneTwice = done;
    };
    server = odata(conn);
    server.resource('book', bookSchema).post().before(function(entity) {
      return doneTwice();
    }).before(function(entity) {
      return doneTwice();
    });
    return support(conn, function(books) {
      var s;
      return s = server.listen(PORT, function() {
        PORT = s.address().port;
        return request("http://localhost:" + PORT).post("/book").send({
          title: 'new'
        }).end();
      });
    });
  });
});

// ---
// generated by coffee-script 1.9.2