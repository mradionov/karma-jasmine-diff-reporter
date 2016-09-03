'use strict';

function noop() {
  return function() {};
}

function traverse(value, options) {
  options = options || {};
  var enter = options.enter || noop();
  var leave = options.leave || noop();

  var nestLevel = 0;
  var path = '';

  enter(value, undefined, path, nestLevel);

  nestLevel++;

  value.children.forEach(function (pair, index) {
    path = pair.key + '';
    var isLast = index === value.children.length - 1;
    enter(pair.value, pair.key, path, nestLevel);
    leave(pair.value, pair.key, path, nestLevel, isLast);
  });

  nestLevel--;
  path = '';

  leave(value, undefined, path, nestLevel, true);
}

module.exports = traverse;
