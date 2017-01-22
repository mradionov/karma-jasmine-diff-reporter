var Value = require('../value');

module.exports = {

  enter: function (value, oppositeRootValue, highlightValue, highlighter, skipPath, options) {
    var oppositeValue = oppositeRootValue.byPath(value.getPath());
    var oppositeParent = oppositeRootValue.byPath(value.parent.getPath());
    var indent = value.indent(options);

    if (value.parent.containing) {
      // TODO: deep include?
      if (oppositeParent.includes(value)) {
        skipPath(value.getPath());
        return indent + value.out();
      } else {
        skipPath(value.getPath());
        return indent + highlightValue(value.out());
      }
    }

    if (oppositeParent && oppositeParent.containing) {
      skipPath(value.getPath()); // TODO: skips array itsbad
      return indent + value.out();
    }

    if (!oppositeValue) {
      skipPath(value.getPath()); // TODO: skips array itsbad
      return indent + highlightValue(value.out());
    }

    return indent;
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
