
/**
 * Module dependencies.
 */

var node-event-log = require('node-event-log')
  , should = require('should');

module.exports = {
  'test .version': function(){
    node-event-log.version.should.match(/^\d+\.\d+\.\d+$/);
  }
};