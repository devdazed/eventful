var Eventful = require('../'), 
    util = require('util'),
    http = require('http');

var logger = new Eventful({
  info:{
    format:"[%YYYY-%DD-%MM %HH:%MI:%SS]\tINFO\t%EV",
    exclude:['error'],
    to:function(text){ console.log(text); }
  },
  error:{
    format:"[red][%YYYY-%DD-%MM %HH:%MI:%SS]\tERROR\t%EV\t%TX[/red]",
    only:['error'],
    to:function(text){ util.error(text); }
  },
  debug:{
    format:"[yellow][%YYYY-%DD-%MM %HH:%MI:%SS]\tDEBUG\t%EV\t%TX[/yellow]",
    to:function(text){ console.log(text); }
  }
});

var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
  logger.attach(req, {debug:{only:['data']}, info:{exclude:['data']}});
});

logger.attach(server, {error: {only:['error','clientError']}});
server.listen(8124, "127.0.0.1");