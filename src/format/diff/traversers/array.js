'use strict';


module.exports = {

  enter: function (value, oppositeValue, highlightValue, highlighter, skipPath, options) {

    var diff = '';

    if (value.containing) {
      diff += '<jasmine.arrayContaining(';
    }

    diff += '[';

    if (options.pretty) {
      diff += '\n';
    } else {
      diff += ' ';
    }

    return diff;
  },

  leave: function (value, options) {
    var indent = value.indent(options);

    var diff = '';

    if (options.pretty) {
      diff += indent;
    } else {
      diff += ' ';
    }

    diff += ']';

    if (value.containing) {
      diff += ')>';
    }

    return diff;
  },

};
