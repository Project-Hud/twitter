var Widget = new require('hud-widget')
  , widget = new Widget()
  , getLatestTweet = require('./lib/latest-tweet') 

widget.get('/', function (req, res) {
  getLatestTweet(function (err, tweet) {
    if (err) {
      console.log(err)
      return res.send(500, { error: err })
    }

    res.render('index', { title: 'Twitter', tweet: tweet })  
  })
})

widget.get('/latest', function (req, res) {
  getLatestTweet(function (err, tweet) {
    if (err) {
      console.log(err)
      return res.send(500, { error: err })
    }
    res.send(tweet)  
  })
})
