'use strict';

var diff = require('./diff');


// Behave like toEqual, deep compare the values
module.exports = function formatCustom(
  expectedValue, actualValue, highlighter, options
) {
  return diff.complex(expectedValue, actualValue, highlighter, options);
};
