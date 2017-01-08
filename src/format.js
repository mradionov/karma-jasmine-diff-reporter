'use strict';

var jsDiff = require('diff');

var defaultMatchers = require('./matchers');
var parse = require('./parse');
var traverse = require('./traverse');
var Value = require('./value');
var marker = require('./marker');
var objectFormatter = require('./formatters/object');
var instanceFormatter = require('./formatters/instance');
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

function formatComplex(value, oppositeValue, highlightValue, highlighter) {
  var diff = '';

  var formatters = {};
  formatters[Value.OBJECT] = objectFormatter;
  formatters[Value.INSTANCE] = instanceFormatter;
  formatters[Value.ARRAY] = arrayFormatter;

  traverse(value, {
    enter: function (enterValue, skipPath) {
      var formatter = formatters[enterValue.type] || propFormatter;
      var oppositeEnterValue = oppositeValue.byPath(enterValue.getPath());

      diff += formatter.enter(enterValue, oppositeEnterValue, highlightValue, highlighter, skipPath);
    },
    leave: function (leaveValue) {
      var formatter = formatters[leaveValue.type] || propFormatter;

      diff += formatter.leave(leaveValue);
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
    return message;
  }


  // Extract expected and actual values
  var expected = match[1], actual = match[2];
  if (matcher.reverse) {
    expected = match[2]; actual = match[1];
  }


  var expectedValue = parse(expected);
  var actualValue = parse(actual);

  var expectedDiff = '', actualDiff = '';

  // Matcher - toBe
  //
  // 1. If values have different types - completely highlight them both
  // 2. If values have the same type and this type is primitive - apply string
  //    diff to their string representations
  // 3. If values have complex types - matcher "toBe" behaves like "===",
  //    which means that complex types are compared by reference.
  //    It's impossible to check the reference from here, so just hightlight
  //    these objects with warning color.
  if (matcherName === 'toBe') {

    if (expectedValue.type === actualValue.type) {

      if (expectedValue.isComplex()) {

        expectedDiff = highlighter.warning(expectedValue.text);
        actualDiff = highlighter.warning(actualValue.text);

      } else {
        // primitive

        var diff = diffPrimitives(expectedValue, actualValue, highlighter);
        actualDiff += diff.actual;
        expectedDiff += diff.expected;

      }

    } else {
      // different types

      expectedDiff = highlighter.expected(expectedValue.text);
      actualDiff = highlighter.actual(actualValue.text);

    }

  }

  // Matcher - toEqual
  //
  // 1. If values have different types - completely highlight them both
  // 2. If values have the same type and this type is primitive - apply string
  //    diff to their string representations
  // 3. If values have complex types, which can not nest - highlight them
  //    with reference warning.
  // 4. If values have complex types, which can nest - provide deep comparison
  //    of all their nested values by applying the same steps.

  if (matcherName === 'toEqual') {

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
