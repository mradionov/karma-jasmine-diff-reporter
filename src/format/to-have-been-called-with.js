'use strict';

var diff = require('./diff');


// Matcher - toHaveBeenCalledWith
//
// Behaves like toEqual, deep compare results as arrays
module.exports = function formatToHaveBeenCalled(
  expectedValue, actualValue, highlighter, options
) {
  return diff.complex(expectedValue, actualValue, highlighter, options);
};
