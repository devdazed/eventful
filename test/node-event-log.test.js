/**
 * Module dependencies.
 */
var EventLogger = require('node-event-log'),
    EventEmitter = require('events').EventEmitter,
    logger = new EventLogger(),
    emitter = new EventEmitter(),
    test = module.exports,
    should = require('should');

test['.version'] = function(){
  logger.version.should.match(/^\d+\.\d+\.\d+$/);  
};

