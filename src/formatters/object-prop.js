var Value = require('../value');

module.exports = {

  enter: function (value, oppositeRootValue, highlightValue, highlighter, skipPath, options) {
    var oppositeValue = oppositeRootValue.byPath(value.getPath());
    var oppositeParent = oppositeRootValue.byPath(value.parent.getPath());
    var indent = value.indent(options);

    const key = value.key + ': ';

    if (!oppositeValue) {

      if (oppositeParent && oppositeParent.containing) {
        skipPath(value.getPath());
        return indent + key + value.out();
      }

      skipPath(value.getPath());
      return indent + highlightValue(key + value.out());
    }

    return indent + key;
  },

  leave: function (value, options) {
    var diff = '';

    if (!value.isLast()) {
      diff += ',';
    }

    if (options.pretty) {
      diff += '\n';
    } else {
      if (!value.isLast()) {
        diff += ' ';
      }
    }

    return diff;
  },

};
