var express = require('express')
    , router = express.Router()
    , connection = require('../../db')
    , User = connection.model('User')
    , ensureAuthentication = require('../../middleware/ensureAuthentication')

// POST /api/users/
router.post('/', function (req, res) {
    var user = req.body.user

    User.create(user, function (err, user) {
        if (err) {
            var code = err.code === 11000 ? 409 : 500
            return res.sendStatus(code)
        }
        req.login(user, function (err) {
            if (err) {
                return res.sendStatus(500)
            }
            res.sendStatus(200)
        })
    })
})


// GET /api/users/:userId
router.get('/:userId', function (req, res) {
    User.findOne({id: req.params.userId}, function (err, user) {
        if (err) {
            return res.sendStatus(500)
        }
        if (!user) {
            return res.sendStatus(404)
        }
        res.send({user: user.toClient()})
    })
})

router.put('/:userId', ensureAuthentication, function (req, res) {
    var query = {id: req.params.userId}
        , update = {password: req.body.password}

    if (req.user.id !== req.params.userId) {
        return res.sendStatus(403)
    }

    User.findOneAndUpdate(query, update, function (err, user) {
        if (err) {
            return res.sendStatus(500)
        }
        res.sendStatus(200)
    })
})

router.post('/:userId/follow', ensureAuthentication, function(req, res) {
  var userId = req.params.userId

  User.findByUserId(userId, function(err, user) {
    if (err) {
      return res.sendStatus(500)
    }
    if (!user) {
      return res.sendStatus(403)
    }
    req.user.follow(userId, function(err) {
      if (err) {
        return res.sendStatus(500)
      }
      res.sendStatus(200)
    })
  })
})

router.post('/:userId/unfollow', ensureAuthentication, function(req, res) {
  req.user.unfollow(req.params.userId, function(err) {
    if (err) {
      return res.sendStatus(500)
    }
    res.sendStatus(200)
  })
})


router.get('/:userId/friends', function(req, res) {
  var userId = req.params.userId

  User.findByUserId(userId, function(err, user) {
    if (err) {
      return res.sendStatus(500)
    }
    if (!user) {
      return res.sendStatus(404)
    }
    user.getFriends(function(err, friends) {
      if (err) {
        return res.sendStatus(500)
      }
      var friendsList = friends.map(function(user) { return user.toClient() })
      res.send({ users: friendsList })
    })
  })
})

router.get('/:userId/followers', function(req, res) {
  var userId = req.params.userId

  User.findByUserId(userId, function(err, user) {
    if (err) {
      return res.sendStatus(500)
    }
    if (!user) {
      return res.sendStatus(404)
    }
    user.getFollowers(function(err, followers) {
      if (err) {
        return res.sendStatus(500)
      }
      var followersList = followers.map(function(user) { return user.toClient() })
      res.send({ users: followersList })
    })
  })
})


module.exports = router

// mentor solution
//router.get('/:userId/friends', function(req, res) {
//    var User = conn.model('User')
//        , userId = req.params.userId
//
//    User.findByUserId(userId, function(err, user) {
//        if (err) {
//            return res.sendStatus(500)
//        }
//        if (!user) {
//            return res.sendStatus(404)
//        }
//        user.getFriends(function(err, friends) {
//            if (err) {
//                return res.sendStatus(500)
//            }
//            var friendsList = friends.map(function(user) { return user.toClient() })
//            res.send({ users: friendsList })
//        })
//    })
//})

// mentor solution
//router.get('/:userId/followers', function(req, res) {
//    var User = conn.model('User')
//        , userId = req.params.userId
//
//    User.findByUserId(userId, function(err, user) {
//        if (err) {
//            return res.sendStatus(500)
//        }
//        if (!user) {
//            return res.sendStatus(404)
//        }
//        user.getFollowers(function(err, followers) {
//            if (err) {
//                return res.sendStatus(500)
//            }
//            var followersList = followers.map(function(user) { return user.toClient() })
//            res.send({ users: followersList })
//        })
//    })
//})

//router.post('/:userId/follow', ensureAuthentication, function (req, res) {
//    var query = {id: req.user.id}
//        , update = {$addToSet: {followingIds: req.params.userId}}
//
//    User.findOne({id: req.params.userId}, function (err, user) {
//        if (err) {
//            return res.sendStatus(500)
//        }
//        if (!user) {
//            return res.sendStatus(403)
//        }
//
//
//        console.log(req.user.id)
//        console.log(req.params.userId)
//
//        if (req.params.userId === null) {
//            return res.sendStatus(403)
//        }
//
//        User.findOneAndUpdate(query, update, function (err, user) {
//            if (err) {
//                return res.sendStatus(500)
//            }
//            res.sendStatus(200)
//        })
//    })
//})
