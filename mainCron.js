var twitter = require('./twitterConfigCron.js')
var classify = require('./ClassifyCron.js');

var searchQuery = '#indiedev OR #gamedev -RT';
var Tweets = [];



function GetLastID(callback) {
    twitter.TwitClient.get('statuses/user_timeline', {
        user_id: "720274838573621249",
        count: 1
    }, function(error, reply) {
        if(reply[0] == undefined || error) return callback(null);
        return callback(reply[0].id_str);
    });
}

function SearchTwitter(lastID, callback) {
    twitter.TwitClient.get('search/tweets', {
        q: searchQuery,
        count: 100,
        lang: 'en',
        result_type: 'recent',
        show_all_inline_media: 'true',
        since_id: lastID
    },function(error, reply) {
        if (error) return callback(error);

        var tweets = reply.statuses;

        for (var i = 0; i < tweets.length; i++) {
            if(classify.GetClassification(tweets[i].text) != classify.ClassSpam){
              Tweets.push(tweets[i]);
            }
        }
        callback();
    });
}

function GetTweets(callback) {
    GetLastID(function(lastID) {
        SearchTwitter(lastID, function() {
            callback();
        });
    });
}

function PostRetweet(id_str){
    twitter.TwitClient.post('statuses/retweet/:id', { id: id_str }, function (err, data, response) {
  if(err){
    return;
  }
});
}

function GetRandomTweet(callback) {
    var tcount = Tweets.length;
    if (tcount > 0) {
        var r = Math.floor((Math.random() * tcount));
        var RandomTweet = Tweets[r];
        if (RandomTweet != null) {
            return callback(RandomTweet);
        }
    }
    return callback(null);
}

function Retweet() {
    classify.Load(function(){
      GetTweets(function() {
          GetRandomTweet(function(RandomTweet) {
              PostRetweet(RandomTweet.id_str);
          });
      });
    });
}

Retweet();
