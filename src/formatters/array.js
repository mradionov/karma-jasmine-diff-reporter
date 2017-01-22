var Value = require('../value');

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

    var diff = indent;

    if (!options.pretty) {
      diff += ' ';
    }

    diff += ']';

    if (value.containing) {
      diff += ')>';
    }

    return diff;
  },

};
