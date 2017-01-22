'use strict';

var diff = require('./diff');


// Matcher - toThrow and toThrowError
//
// Simply compare results as primitive strings
module.exports = function formatToThrow(
  expectedValue, actualValue, highlighter, options
) {
  return diff.primitive(expectedValue, actualValue, highlighter, options);
};
