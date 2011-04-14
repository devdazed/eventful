var Eventful = require('../'),
    util = require('util'),
    http = require('http');

var logger = new Eventful({
  level: {
    customFormatter:function(date, event, arguments){
      return date.getTime() + " " + event + " " + util.inspect(arguments[0] || "");
    }
  } 
});

var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
});

logger.attach(server);

server.listen(8124, "127.0.0.1");