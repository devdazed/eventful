/* automatically generated by JSCoverage - do not edit */
if (typeof _$jscoverage === 'undefined') _$jscoverage = {};
if (! _$jscoverage['node-event-log.js']) {
  _$jscoverage['node-event-log.js'] = [];
  _$jscoverage['node-event-log.js'][7] = 0;
  _$jscoverage['node-event-log.js'][15] = 0;
  _$jscoverage['node-event-log.js'][16] = 0;
  _$jscoverage['node-event-log.js'][29] = 0;
  _$jscoverage['node-event-log.js'][30] = 0;
  _$jscoverage['node-event-log.js'][31] = 0;
  _$jscoverage['node-event-log.js'][34] = 0;
  _$jscoverage['node-event-log.js'][35] = 0;
  _$jscoverage['node-event-log.js'][36] = 0;
  _$jscoverage['node-event-log.js'][37] = 0;
  _$jscoverage['node-event-log.js'][45] = 0;
  _$jscoverage['node-event-log.js'][46] = 0;
  _$jscoverage['node-event-log.js'][48] = 0;
  _$jscoverage['node-event-log.js'][53] = 0;
  _$jscoverage['node-event-log.js'][54] = 0;
  _$jscoverage['node-event-log.js'][55] = 0;
  _$jscoverage['node-event-log.js'][59] = 0;
  _$jscoverage['node-event-log.js'][60] = 0;
  _$jscoverage['node-event-log.js'][88] = 0;
  _$jscoverage['node-event-log.js'][89] = 0;
  _$jscoverage['node-event-log.js'][90] = 0;
  _$jscoverage['node-event-log.js'][91] = 0;
  _$jscoverage['node-event-log.js'][92] = 0;
  _$jscoverage['node-event-log.js'][93] = 0;
  _$jscoverage['node-event-log.js'][94] = 0;
  _$jscoverage['node-event-log.js'][95] = 0;
  _$jscoverage['node-event-log.js'][96] = 0;
  _$jscoverage['node-event-log.js'][97] = 0;
  _$jscoverage['node-event-log.js'][98] = 0;
  _$jscoverage['node-event-log.js'][99] = 0;
  _$jscoverage['node-event-log.js'][100] = 0;
  _$jscoverage['node-event-log.js'][101] = 0;
  _$jscoverage['node-event-log.js'][108] = 0;
  _$jscoverage['node-event-log.js'][110] = 0;
}
_$jscoverage['node-event-log.js'][7]++;
var EventEmitter = require("events").EventEmitter, util = require("./utility");
_$jscoverage['node-event-log.js'][15]++;
var EventLogger = (function () {
  _$jscoverage['node-event-log.js'][16]++;
  this.defaults = {location: "console", only: [], exclude: [], format: "%YYYY-%DD-%MM %HH:%MI:%SS.%MS\t\tINFO\t%EV\t%TX"};
});
_$jscoverage['node-event-log.js'][29]++;
EventLogger.prototype.attach = (function (emitter, options) {
  _$jscoverage['node-event-log.js'][30]++;
  var self = this;
  _$jscoverage['node-event-log.js'][31]++;
  options = util.extend(options, this.defaults);
  _$jscoverage['node-event-log.js'][34]++;
  emitter.__emit__ = emitter.emit;
  _$jscoverage['node-event-log.js'][35]++;
  emitter.emit = (function () {
  _$jscoverage['node-event-log.js'][36]++;
  emitter.__emit__.apply(this, arguments);
  _$jscoverage['node-event-log.js'][37]++;
  self.logEvent(options, arguments);
});
});
_$jscoverage['node-event-log.js'][45]++;
EventLogger.prototype.logEvent = (function (options, args) {
  _$jscoverage['node-event-log.js'][46]++;
  if (args.length === 0) {
    _$jscoverage['node-event-log.js'][46]++;
    return;
  }
  _$jscoverage['node-event-log.js'][48]++;
  var name = args[0], i = 1, data = [], date = new Date();
  _$jscoverage['node-event-log.js'][53]++;
  if (args.length > 1) {
    _$jscoverage['node-event-log.js'][54]++;
    for (; i < args.length; i += 1) {
      _$jscoverage['node-event-log.js'][55]++;
      data.push(util.node.inspect(args[i]));
}
  }
  _$jscoverage['node-event-log.js'][59]++;
  var text = this.formatEvent(date, name, data.join(","), options.format);
  _$jscoverage['node-event-log.js'][60]++;
  console.log(text);
});
_$jscoverage['node-event-log.js'][88]++;
EventLogger.prototype.formatEvent = (function (date, name, text, format) {
  _$jscoverage['node-event-log.js'][89]++;
  var value = format;
  _$jscoverage['node-event-log.js'][90]++;
  value = value.replace(/\%XX/gi, Math.floor(date.getTime() / 1000));
  _$jscoverage['node-event-log.js'][91]++;
  value = value.replace(/\%YYYY/gi, date.getFullYear());
  _$jscoverage['node-event-log.js'][92]++;
  value = value.replace(/\%MM/gi, util.zeroize(date.getMonth() + 1));
  _$jscoverage['node-event-log.js'][93]++;
  value = value.replace(/\%DD/gi, util.zeroize(date.getDate()));
  _$jscoverage['node-event-log.js'][94]++;
  value = value.replace(/\%HH/gi, util.zeroize(date.getHours()));
  _$jscoverage['node-event-log.js'][95]++;
  value = value.replace(/\%MI/gi, util.zeroize(date.getMinutes()));
  _$jscoverage['node-event-log.js'][96]++;
  value = value.replace(/\%SS/gi, util.zeroize(date.getSeconds()));
  _$jscoverage['node-event-log.js'][97]++;
  value = value.replace(/\%MS/gi, date.getMilliseconds());
  _$jscoverage['node-event-log.js'][98]++;
  value = value.replace(/\%EV/gi, name);
  _$jscoverage['node-event-log.js'][99]++;
  value = value.replace(/\%TX/gi, text);
  _$jscoverage['node-event-log.js'][100]++;
  value = util.stylize(value);
  _$jscoverage['node-event-log.js'][101]++;
  return value;
});
_$jscoverage['node-event-log.js'][108]++;
EventLogger.version = EventLogger.prototype.version = "0.0.1";
_$jscoverage['node-event-log.js'][110]++;
module.exports = EventLogger;
_$jscoverage['node-event-log.js'].source = ["/*!"," * node-event-log"," * Copyright(c) 2011 Russell Bradberry &lt;rbradberry@gmail.com&gt;"," * MIT Licensed"," */"," ","var EventEmitter = require('events').EventEmitter,","    util = require('./utility');","","/**"," * EventLogger, automatically logs events emitted by EventEmitters"," * @constructor"," * @version 0.0.1"," */","var EventLogger = function(){","  this.defaults = { ","    location:'console', ","    only:[],","    exclude:[],","    format:\"%YYYY-%DD-%MM %HH:%MI:%SS.%MS\\t\\tINFO\\t%EV\\t%TX\" ","  };","};","","/**"," * Attaches an emitter's events to the logger"," * @param {EventEmitter} emitter The EventEmitter to attach"," * @param {Object} options The non-default options to use"," */","EventLogger.prototype.attach = function(emitter, options){","  var self = this;","  options = util.extend(options, this.defaults);","  ","  //we override emit to allow us to track all events without attaching listeners","  emitter.__emit__ = emitter.emit;","  emitter.emit = function(){","    emitter.__emit__.apply(this, arguments);","    self.logEvent(options, arguments);","  };","};","","/**"," * Logs the event according to the format given"," * @param {Object} "," */","EventLogger.prototype.logEvent = function(options, args){","  if (args.length === 0){ return; }","  ","  var name = args[0],","      i = 1,","      data = [], ","      date = new Date();","  ","  if (args.length &gt; 1){","    for (; i &lt; args.length; i += 1){","      data.push(util.node.inspect(args[i]));","    }","  }","","  var text = this.formatEvent(date, name, data.join(','), options.format);","  console.log(text);","};","","/**"," * Formats the event text to be logged"," * @param {Date} date The date the event took place"," * @param {String} name The event name"," * @param {String} text The event text"," * @returns {String} The formatted event text"," * Valid Formatting Options are:"," *    %XX   - The unix epoch"," *    %YYYY - Four digit year"," *    %MM   - Two digit month (eg. 01, 02, 10, 11)"," *    %DD   - Two digit day "," *    %HH   - Two digit hour"," *    %MI   - Two digit minute"," *    %SS   - Two digit second"," *    %MS   - Milliseconds (eg. 1, 2, 987)"," *    %EV   - The event name"," *    %TX   - The event text JSON String of the event's arguments"," *"," * Additionally, you can wrap text in style brackets:"," * Valid colors are: red, white, blue, green, purple, cyan, yellow, bold, under, blink"," * Example:"," *    \"%YYYY-%MM-%DD [bold]INFO[/bold] [green] %EV [/green] [blue]%TX[/blue]\""," *    This will print the date and the word INFO bolded in the default console color, "," *    the event name in green and the event text in blue"," */","EventLogger.prototype.formatEvent = function(date, name, text, format){","  var value = format;","  value = value.replace(/\\%XX/gi, Math.floor(date.getTime()/1000));","  value = value.replace(/\\%YYYY/gi, date.getFullYear());","  value = value.replace(/\\%MM/gi, util.zeroize(date.getMonth()+1));","  value = value.replace(/\\%DD/gi, util.zeroize(date.getDate()));","  value = value.replace(/\\%HH/gi, util.zeroize(date.getHours()));","  value = value.replace(/\\%MI/gi, util.zeroize(date.getMinutes()));","  value = value.replace(/\\%SS/gi, util.zeroize(date.getSeconds()));","  value = value.replace(/\\%MS/gi, date.getMilliseconds());","  value = value.replace(/\\%EV/gi, name);","  value = value.replace(/\\%TX/gi, text);","  value = util.stylize(value);","  return value;","};","","/**"," * Library version."," * @static"," */","EventLogger.version = EventLogger.prototype.version = '0.0.1';","","module.exports = EventLogger;"];