'use strict';

var jsDiff = require('diff'),
    chalk = require('chalk');


// "reverse" means that "actual" object comes first in the string
var matchers = {
  toBe: {
    pattern: /Expected (.*) to be (.*)\./,
    reverse: true
  },
  toEqual: {
    pattern: /Expected (.*) to equal (.*)\./,
    reverse: true
  },
  toHaveBeenCalledWith: {
    pattern: /Expected spy .* to have been called with (.*) but actual calls were (.*)\./
  },
  toThrow: {
    pattern: /Expected function to throw (.*), but it threw (.*)\./
  },
  toThrowError: {
    pattern: /Expected function to throw (.*), but it threw (.*)\./
  },
  toDomCompare: {
    pattern: /expected value (.*) instead of (.*)/
  }  
};


// use "\x1B[K" to clear the line backgorund color
// because there might be some colored whitespace if terminal scrolls the view
var CLEAR_COLOR = '\x1B[K';

function wrapInColor(str, bg, fg, enabled) {
  return enabled ? chalk[bg][fg](str) + CLEAR_COLOR : chalk.inverse(str);
}

function wrapActual(str, color) {
  color = color || {};

  var bg = color.actualBg || 'bgGreen',
      fg = color.actualFg || 'white';

  return wrapInColor(str, bg, fg, color.enabled);
}

function wrapExpected(str, color) {
  color = color || {};

  var bg = color.expectedBg || 'bgRed',
      fg = color.expectedFg || 'white';

  return wrapInColor(str, bg, fg, color.enabled);
}


// replace while increasing indexFrom
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

function createDiffMessage(message, options) {
  options = options || {};

  var matcher, match;

  Object.keys(matchers).some(function (name) {

    match = matchers[name].pattern.exec(message);

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
  if (actual.indexOf(not) === notIndex) {
    actual = actual.slice(0, notIndex);
  }


  var diff = jsDiff.diffWords(expected, actual);

  var expectedDiff = '', actualDiff = '';

  diff.forEach(function (part) {

    if (part.added) {

      actualDiff += wrapActual(part.value, options.color);

    } else if (part.removed) {

      expectedDiff += wrapExpected(part.value, options.color);

    } else {

      // add unmodified part to both outputs
      expectedDiff += part.value;
      actualDiff += part.value;

    }
  });


  var replacePairs = [[expected, expectedDiff], [actual, actualDiff]];
  if (matcher.reverse) {
    replacePairs = [[actual, actualDiff], [expected, expectedDiff]];
  }

  var diffMessage = strictReplace(message, replacePairs);


  return diffMessage;
}

module.exports = {
  createDiffMessage: createDiffMessage
};
