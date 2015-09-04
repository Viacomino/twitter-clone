process.env.NODE_ENV = 'test'

var config = require('../config')
, mongoose = require('mongoose')
, request = require('supertest')
, expect = require('chai').expect
, async = require('async')

describe("Test /api/tweets", function() {

  var app = require('../index')
  , Session = require('supertest-session')({ app: app })
  , agent = new Session()

  before(function(done) {

    function dropDatabase(next) {
      var connection = mongoose.createConnection(
        config.get('database:host')
        , config.get('database:name')
        , config.get('database:port')
        , function(err) {
          if (err) {
            return next(err)
          }
          connection.db.dropDatabase(next)
        }
      )
    }

    function initAgent(next) {
      var testUser = { id: 'test'
      , name: 'Test'
      , password: 'test'
      , email: 'test@test.com' }
      agent
      .post('/api/users')
      .send({user: testUser})
      .expect(200, next)
    }

    async.series([dropDatabase, initAgent], done)

  })

  it("test scenario 1", function(done) {
    request(app)
    .post('/api/tweets')
    .send({tweet: {text: 'Test tweet', userId: 'test'}})
    .expect(403, done)
  })

  it("test scenario 2", function(done) {
    var tweet = { text: 'Test' }
    agent
    .post('/api/tweets')
    .send({ tweet: tweet })
    .expect(200)
    .end(function(err, response) {
      if (err) {
        return done(err)
      }
      try {
        expect(response.body).to.have.property('tweet')
        done(null)
      } catch(err) {
        done(err)
      }
    })
  })

})
