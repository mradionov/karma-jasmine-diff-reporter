'use strict';

function noop() {
  return function() {};
}

function isSkipped(path, skippedPaths) {
  return skippedPaths.some(function (skippedPath) {
    return path.indexOf(skippedPath) === 0;
  });
}

function traverse(value, options, skippedPaths) {
  options = options || {};
  var enter = options.enter || noop();
  var leave = options.leave || noop();

  skippedPaths = skippedPaths || [];

  function skipPath(skippedPath) {
    skippedPaths.push(skippedPath);
  }

  enter(value, skipPath);

  if (isSkipped(value.getPath(), skippedPaths)) {
    return;
  }

  value.children.forEach(function (child, index) {
    traverse(child, options, skippedPaths);
  });

  leave(value);
}

module.exports = traverse;
