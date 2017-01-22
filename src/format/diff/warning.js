'use strict';

var jsDiff = require('diff');


module.exports = function diffWarning(
  expectedValue, actualValue, highlighter, options
) {
  return {
    expected: expectedValue.indent(options) +
              highlighter.warning(expectedValue.out()),
    actual: actualValue.indent(options) +
            highlighter.warning(actualValue.out())
  };
}
