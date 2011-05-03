/*!
 * node-event-log
 * Copyright(c) 2011 Russell Bradberry <rbradberry@gmail.com>
 * MIT Licensed
 */
 
var fs = require('fs'),
    util = require('./utility');

/**
 * EventLogger, automatically logs events emitted by EventEmitters
 * @constructor
 * @version 0.1.0
 */
var Eventful = function(defaults){
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
      to:function(text){ util.node.error(text); }
    }
  };
};

/**
 * Attaches an emitter's events to the logger
 * @param {EventEmitter} emitter The EventEmitter to attach
 * @param {Object} options The non-default options to use
 */
Eventful.prototype.attach = function(emitter, options){
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
    if (this.defaults[level]){
      util.extend(options[level], this.defaults[level]);
    } else {
      util.extend(options[level], defaultOptions);  
    }
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
Eventful.prototype.detach = function(emitter){
  return delete emitter.emit;
};

/**
 * Logs the event according to the format given
 * @param {Object} options The options for formatting the output
 * @param {Arguments} args The arguments from the event emitted
 */
Eventful.prototype.log = function(options, args){
  if (args.length === 0){ return; }

  var name = args[0],
      i = 1, level,
      data = [], 
      text = "",
      date = new Date();
      
  for (; i < args.length; i += 1){
    data.push(args[i]);
  }
  
  if (data.length === 1){ data = data[0]; }
  if (data.length === 0){ data = null; }
  
  for(level in options){
    if (options[level].exclude.length && options[level].exclude.indexOf(name) > -1){ continue; }
    if (options[level].only.length && options[level].only.indexOf(name) === -1){ continue; }
    
    if (typeof options[level].to === 'undefined'){ 
      throw("Must specify a file or callback to log to in:" + level);
    }
    
    text = (typeof options[level].customFormatter === 'function') ? 
      options[level].customFormatter(date, name, data) :
      this.format(date, name, data, options[level].format);
    
    if(typeof text !== 'string'){ text = util.node.inspect(text); } //in case some dipshit didnt return a string
    
    if (typeof options[level].to === 'function'){
      options[level].to(text);
    } else {
      fs.createWriteStream(options[level].to, {flags:'a'})
        .on('open', function(){ 
          this.end(text + '\n', 'utf8'); 
        });
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
 * Valid styles are: red, white, blue, green, purple, cyan, yellow, bold, under, blink
 * Example:
 *    "[bold]%YYYY-%MM-%DD INFO[green] %EV [/green] [blue]%TX[/blue][/bold] "
 *    This will be bold and print the date and the word INFO in the default console color, 
 *    the event name in green and the event text in blue
 */
Eventful.prototype.format = function(date, name, args, format){
  var text = "", value = format;
  
  if (args){
    text = util.node.inspect(util.node.inspect(args, false, 3));
  }

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
Eventful.version = Eventful.prototype.version = '0.1.0';
module.exports = Eventful;