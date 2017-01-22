'use strict';

var chalk = require('chalk');

// Use "\x1B[K" to clear the line backgorund color
// because there might be some colored whitespace if terminal scrolls the view
var CLEAR_COLOR = '\x1B[K';


function getOwnProperty(object, prop, defaultValue) {
  return object.hasOwnProperty(prop) ? object[prop] : defaultValue;
}


function createColorHighlighter(options) {
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
      getOwnProperty(options, 'actualBg', 'bgGreen'),
      getOwnProperty(options, 'actualFg', 'white')
    ];
    return addStyles(string, styles);
  }

  function expected(string) {
    var styles = [
      getOwnProperty(options, 'expectedBg', 'bgRed'),
      getOwnProperty(options, 'expectedFg', 'white')
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

  function actualWhitespace(string) {
    var styles = [
      getOwnProperty(options, 'actualWhitespaceBg', 'bgGreen')
    ];
    return addStyles(string, styles);
  }

  function expectedWhitespace(string) {
    var styles = [
      getOwnProperty(options, 'expectedWhitespaceBg', 'bgRed')
    ];
    return addStyles(string, styles);
  }

  function warning(string) {
    var styles = [
      'bgOrange'
    ];
    return addStyles(string, styles);
  }

  return {
    actual: actual,
    expected: expected,
    defaults: defaults,
    actualWhitespace: actualWhitespace,
    expectedWhitespace: expectedWhitespace,
    warning: warning
  };
}

module.exports = createColorHighlighter;
