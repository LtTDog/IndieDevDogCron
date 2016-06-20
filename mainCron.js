var twitter = require('./twitterConfigCron.js')
var classify = require('./ClassifyCron.js');

var searchQuery = '#indiedev OR #gamedev -RT';
var Tweets = [];
var blockedIDs = [];

function GetBlockedIDs(callback) {
    twitter.TwitClient.get('blocks/list', {
        include_entities: true,
        skip_status: true,
    }, function(error, reply) {
        if (error) return console.log(error);
        console.log('reply length ' + reply.users.length);
        for (var i = 0; i < reply.users.length; i++) {
            blockedIDs.push(reply.users[i]);
        }
        callback();
    });
}

function IsBlockedID(id) {
    console.log('checking if userid is blocked: ' + id);
    for (var i = 0; i < blockedIDs.length; i++) {
        if (blockedIDs[i].id_str == id) {
            return true;
        }
    }
    return false;
}

function GetLastID(callback) {
    console.log('Getting lastID');
    twitter.TwitClient.get('statuses/user_timeline', {
        user_id: "720274838573621249",
        count: 1
    }, function(error, reply) {
        if (reply[0] == undefined || error) return callback(null);
        return callback(reply[0].id_str);
    });
}

function SearchTwitter(lastID, callback) {
    console.log('SearchTwitter');
    twitter.TwitClient.get('search/tweets', {
        q: searchQuery,
        count: 100,
        lang: 'en',
        result_type: 'recent',
        show_all_inline_media: 'true',
        since_id: lastID
    }, function(error, reply) {
        if (error) return console.log(error);

        var tweets = reply.statuses;

        for (var i = 0; i < tweets.length; i++) {
            if (classify.GetClassification(tweets[i].text) != classify.ClassSpam) {
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

function PostRetweet(id_str) {
    console.log('posting: ' + id_str);
    twitter.TwitClient.post('statuses/retweet/:id', {
        id: id_str
    }, function(err, data, response) {
        if (err) {
            return;
        }
    });
}

function GetRandomTweet(callback) {
    console.log('getting RandomTweet');
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
    GetRandomTweet(function(RandomTweet) {
        if (RandomTweet != null) {
            if (!IsBlockedID(RandomTweet.id_str)) {
                PostRetweet(RandomTweet.id_str);
            } else {
                Retweet();
            }
        }
    });
}

function mainLoop() {
    classify.Load(function() {
        GetTweets(function() {
            GetBlockedIDs(function() {
                Retweet();
            });
        });
    });
}

mainLoop();
