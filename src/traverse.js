'use strict';

var Value = require('./value');

function noop() {
  return function() {};
}

function isSkipped(path, skippedPaths) {
  return skippedPaths.some(function (skippedPath) {
    return skippedPath.indexOf(path) === 0;
  });
}

function traverse(value, options, key, nestLevel, path, skippedPaths, isLast) {
  options = options || {};
  var enter = options.enter || noop();
  var leave = options.leave || noop();

  nestLevel = nestLevel || 0;

  path = path || '';

  skippedPaths = skippedPaths || [];



  function skipPath(skippedPath) {
    skippedPaths.push(skippedPath);
  }

  isLast = typeof isLast === 'undefined' ? true : isLast;

  enter(value, key, path, nestLevel, skipPath);

  if (isSkipped(path, skippedPaths)) {
    return;
  }

  nestLevel++;

  value.children.forEach(function (pair, index) {

    var levelPath = path;

    if (levelPath) {
      levelPath += '.';
    }

    levelPath += pair.key + '';

    var isLevelLast = index === value.children.length - 1;

    traverse(pair.value, options, pair.key, nestLevel, levelPath, skippedPaths, isLevelLast);
  });

  nestLevel--;

  leave(value, key, path, nestLevel, isLast);
}

module.exports = traverse;
