var natural = require('natural'),
    classifier = new natural.BayesClassifier();

exports.ClassSpam = 'Spam';
exports.ClassHam = 'Ham';


exports.Load = function(callback){
    natural.BayesClassifier.load('../classifier.json', null, function(err, c) {
        classifier = c;
        callback();
    });
}

exports.GetClassification = function(str){
    return classifier.classify(str);
}
