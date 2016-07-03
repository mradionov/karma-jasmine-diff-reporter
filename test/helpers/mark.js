'use strict';

// Wrap string in markers used in pp-patch.js

var MARKER = '\u200C';

exports.mark = function(string) {
  return MARKER + "'" + MARKER + string + MARKER + "'" + MARKER;
}

exports.markJSON = function(string) {
  return MARKER + string + MARKER;
}

exports.MARKER = MARKER;
