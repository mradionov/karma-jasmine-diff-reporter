(function (window) {

// Because Jasmine hides all objects and does not allow to extend it easily
// I am replacing the entire Jasmine's pretty print module with a patched copy
// to be able to inject JSON.stringify

window.jasmine.pp = ppJSONPatched(window.jasmine);


// Wrap a string into a "zero-width non-joiner" char, so it would be
// possible to detect where string ends and starts.
// It is still possible that original string will have it inside,
// so the parser will fail in that case.
// The reason zwnj is picked because it won't be visible in other reporters,
// and it seems that is used rarily.
// https://en.wikipedia.org/wiki/Zero-width_non-joiner
var MARKER = '\u200C';

function markJSONString(string) {
  return MARKER + string + MARKER;
}

// https://github.com/mradionov/karma-jasmine-diff-reporter/issues/16
// Objects might have their properties specified in different order, it might
// result in a not very correct diff, when the same prop appears in different
// places of compared objects. Fix it by soring object properties in
// alphabetical order.
// NOTE: Order of props is not guaranteed in JS,
// see http://stackoverflow.com/questions/5525795/does-javascript-guarantee-object-property-order
// But according to: http://stackoverflow.com/a/29622653/1573638
// "most of the browser's implementations values in objects are stored
// in the order in which they were added" - we can use it, it won't harm anyway
function sortObject(obj) {
  return Object.keys(obj).sort().reduce(function (result, key) {
    result[key] = obj[key];
    return result;
  }, {});
}

var toString = Object.prototype.toString;

function isError(value) {
  return toString.call(value) === '[object Error]';
}

function isPlainObject(value) {
  return toString.call(value) === '[object Object]';
}


function ppJSONPatched(j$) {
  return function(value) {

    // Errors can'be correctly converted to JSON, so leave them as is
    if (isError(value)) {
      return value;
    }

    return JSON.stringify(value, function(key, value) {

      // Make sure to wrap strings in string marker
      if (typeof value === 'string') {
        return markJSONString(value);
      }

      if (isPlainObject(value)) {
        return sortObject(value);
      }

      return value;
    });
  }
}

}(window));