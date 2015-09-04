'use strict';

var express = require('express')
  , router = express.Router()
  , conn = require('../../db')
  , ensureAuthentication = require('../../middleware/ensureAuthentication')
  , Tweet = conn.model('Tweet')

router.get('/', ensureAuthentication, function(req, res) {
  var stream = req.query.stream
    , userId = req.query.userId
    , options = { sort: { created: -1 } }
    , query = null


  if (stream === 'home_timeline') {
    query = { userId: { $in: req.user.followingIds }}
  } else if (stream === 'profile_timeline' && userId) {
    query = { userId: userId }
  } else {
    return res.sendStatus(400)
  }

  Tweet.find(query, null, options, function(err, tweets) {
    if (err) {
      return res.sendStatus(500)
    }
    var responseTweets = tweets.map(function(tweet) { return tweet.toClient() })
    res.send({ tweets: responseTweets })
  })
})

router.post('/', ensureAuthentication, function(req, res) {
    var Tweet = conn.model('Tweet');
    var newTweet = new Tweet({
        text: req.body.tweet.text,
        created : Date.now() / 1000 | 0,
        userId : req.user.id
    });
    newTweet.save(function(err, newTweet) {
        if (err) {
            return res.status(500).json('Error occurred');
        }
        res.json({tweet: newTweet.toClient()});
    });

});

router.get('/:tweetId', function(req, res) {
    var Tweet = conn.model('Tweet');
    var searchTweet =  req.params.tweetId;

    Tweet.findById(searchTweet, function(err, tweet) {
        if (err) {
            return res.status(500).json({error: 'Error occurred'});
        }
        if(!tweet) {
            return res.sendStatus(404);
        }
        res.json({ tweet: tweet.toClient()});
    });

});

router.delete('/:tweetId', ensureAuthentication, function(req, res) {
    var Tweet = conn.model('Tweet');
    var searchTweet = req.params.tweetId;

    // I'll change this
    Tweet.findById({ _id: searchTweet }, function(err, tweet) {
        if(!tweet) {
            return res.sendStatus(404);
        }
        if(req.user.id !== tweet.userId) {
            return res.sendStatus(403);
        } else {
            tweet.remove(function(err) {
                if (err) {
                    return err;
                }
                res.sendStatus(200);
            });
        }
    });
});

module.exports = router;