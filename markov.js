var markov = require('markov');
var fs = require('fs');
var util = require('util');

var m = markov();

var seed = fs.createReadStream('corpus.txt');
m.seed(seed, function() {
  var stdin = process.openStdin();
  util.print('> ');

  stdin.on('data', function(line) {
    var res = m.respond(line.toString()).join(' ');
    console.log(res);
    util.print('> ');
  });
});