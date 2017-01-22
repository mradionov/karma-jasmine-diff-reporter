'use strict';

var objectUtils = require('./utils/object');
var defaults = objectUtils.defaults;
var langUtils = require('./utils/lang');
var isNumber = langUtils.isNumber;
var isObject = langUtils.isObject;
var stringUtils = require('./utils/string');
var times = stringUtils.times;


module.exports = function processOptions(options) {
  options = options || {};

  if (options.pretty) {
    // 2 spaces by default
    var levelIndent = options.pretty !== true ? options.pretty : 2;
    if (isNumber(levelIndent)) {
      levelIndent = times(' ', levelIndent);
    }
    options.pretty = levelIndent;
  }

  if (options.multiline) {
    var multiline = {
      before: 2,
      after: 2,
      indent: 2,
    };
    if (isObject(options.multiline)) {
      multiline = defaults(options.multiline, multiline);
    }
    if (isNumber(multiline.indent)) {
      multiline.indent = times(' ', multiline.indent);
    }
    if (isNumber(multiline.before)) {
      multiline.before = times('\n', multiline.before);
    }
    if (isNumber(multiline.after)) {
      multiline.after = times('\n', multiline.after);
    }
    options.multiline = multiline;
  }

  return options;
};
