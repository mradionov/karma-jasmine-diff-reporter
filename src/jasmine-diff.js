'use strict';

var jsDiff = require('diff'),
    extend = require('extend');

// "reverse" means that "actual" object comes first in the string
var defaultMatchers = {
  toBe: {
    pattern: /Expected ([\S\s]*) to be ([\S\s]*)\./,
    reverse: true,
    pretty: true
  },
  toEqual: {
    pattern: /Expected ([\S\s]*) to equal ([\S\s]*)\./,
    reverse: true,
    pretty: true
  },
  toHaveBeenCalledWith: {
    pattern: /Expected spy .* to have been called with ([\S\s]*) but actual calls were ([\S\s]*)\./,
    pretty: true
  },
  toThrow: {
    pattern: /Expected function to throw ([\S\s]*), but it threw ([\S\s]*)\./
  },
  toThrowError: {
    pattern: /Expected function to throw ([\S\s]*), but it threw ([\S\s]*)\./
  }
};

// Any string coming from Jasmine will be wrapped in this character
// So it would be possible to detect the beginning and the end of a string.
// https://en.wikipedia.org/wiki/Zero-width_non-joiner
var MARKER = '\u200C';


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

// Any string coming from Jasmine is wrapped in this character
// Remove it before output because it isn't displayed correctly in some terminals
function clearMarkers(string) {
  var pattern = new RegExp(MARKER, 'g');
  return string.replace(pattern, '');
}

// Repeat string "count" times
function times(str, count) {
  var result = '';
  for (var i = 0; i < count; i++) {
    result += str;
  }
  return result;
}

// Check if string ends with "end"
function endsWith(str, end) {
  var pos = str.length - end.length;
  return str.lastIndexOf(end) === pos;
}

// Check if character on position "index" is inside a string
function isInsideString(string, index) {
  // Validate index if it is out of valid range
  if (index > string.length - 1 || index < 0) {
    return false;
  }

  // Count number of string markers starting from character position
  // If it is odd - that means that character is inside the string
  var markersCount = 0;
  var markerIndex = index;
  while ((markerIndex = string.indexOf(MARKER, markerIndex + 1)) > -1) {
    markersCount += 1;
  }

  return markersCount % 2 !== 0;
}

function pretty(str, indent, commonIndent) {
  var out = '';

  var inString = false;
  var nestLevel = 0;

  for (var i = 0, l = str.length; i < l; i++) {
    var ch = str[i];

    // Detect if current character represents the beginning/end of the string
    // So we could know later if we are inside a string
    if (ch === MARKER && endsWith(out, MARKER + '\'')) {

      inString = !inString;

    } else if (!inString) {

      if (ch === ' ') {
        continue;
      }

      if (ch === ':') {
        out += ch + ' ';
        continue;
      }

      if (ch === '{' || ch === '[') {
        nestLevel++;
        out += ch + '\n' + commonIndent + times(indent, nestLevel);
        continue;
      }

      if (ch === '}' || ch === ']') {
        nestLevel--;
        out += '\n' + commonIndent + times(indent, nestLevel) + ch;
        continue;
      }

      if (ch === ',') {
        out += ',\n' + commonIndent + times(indent, nestLevel);
        continue;
      }

    }

    out += ch;
  }

  return out;
}

function defaultValue(value, defalutValue) {
  return typeof value === 'undefined' ? defalutValue : value;
}

function isObject(value) {
  return typeof value === 'object' && value !== null;
}

function createDiffMessage(message, formatter, options) {
  options = options || {};

  // Separate stack trace info from an actual Jasmine message
  // So it would be easier to detect newlines in Jasmine message
  var matcherMessage = message;
  var stackMessage = '';

  // Find last dot+newline in the entire message, it should be a place
  // where stacktrace starts. Verify it by testing whether or not this dot
  // is inside a string, it can be done by checking string markers.
  // If there is no any strings inside the message, then it is a position
  // of a stack trace for sure.
  var dotIndex = message.length;
  do {
    dotIndex = message.lastIndexOf('.\n', dotIndex - 1);
    if (!isInsideString(message, dotIndex)) {
      break;
    }
  } while (dotIndex != -1);

  // If stacktrace start position found - separate it from Jasmine message
  if (dotIndex !== -1) {
    matcherMessage = message.substr(0, dotIndex + 1);
    stackMessage = message.substr(dotIndex + 1, message.length);
  }


  // Detect matcher
  var matcher, match;
  var matchers = extend(true, {}, defaultMatchers, options.matchers);

  Object.keys(matchers).some(function (name) {

    match = matchers[name].pattern.exec(matcherMessage);

    if (match && match.length === 3) {
      matcher = matchers[name];
      return true;
    }
  });

  if (!match) {
    return clearMarkers(message);
  }


  var expected = match[1], actual = match[2];
  if (matcher.reverse) {
    expected = match[2]; actual = match[1];
  }


  // 'toBeNaN', 'toBeUndefined' and 'toBeNull' will still be highlighted
  // because NaN, undefined and null are actually parts of JS
  var toBeExclusions = [
    'defined', 'truthy', 'falsy',
    'close to', 'greater than', 'less than'
  ];

  var hasToBeExclusions = toBeExclusions.some(function (phrase) {
    return expected.indexOf(phrase) === 0;
  });

  if (hasToBeExclusions) {
    return clearMarkers(message);
  }

  // Exclude "not" from the message, which may appear using ".not.toSometing()"
  // Message won't be highlighted then because "actual" becomes equal "expected"
  var not = ' not', notIndex = actual.length - not.length;
  if (notIndex > 0 && actual.indexOf(not) === notIndex) {
    actual = actual.slice(0, notIndex);
  }

  // Don't change original values because they will be used later to replace
  var expectedTmp = expected;
  var actualTmp = actual;

  // Calculate multiline options before pretty to be able to use
  // multiline option with pretty - add extra indent for pretty objects
  var multilineBefore = 2, multilineAfter = 2, multilineIndent = 2;
  var multilineOptions = defaultValue(matcher.multiline, options.multiline);
  if (multilineOptions) {
    if (isObject(multilineOptions)) {
      multilineBefore = defaultValue(multilineOptions.before, 2);
      multilineAfter = defaultValue(multilineOptions.after, 2);
      multilineIndent = defaultValue(multilineOptions.indent, 2);
    }
    if (typeof multilineIndent === 'number') {
      multilineIndent = times(' ', multilineIndent);
    }
    if (typeof multilineBefore === 'number') {
      multilineBefore = times('\n', multilineBefore);
    }
    if (typeof multilineAfter === 'number') {
      multilineAfter = times('\n', multilineAfter);
    }
  }

  // Prettify only if global option is on and matcher allows prettifying
  if (options.pretty && matcher.pretty) {

    // Matcher option can override global option if it is not just boolean
    // It can be string or number. If both are booleans - use default
    var indent = matcher.pretty !== true ? matcher.pretty :
      (options.pretty !== true ? options.pretty : 2); // 2 spaces by default
    if (typeof indent === 'number') {
      indent = times(' ', indent);
    }

    // Indent entire object
    var commonIndent = multilineOptions ? multilineIndent : '';

    expectedTmp = pretty(expectedTmp, indent, commonIndent);
    actualTmp = pretty(actualTmp, indent, commonIndent);
  }

  var diff = jsDiff.diffWordsWithSpace(expectedTmp, actualTmp);

  var expectedDiff = '', actualDiff = '';

  diff.forEach(function (part) {

    if (part.added) {

      actualDiff += formatter.actual(part.value);

    } else if (part.removed) {

      expectedDiff += formatter.expected(part.value);

    } else {

      // add unmodified part to both outputs
      expectedDiff += formatter.defaults(part.value);
      actualDiff += formatter.defaults(part.value);

    }
  });

  // Use multiline options declared earlier and append newlines/indent to result
  if (multilineOptions) {
    expectedDiff = multilineBefore + multilineIndent +
                   expectedDiff +
                   multilineAfter;
    actualDiff = multilineBefore + multilineIndent +
                 actualDiff +
                 multilineAfter;
  }

  var replacePairs = [[expected, expectedDiff], [actual, actualDiff]];
  if (matcher.reverse) {
    replacePairs = [[actual, actualDiff], [expected, expectedDiff]];
  }

  var diffedMatcherMessage = strictReplace(
    matcherMessage, replacePairs, !!multilineOptions
  );

  // Compose final message
  var resultMessage = clearMarkers(diffedMatcherMessage + stackMessage);

  return resultMessage;
}

module.exports = {
  createDiffMessage: createDiffMessage
};