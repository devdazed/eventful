/*!
 * node-event-log
 * Copyright(c) 2011 Russell Bradberry <rbradberry@gmail.com>
 * MIT Licensed
 */
 
var EventEmitter = require('events').EventEmitter,
    util = require('./utility'),
    fs = require('fs');

/**
 * EventLogger, automatically logs events emitted by EventEmitters
 * @constructor
 * @version 0.0.1
 */
var EventLogger = function(defaults){
  this.defaults = defaults || { 
    info:{
      format:"[%YYYY-%DD-%MM %HH:%MI:%SS]\tINFO\t%EV\t%TX",
      exclude:['error'],
      only:[],
      to:function(text){ console.log(text); }
    },
    error:{
      format:"[red][%YYYY-%DD-%MM %HH:%MI:%SS]\tERROR\t%EV\t%TX[/red]",
      exclude:[],
      only:['error'],
      to:function(text){ console.log(text); }
    }
  };
};

/**
 * Attaches an emitter's events to the logger
 * @param {EventEmitter} emitter The EventEmitter to attach
 * @param {Object} options The non-default options to use
 */
EventLogger.prototype.attach = function(emitter, options){
  if (typeof emitter.emit !== 'function'){
    throw("The first argument must be an EventEmitter");
  }
  
  var self = this, level,
      emit = emitter.emit,
      defaultOptions = {
        format:"[%YYYY-%DD-%MM %HH:%MI:%SS]\t%EV\t%TX",
        exclude:[],
        only:[],
        to:function(text){ console.log(text); }
      };
  
  //ensure we have some options
  if (typeof options === 'undefined'){
    options = this.defaults;
  }

  //esure our log levels have all the required information
  for(level in options){
    util.extend(options[level], defaultOptions);
  }
  
  Object.defineProperty(emitter, 'emit', {
    configurable:true,
    get:function(){ return function(){
      var ret = emit.apply(emitter, arguments);
      self.log(options, arguments);
      return ret;
    };}
  });
};

/**
 * Removes an emitter's events from the logger
 * @param {EventEmitter} emitter The EventEmitter to remove from logging
 */
EventLogger.prototype.detach = function(emitter){
  return delete emitter.emit;
};

/**
 * Logs the event according to the format given
 * @param {Object} options The options for formatting the output
 * @param {Arguments} args The arguments from the event emitted
 */
EventLogger.prototype.log = function(options, args){
  if (args.length === 0){ return; }

  var name = args[0],
      i = 1, level,
      data = [], 
      text = "",
      date = new Date();

  if (args.length > 1){
    for (; i < args.length; i += 1){
      data.push(util.node.inspect(args[i]));
    }
  }

  for(level in options){
    if (options[level].exclude.length && options[level].exclude.indexOf(name) > -1){ continue; }
    if (options[level].only.length && options[level].only.indexOf(name) === -1){ continue; }
    if (typeof options[level].to === 'undefined'){ 
      throw("Must specify a file or callback to log to in:" + level);
    }

    text = this.format(date, name, util.node.inspect(data), options[level].format);
    if (typeof options[level].to === 'function'){
      options[level].to(text);
    } else {
      //TODO: Make it append to a file
    }
  }
};

/**
 * Formats the event text to be logged
 * @param {Date} date The date the event took place
 * @param {String} name The event name
 * @param {String} text The event text
 * @returns {String} The formatted event text
 * Valid Formatting Options are:
 *    %XX   - The unix epoch
 *    %YYYY - Four digit year
 *    %MM   - Two digit month (eg. 01, 02, 10, 11)
 *    %DD   - Two digit day 
 *    %HH   - Two digit hour
 *    %MI   - Two digit minute
 *    %SS   - Two digit second
 *    %MS   - Milliseconds (eg. 1, 2, 987)
 *    %EV   - The event name
 *    %TX   - The event text JSON String of the event's arguments
 *
 * Additionally, you can wrap text in style brackets:
 * Valid colors are: red, white, blue, green, purple, cyan, yellow, bold, under, blink
 * Example:
 *    "[bold]%YYYY-%MM-%DD INFO[green] %EV [/green] [blue]%TX[/blue][/bold] "
 *    This will be bold and print the date and the word INFO in the default console color, 
 *    the event name in green and the event text in blue
 */
EventLogger.prototype.format = function(date, name, text, format){
  var value = format;
  value = value.replace(/\%XX/gi, Math.floor(date.getTime()/1000));
  value = value.replace(/\%YYYY/gi, date.getFullYear());
  value = value.replace(/\%MM/gi, util.zeroize(date.getMonth()+1));
  value = value.replace(/\%DD/gi, util.zeroize(date.getDate()));
  value = value.replace(/\%HH/gi, util.zeroize(date.getHours()));
  value = value.replace(/\%MI/gi, util.zeroize(date.getMinutes()));
  value = value.replace(/\%SS/gi, util.zeroize(date.getSeconds()));
  value = value.replace(/\%MS/gi, date.getMilliseconds());
  value = value.replace(/\%EV/gi, name);
  value = value.replace(/\%TX/gi, text);
  value = util.stylize(value);
  return value;
};

/**
 * Library version.
 * @static
 */
EventLogger.version = EventLogger.prototype.version = '0.0.1';
module.exports = EventLogger;