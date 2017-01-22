'use strict';

var traverse = require('../../traverse');
var traversers = require('./traversers');


function diffComplex(
  expectedValue, actualValue, highlighter, options
) {
  var result = {};

  result.expected = formatComplex(
    expectedValue, actualValue, highlighter.expected, highlighter, options
  );

  result.actual = formatComplex(
    actualValue, expectedValue, highlighter.actual, highlighter, options
  );

  return result;
}

function formatComplex(
  value, oppositeValue, highlightValue, highlighter, options
) {
  var diff = value.indent(options);

  traverse(value, {

    enterProp: function (value, skipPath) {
      var propTraverser = traversers.forProp(value);
      diff += propTraverser.enter(
        value, oppositeValue, highlightValue, highlighter, skipPath, options
      );
    },

    enter: function (value, skipPath) {
      var traverser = traversers.forValue(value);
      diff += traverser.enter(
        value, oppositeValue, highlightValue, highlighter, skipPath, options
      );
    },

    leave: function (value) {
      var traverser = traversers.forValue(value);
      diff += traverser.leave(value, options);
    },

    leaveProp: function (value) {
      var propTraverser = traversers.forProp(value);
      diff += propTraverser.leave(value, options);
    }

  });

  return diff;
}

module.exports = diffComplex;
