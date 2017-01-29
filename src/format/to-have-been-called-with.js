'use strict';

var diff = require('./diff');


// Matcher - toHaveBeenCalledWith
//
// Behaves like toEqual, deep compare results as arrays
// There is also the case when Jasmine outputs arguments for all
// calls in multiple arrays.
module.exports = function formatToHaveBeenCalled(
  expectedValue, actualValue, highlighter, options
) {
  return diff.multiple(expectedValue, actualValue, highlighter, options);
};
