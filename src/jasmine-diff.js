'use strict';

var jsDiff = require('diff'),
    chalk = require('chalk'),
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

// Pattern to detect stack trace messages in a full message
var STACK_PATTERN = /at .* \(.*:\d+:\d+\)/;

// Use "\x1B[K" to clear the line backgorund color
// because there might be some colored whitespace if terminal scrolls the view
var CLEAR_COLOR = '\x1B[K';

// Any string coming from Jasmine will be wrapped in this character
// So it would be possible to detect the beginning and the end of a string.
// https://en.wikipedia.org/wiki/Zero-width_non-joiner
var MARKER = '\u200C';


function wrapInColor(str, enabled, styles) {
  if (!enabled) {
    return chalk.inverse(str);
  }

  var out = str;
  (styles || []).forEach(function (style) {
    if (style) {
      out = chalk[style](out);
    }
  });

  out += CLEAR_COLOR;

  return out;
}

function wrapActual(str, color) {
  color = color || {};

  var styles = [
    color.hasOwnProperty('actualBg') ? color.actualBg : 'bgGreen',
    color.hasOwnProperty('actualFg') ? color.actualFg : 'white'
  ];

  return wrapInColor(str, color.enabled, styles);
}

function wrapExpected(str, color) {
  color = color || {};

  var styles = [
    color.hasOwnProperty('expectedBg') ? color.expectedBg : 'bgRed',
    color.hasOwnProperty('expectedFg') ? color.expectedFg : 'white'
  ];

  return wrapInColor(str, color.enabled, styles);
}

function wrapDefault(str, color) {
  color = color || {};

  var styles = [
    color.defaultFg,
    color.defaultBg
  ];

  return wrapInColor(str, color.enabled, styles);
}


// Replace while increasing indexFrom
function strictReplace(str, pairs) {
  var index, fromIndex = 0;

  pairs.some(function (pair) {
    var toReplace = pair[0], replaceWith = pair[1];

    index = str.indexOf(toReplace, fromIndex);
    if (index === -1) {
      return true;
    }

    str = str.substr(0, index) + replaceWith +
          str.substr(index + toReplace.length);

    fromIndex = index + replaceWith.length;
  });

  return str;
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

function pretty(str, indent) {
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

      if (ch === '{' || ch === '[') {
        nestLevel++;
        out += ch + '\n' + times(indent, nestLevel);
        continue;
      }

      if (ch === '}' || ch === ']') {
        nestLevel--;
        out += '\n' + times(indent, nestLevel) + ' ' + ch;
        continue;
      }

      if (ch === ',') {
        out += ',\n' + times(indent, nestLevel);
        continue;
      }

    }

    out += ch;
  }

  return out;
}

function createDiffMessage(message, options) {
  options = options || {};

  // Separate stack trace info from an actual Jasmine message
  // So it would be easier to detect newlines in Jasmine message
  var messageParts = message.split('\n');

  var matcherParts = [];
  var stackParts = [];

  messageParts.forEach(function (messagePart) {
    if (STACK_PATTERN.test(messagePart)) {
      stackParts.push(messagePart);
    } else {
      matcherParts.push(messagePart);
    }
  });

  // Use matcherMessage for futher manipulations like diff
  // Then append it with stackMessage to get an original-like result
  var matcherMessage = matcherParts.join('\n');
  var stackMessage = stackParts.join('\n');


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
    return message;
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
    return message;
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

  // Prettify only if global option is on and matcher allows prettifying
  if (options.pretty && matcher.pretty) {

    // Matcher option can override global option if it is not just boolean
    // It can be string or number. If both are booleans - use default
    var indent = matcher.pretty !== true ? matcher.pretty :
      (options.pretty !== true ? options.pretty : 2); // 2 spaces by default
    if (typeof indent === 'number') {
      indent = times(' ', indent);
    }

    expectedTmp = pretty(expectedTmp, indent);
    actualTmp = pretty(actualTmp, indent);
  }

  var diff = jsDiff.diffWordsWithSpace(expectedTmp, actualTmp);

  var expectedDiff = '', actualDiff = '';

  diff.forEach(function (part) {

    if (part.added) {

      actualDiff += wrapActual(part.value, options.color);

    } else if (part.removed) {

      expectedDiff += wrapExpected(part.value, options.color);

    } else {

      // add unmodified part to both outputs
      expectedDiff += wrapDefault(part.value, options.color);
      actualDiff += wrapDefault(part.value, options.color);

    }
  });


  var replacePairs = [[expected, expectedDiff], [actual, actualDiff]];
  if (matcher.reverse) {
    replacePairs = [[actual, actualDiff], [expected, expectedDiff]];
  }

  var diffedMatcherMessage = strictReplace(matcherMessage, replacePairs);

  // Compose final message
  var resultMessage = [diffedMatcherMessage, stackMessage].join('\n');

  return resultMessage;
}

module.exports = {
  createDiffMessage: createDiffMessage
};