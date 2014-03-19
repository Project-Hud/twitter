var OAuth = require('oauth')
  , oAuthConsumerKey = process.env.TWITTER_APPLICATION_KEY
  , oAuthConsumerSecret = process.env.TWITTER_APPLICATION_SECRET
  , twitterAccessToken = process.env.TWITTER_ACCESS_KEY
  , twitterAccessSecret = process.env.TWITTER_ACCESS_SECRET

module.exports = function (cb) {

  function detectTweetLinks(tweet) {
    // match protocol://address/path/file.extension?some=variable&another=asf%
    tweet = tweet.replace(
      /\b([a-zA-Z]+:\/\/[\w_.\-]+\.[a-zA-Z]{2,6}[\/\w\-~.?=&%#+$*!]*)\b/ig,
      '<a href=\'$1\' class=\'twitter-link\'>$1</a> '
    )

    // match #trendingtopics
    tweet = tweet.replace(
      /(^|\s)#(\w+)/g,
      '$1<a href=\'http://twitter.com/#search?q=$2\' class=\'twitter-link\'>#$2</a> '
    )

    // match @usernames
    tweet = tweet.replace(
      /(^|\s)@(\w+)/ig,
      '$1<a href=\'http://twitter.com/$2\' class=\'twitter-user\'>@$2</a> '
    )

    // match name@address
    tweet = tweet.replace(
      /\b([a-zA-Z][a-zA-Z0-9\_\.\-]*[a-zA-Z]*\@[a-zA-Z][a-zA-Z0-9\_\.\-]*[a-zA-Z]{2,6})\b/ig,
      '<a href=\'mailto://$1\' class=\'twitter-link\'>$1</a> '
    )

    return tweet
  }

  var oauth = new OAuth.OAuth
    ( 'https://api.twitter.com/oauth/request_token'
    , 'https://api.twitter.com/oauth/access_token'
    , oAuthConsumerKey
    , oAuthConsumerSecret
    , '1.0A'
    , null
    , 'HMAC-SHA1'
  )
  oauth.get
    ( 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=clockhud&count=1'
    , twitterAccessToken
    , twitterAccessSecret
    , function (e, data, res) {
      if (!e && data) {
        var tweet = JSON.parse(data)[0] || { text: '', user: { name: '' }}
        return cb(null, 
          { text: detectTweetLinks(tweet.text)
          , author: tweet.user.name 
          }
        )
      } else {
        return ret(e)
      }
  })
}