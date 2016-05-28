'use strict';

var chalk = require('chalk');

// Use "\x1B[K" to clear the line backgorund color
// because there might be some colored whitespace if terminal scrolls the view
var CLEAR_COLOR = '\x1B[K';


function createColorFormatter(options) {
  options = options || {};

  function addStyles(string, styles) {
    if (!options.enabled) {
      return chalk.inverse(string);
    }

    var out = string;
    (styles || []).forEach(function (style) {
      if (style) {
        out = chalk[style](out);
      }
    });

    out += CLEAR_COLOR;

    return out;
  }

  function actual(string) {
    var styles = [
      options.hasOwnProperty('actualBg') ? options.actualBg : 'bgGreen',
      options.hasOwnProperty('actualFg') ? options.actualFg : 'white'
    ];
    return addStyles(string, styles);
  }

  function expected(string) {
    var styles = [
      options.hasOwnProperty('expectedBg') ? options.expectedBg : 'bgRed',
      options.hasOwnProperty('expectedFg') ? options.expectedFg : 'white'
    ];
    return addStyles(string, styles);
  }

  function defaults(string) {
    var styles = [
      options.defaultFg,
      options.defaultBg
    ];
    return addStyles(string, styles);
  }

  return {
    actual: actual,
    expected: expected,
    defaults: defaults
  };
}

module.exports = createColorFormatter;
