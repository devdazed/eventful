/*!
 * node-event-log
 * Copyright(c) 2011 Russell Bradberry <rbradberry@gmail.com>
 * MIT Licensed
 */
 
var EventEmitter = require('events').EventEmitter,
    util = require('./utility');

/**
 * EventLogger, automatically logs events emitted by EventEmitters
 * @constructor
 * @version 0.0.1
 */
var EventLogger = function(){
  this.defaults = { 
    info:{
      format:"%YYYY-%DD-%MM %HH:%MI:%SS\tINFO\t%EV\t%TX",
      exclude:['error'],
      to:'console'
    },
    error:{
      format:"[red]%YYYY-%DD-%MM %HH:%MI:%SS\tERROR\t%EV\t%TX[/red]",
      only:['error'],
      to:'console'
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
  
  options = util.extend(options, this.defaults);
  var self = this, emit = emitter.emit;
  
  //we override emit to allow us to track all events without attaching listeners
  //and we do it properly in non-enumarble properties
  Object.defineProperty(emitter, '__emit__', {
    set:function(){}, 
    get:function(){ return emit; }
  });
  
  Object.defineProperty(emitter, 'emit', {
    set:function(){}, 
    get:function(){ return function(){
      emitter.__emit__.apply(emitter, arguments);
      self.logEvent(options, arguments);
    };}
  });
};

/**
 * Logs the event according to the format given
 * @param {Object} options The options for formatting the output
 * @param {Arguments} args The arguments from the event emitted
 */
EventLogger.prototype.logEvent = function(options, args){
  if (args.length === 0){ return; }
  
  var name = args[0],
      i = 1,
      data = [], 
      date = new Date();
  
  if (args.length > 1){
    for (; i < args.length; i += 1){
      data.push(util.node.inspect(args[i]));
    }
  }

  var text = this.formatEvent(date, name, data.join('\t'), options.format);
  console.log(text);
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
EventLogger.prototype.formatEvent = function(date, name, text, format){
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