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
  var enterProp = options.enterProp || noop();
  var leaveProp = options.leaveProp || noop();

  skippedPaths = skippedPaths || [];

  function skipPath(skippedPath) {
    skippedPaths.push(skippedPath);
  }

  if (value.parent) {
    enterProp(value, skipPath);
  }

  if (isSkipped(value.getPath(), skippedPaths)) {
    if (value.parent) {
      leaveProp(value);
    }
    return;
  }

  enter(value, skipPath);

  if (isSkipped(value.getPath(), skippedPaths)) {
    return;
  }

  value.children.forEach(function (child, index) {
    traverse(child, options, skippedPaths);
  });

  leave(value);

  if (value.parent) {
    leaveProp(value);
  }
}

module.exports = traverse;
