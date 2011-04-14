
# eventful

  EventEmitter based logging for node.js.
  
  Evenful is a very flexible logging system for your event emitters.  You can specify the format it is logged and what events are logged.  Eventful supports any event emitter and doesn't add any listeners.  By default, Eventful logs every event to the console as Info with a timestamp and all errors to the console (in red) with a timestamp and the error data.
  
  Eventful takes an optional constructor argument to override the defaults and has 2 methods, attach and detach.  Both attach and detach take an EventEmitter as the first argument, attach takes a second argument of options that extend defaults.
  
  The Eventful options object looks as such:
  
    {
      level:{
        format:"[%YYYY-%DD-%MM %HH:%MI:%SS]\tINFO\t%EV",
        only:[]
        exclude:[],
        to:function(text){ console.log(text); }
        customFormatter:function(date, event, arguments){ }
      }
    }

    [level]: is the log level, this can be anything you want is is mainly for your records
    [format]: is the format of the text to be logged see format
    [only]: an array of event names that will only be logged
    [exclude]: an array of event names to prevent form being logged
    [to]: if a function is supplied, it will be called back, if a string is supplied it will opend and append to that file
    [customFormatter]: a callback function for making your own formatter
    
Eventful takes the event and inspects all of the arguments to log the data, if you would like to override this behavior you can supply a custom formatter as such:

    { 
      level: {
        customFormatter:function(date, event, arguments){
          return date.getTime() + " " + event + " " + arguments[0];
        }
      }
    }

The parameters for the callback are "the date of the event", "the name of the event", "an array of arguments associated with the event"
Obviously,the above example is only useful if you know what argument 0 will be all the time, but you get the idea

## installation

    npm install eventful
    
## usage

    var Eventful = require('eventful'),
        logger = new Eventful(),
        http = require('http');

    var server = http.createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Hello World\n');
    });
    
    logger.attach(server);
    server.listen(8124, "127.0.0.1");
    
## formatting

    Valid Formatting Options are:
       %XX   - The unix epoch
       %YYYY - Four digit year
       %MM   - Two digit month (eg. 01, 02, 10, 11)
       %DD   - Two digit day 
       %HH   - Two digit hour
       %MI   - Two digit minute
       %SS   - Two digit second
       %MS   - Milliseconds (eg. 1, 2, 987)
       %EV   - The event name
       %TX   - The event text JSON String of the event's arguments
    
    Additionally, you can wrap text in style brackets:
    Valid styles are: red, white, blue, green, purple, cyan, yellow, bold, under, blink
    Example:
       "[bold]%YYYY-%MM-%DD INFO[green] %EV [/green] [blue]%TX[/blue][/bold] "
       This will be bold and print the date and the word INFO in the default console color, 
       the event name in green and the event text in blue
        
## advanced usage

    var Eventful = require('eventful'), 
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
    
## logging as JSON

    var Eventful = require('eventful'),
        logger = new Eventful(),
        http = require('http');
    
    var server = http.createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Hello World\n');
    });
    
    logger.attach(server, {
      info:{format:"{\"time\":%XX, \"event\":\"%EV\", \"level\":\"INFO\" \"data\":\"%TX\"}", exclude:['error']},
      error:{format:"{\"time\":%XX, \"event\":\"%EV\", \"level\":\"ERROR\" \"data\":\"%TX\"}", only:['error']},
    });
    
    server.listen(8124, "127.0.0.1");
    
## License 

(The MIT License)

Copyright (c) 2011 Russell Bradberry &lt;rbradberry@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.