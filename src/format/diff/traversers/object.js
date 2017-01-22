'use strict';


module.exports = {

  enter: function (value, oppositeRootValue, highlightValue, highlighter, skipPath, options) {
    var oppositeValue = oppositeRootValue.byPath(value.getPath());

    // Different types are not comparable
    if (value.type !== oppositeValue.type) {
      skipPath(value.getPath());
      return highlightValue(value.out());
    }

    if (value.any || oppositeValue.any) {
      skipPath(value.getPath());
      return value.out();
    }

    if (value.instance !== oppositeValue.instance) {
      skipPath(value.getPath());
      return highlightValue(value.text);
    }

    var diff = '';

    if (value.containing) {
      diff += '<jasmine.objectContaining('
    }

    diff += value.instance + '({';

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

    diff += '})';

    if (value.containing) {
      diff += ')>';
    }

    return diff;
  },

};
