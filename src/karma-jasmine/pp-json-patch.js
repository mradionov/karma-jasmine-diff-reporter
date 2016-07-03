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

var toString = Object.prototype.toString;

function isError(value) {
  return toString.call(value) === '[object Error]';
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

      return value;
    });
  }
}

}(window));