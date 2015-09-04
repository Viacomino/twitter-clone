var _ = require('lodash')
  , express = require('express')
  , app = express()
  , config = require('./config')

require('./middleware')(app)
require('./router')(app)

var server = app.listen(config.get('server:port'), config.get('server:host'))

module.exports = server