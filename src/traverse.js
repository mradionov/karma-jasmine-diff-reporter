'use strict';

var Value = require('./value');

function noop() {
  return function() {};
}

function traverse(value, options, key, nestLevel, path, isLast) {
  options = options || {};
  var enter = options.enter || noop();
  var leave = options.leave || noop();

  nestLevel = nestLevel || 0;

  path = path || ''



  isLast = typeof isLast === 'undefined' ? true : isLast;

  enter(value, key, path, nestLevel);

  nestLevel++;

  value.children.forEach(function (pair, index) {

    var levelPath = path;

    if (levelPath) {
      levelPath += '.';
    }

    levelPath += pair.key + '';

    var isLevelLast = index === value.children.length - 1;

    traverse(pair.value, options, pair.key, nestLevel, levelPath, isLevelLast);
  });

  nestLevel--;

  leave(value, key, path, nestLevel, isLast);
}

module.exports = traverse;
