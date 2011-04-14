var Eventful = require('eventful'),
    logger = new Eventful(),
    http = require('http');

var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
});

logger.attach(server);
server.listen(8124, "127.0.0.1");