/**
 * Module dependencies.
 */
 /**
 var EventEmitter = require('events').EventEmitter
 var Eventful = require('./')
 var a = new EventEmitter()
 var b = new EventEmitter()
 var logger = new Eventful()
 logger.attach(a)
 */
var Eventful = require('eventful'),
    EventEmitter = require('events').EventEmitter,
    logger = new Eventful(),
    test = module.exports,
    should = require('should');

test['.version'] = function(){
  logger.version.should.match(/^\d+\.\d+\.\d+$/);  
};

test['.attach'] = function(){
  var emitter = new EventEmitter();
  logger.attach(emitter);
  emitter.should.respondTo('__emit__');
  emitter.should.respondTo('emit');
  emitter.emit.should.not.equal(emitter.__emit__);
};

test['emitter.emit'] = function(){
  var emitter = new EventEmitter();
  logger.attach(emitter);
  emitter.emit('test');
};