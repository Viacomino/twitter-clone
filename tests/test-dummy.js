'use strict'

var fs = require('fs')

describe('Simple tests:', function() {
  it("Check if file dummy exists", function(done) {
    fs.exists('dummy', function(exists) {
      if (!exists) {
        return done(new Error('File dummy doesn\'t exist'))
      }
      done(null)
    })
  })
})