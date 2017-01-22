'use strict';

var jsDiff = require('diff');


module.exports = function diffFull(
  expectedValue, actualValue, highlighter, options
) {
  return {
    expected: expectedValue.indent(options) +
              highlighter.expected(expectedValue.out()),
    actual: actualValue.indent(options) +
            highlighter.actual(actualValue.out())
  };
}
