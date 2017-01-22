'use strict';

var defaultMatchers = require('./matchers');
var parse = require('./parse');
var marker = require('./marker');

var processOptions = require('./options');

var matcherFormatters = {
  toBe: require('./format/to-be'),
  toEqual: require('./format/to-equal'),
  toHaveBeenCalledWith: require('./format/to-have-been-called-with'),
  toThrow: require('./format/to-throw'),
};
var formatCustomMatcher = require('./format/custom');


function format(message, highlighter, options) {
  options = processOptions(options);

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

  var formatMatcher = matcherFormatters[matcherName];
  if (!formatMatcher) {
    formatMatcher = formatCustomMatcher;
  }

  var diff = formatMatcher(expectedValue, actualValue, highlighter, options);

  var expectedDiff = diff.expected;
  var actualDiff = diff.actual;

  if (options.multiline) {
    expectedDiff = options.multiline.before + expectedDiff + options.multiline.after;
    actualDiff = options.multiline.before + actualDiff + options.multiline.after;
  }

  var replacePairs = [[expected, expectedDiff], [actual, actualDiff]];
  if (matcher.reverse) {
    replacePairs = [[actual, actualDiff], [expected, expectedDiff]];
  }

  var formattedMatcherMessage = strictReplace(
    matcherMessage, replacePairs, !!options.multiline
  );

  // Compose final message
  var formattedMessage = marker.removeFromString(
    formattedMatcherMessage + stackMessage
  );

  return formattedMessage;
}




// Remove space, dots and commas from both sides of the string
function trimSpaceAndPunctuation(str) {
  return str.replace(/^[\s,]*/, '').replace(/[\s,]*$/, '');
}

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

module.exports = format;
