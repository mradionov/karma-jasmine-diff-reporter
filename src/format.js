'use strict';

var jsDiff = require('diff');

var defaultMatchers = require('./matchers');
var parse = require('./parse');
var traverse = require('./traverse');
var Value = require('./value');
var marker = require('./marker');
var objectFormatter = require('./formatters/object');
var objectPropFormatter = require('./formatters/object-prop');
var arrayPropFormatter = require('./formatters/array-prop');
var arrayFormatter = require('./formatters/array');
var propFormatter = require('./formatters/prop');

// Replace while increasing indexFrom
// If multiline is true - eat all spaces and punctuation around diffed objects -
// it will keep things look nice.
function strictReplace(str, pairs, multiline) {
  var index, fromIndex = 0;

  pairs.some(function (pair) {
    var toReplace = pair[0], replaceWith = pair[1];

    index = str.indexOf(toReplace, fromIndex);
    if (index === -1) {
      return true;
    }

    var lhs = str.substr(0, index);
    var rhs = str.substr(index + toReplace.length);

    if (multiline) {
      lhs = trimSpaceAndPunctuation(lhs);
      rhs = trimSpaceAndPunctuation(rhs);
    }

    str = lhs + replaceWith + rhs;

    fromIndex = index + replaceWith.length;
  });

  return str;
}

function pickFormatter(value) {
  var formatters = {};
  formatters[Value.OBJECT] = objectFormatter;
  formatters[Value.INSTANCE] = objectFormatter;
  formatters[Value.ARRAY] = arrayFormatter;

  var formatter = formatters[value.type] || propFormatter;

  return formatter;
}

function pickPropFormatter(value) {
  var propFormatters = {};
  propFormatters[Value.OBJECT] = objectPropFormatter;
  propFormatters[Value.INSTANCE] = objectPropFormatter;
  propFormatters[Value.ARRAY] = arrayPropFormatter;

  var formatter = propFormatters[value.parent.type];

  return formatter;
}

function formatComplex(value, oppositeValue, highlightValue, highlighter) {
  var diff = '';

  traverse(value, {
    enterProp: function (value, skipPath) {
      var propFormatter = pickPropFormatter(value);
      diff += propFormatter.enter(value, oppositeValue, highlightValue, highlighter, skipPath);
    },
    enter: function (value, skipPath) {
      var formatter = pickFormatter(value);
      diff += formatter.enter(value, oppositeValue, highlightValue, highlighter, skipPath);
    },
    leave: function (value) {
      var formatter = pickFormatter(value);
      diff += formatter.leave(value);
    },
    leaveProp: function (value) {
      var propFormatter = pickPropFormatter(value);
      diff += propFormatter.leave(value);
    }
  });

  return diff;
}

function diffComplex(expectedValue, actualValue, highlighter) {
  var result = {};

  result.expected = formatComplex(
    expectedValue, actualValue, highlighter.expected, highlighter
  );

  result.actual = formatComplex(
    actualValue, expectedValue, highlighter.actual, highlighter
  );

  return result;
}

function diffPrimitives(expectedValue, actualValue, highlighter) {
  var result = {
    actual: '',
    expected: ''
  };

  var diff = jsDiff.diffWordsWithSpace(expectedValue.out(), actualValue.out());

  diff.forEach(function (part) {

    var value = part.value;

    if (part.added) {
      result.actual += highlighter.actual(value);
    } else if (part.removed) {
      result.expected += highlighter.expected(value);
    } else {
      result.expected += value;
      result.actual += value;
    }

  });

  return result;
}

function format(message, highlighter, options) {
  options = options || {};

  // Separate stack trace info from an actual Jasmine message
  // So it would be easier to detect newlines in Jasmine message
  var matcherMessage = message;
  var stackMessage = '';

  // Find last dot+newline in the entire message, it should be a place
  // where stacktrace starts.
  // If stacktrace start position found - separate it from Jasmine message
  var dotIndex = message.lastIndexOf('.\n');
  if (dotIndex > -1) {
    matcherMessage = message.substr(0, dotIndex + 1);
    stackMessage = message.substr(dotIndex + 1, message.length);
  }


  // Detect what matcher is used in message
  var matcher, matcherName, match;
  var matchers = defaultMatchers.extend(options.matchers);

  Object.keys(matchers).some(function detectMatcher(name) {

    match = matchers[name].pattern.exec(matcherMessage);

    if (match && match.length === 3) {
      matcher = matchers[name];
      matcherName = name;
      return true;
    }
  });

  // Simply return original message if matcher was not detected
  if (!match) {
    return marker.removeFromString(message);
  }


  // Extract expected and actual values
  var expected = match[1], actual = match[2];
  if (matcher.reverse) {
    expected = match[2]; actual = match[1];
  }


  // Exclude "not" from the message, which may appear using ".not.toSometing()"
  // Message won't be highlighted then because "actual" becomes equal "expected"
  var not = ' not', notIndex = actual.length - not.length;
  if (notIndex > 0 && actual.indexOf(not) === notIndex) {
    actual = actual.slice(0, notIndex);
  }


  var expectedValue = parse(expected);
  var actualValue = parse(actual);

  var expectedDiff = '', actualDiff = '';

  if (matcherName === 'toBe') {
    // Matcher - toBe
    //
    // 1. If values have different types - completely highlight them both
    // 2. If values have the same type and this type is primitive - apply string
    //    diff to their string representations
    // 3. If values have complex types - matcher "toBe" behaves like "===",
    //    which means that complex types are compared by reference.
    //    It's impossible to check the reference from here, so just hightlight
    //    these objects with warning color.

    if (expectedValue.type === actualValue.type) {

      if (expectedValue.isComplex()) {

        expectedDiff = highlighter.warning(expectedValue.text);
        actualDiff = highlighter.warning(actualValue.text);

      } else {
        // primitive

        var diff = diffPrimitives(expectedValue, actualValue, highlighter);
        expectedDiff += diff.expected;
        actualDiff += diff.actual;

      }

    } else {
      // different types

      expectedDiff = highlighter.expected(expectedValue.text);
      actualDiff = highlighter.actual(actualValue.text);

    }

  } else if (matcherName === 'toEqual') {
    // Matcher - toEqual
    //
    // 1. If values have different types - completely highlight them both
    // 2. If values have the same type and this type is primitive - apply string
    //    diff to their string representations
    // 3. If values have complex types, which can not nest - highlight them
    //    with reference warning.
    // 4. If values have complex types, which can nest - provide deep comparison
    //    of all their nested values by applying the same steps.

    if (expectedValue.type === actualValue.type) {

      if (expectedValue.isComplex()) {

        if (expectedValue.canNest()) {

          var diff = diffComplex(expectedValue, actualValue, highlighter);
          actualDiff += diff.actual;
          expectedDiff += diff.expected;

        } else {
          // complex, can not nest

          expectedDiff = highlighter.warning(expectedValue.text);
          actualDiff = highlighter.warning(actualValue.text);

        }

      } else {
        // primitive

        var diff = diffPrimitives(expectedValue, actualValue, highlighter);
        actualDiff += diff.actual;
        expectedDiff += diff.expected;

      }

    } else {
      // different types

      expectedDiff = highlighter.expected(expectedValue.out());
      actualDiff = highlighter.actual(actualValue.out());

    }

  } else if (matcherName === 'toHaveBeenCalledWith') {
    // Matcher - toHaveBeenCalledWith
    //
    // Behaves like toEqual, compare results as arrays

    var diff = diffComplex(expectedValue, actualValue, highlighter);
    actualDiff += diff.actual;
    expectedDiff += diff.expected;


  } else if (matcherName === 'toThrow') {
    // Matcher - toThrow and toThrowError
    //
    // Simply compare results as primitive strings

    var diff = diffPrimitives(expectedValue, actualValue, highlighter);
    expectedDiff += diff.expected;
    actualDiff += diff.actual;

  } else {
    // TODO: custom matchers
  }

  var replacePairs = [[expected, expectedDiff], [actual, actualDiff]];
  if (matcher.reverse) {
    replacePairs = [[actual, actualDiff], [expected, expectedDiff]];
  }

  var formattedMatcherMessage = strictReplace(matcherMessage, replacePairs);

  // Compose final message
  var formattedMessage = marker.removeFromString(
    formattedMatcherMessage + stackMessage
  );

  return formattedMessage;
}

module.exports = format;
