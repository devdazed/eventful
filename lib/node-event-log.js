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
    location:'console', 
    only:[],
    exclude:[],
    format:"%YYYY-%DD-%MM %HH:%MI:%SS.%MS\t\tINFO\t%EV\t%TX" 
  };
};

/**
 * Attaches an emitter's events to the logger
 * @param {EventEmitter} emitter The EventEmitter to attach
 * @param {Object} options The non-default options to use
 */
EventLogger.prototype.attach = function(emitter, options){
  var self = this;
  options = util.extend(options, this.defaults);
  
  //we override emit to allow us to track all events without attaching listeners
  emitter.__emit__ = emitter.emit;
  emitter.emit = function(){
    emitter.__emit__.apply(this, arguments);
    self.logEvent(options, arguments);
  };
};

/**
 * Logs the event according to the format given
 * @param {Object} 
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

  var text = this.formatEvent(date, name, data.join(','), options.format);
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