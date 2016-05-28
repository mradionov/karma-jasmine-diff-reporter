'use strict';

// Wrap string in markers used in pp-patch.js

var MARKER = '\u200C';

function mark(string) {
  return MARKER + "'" + MARKER + string + MARKER + "'" + MARKER;
};

mark.MARKER = MARKER;

module.exports = mark;
