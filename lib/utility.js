var Utility = {}, util = require('util');

/**
 * The original node utils, I don't want to prototype it as it is static.
 * @field
 * @static
 */
Utility.node = util;

/**
 * Extends an options with defaults if defaults are undefined
 * @static
 * @param {Object} options The options to be extended
 * @param {Object} defaults The defaults to populate the options with
 * @returns {Object} The modified options
 */
Utility.extend = function(options, defaults){
  options = options || {};
  defaults = defaults || {};
  for (var o in defaults){
    if (options[o] === undefined){
      options[o] = defaults[o]; 
    }    
  }
  return options;
};

/**
* Formats a string to be output as a specific color or style
* brackets with the style determine the style, (eg [bold] foo [/bold])
* @static
* @param {String} text The string to stylize
* @returns {String} The stylized string
*/
Utility.stylize = function(text){
  //A mapping of styles to their respective codes
  var style, regxp, styles = {
    bold: 1, 
    under: 4, 
    blink: 5, 
    red: 31, 
    green: 32, 
    purple: 35, 
    yellow: 33, 
    blue: 34, 
    cyan: 36, 
    white: 37
  };
  
  for (style in styles){
    regxp = new RegExp('\\[' + style + '](.*?)\\[/' + style + ']');
    text = text.replace(regxp, '\x1B[' + styles[style] + 'm$1\x1B[0m');
  }
  return text;
};

/**
* Left pads single digits with a 0
* @static
* @param {Number} n The number to left pad with a 0
* @returns {String} The modified number
*/
Utility.zeroize = function(n) { 
  return (n.toString().length === 1) ? '0' + n : n; 
};

module.exports = Utility;