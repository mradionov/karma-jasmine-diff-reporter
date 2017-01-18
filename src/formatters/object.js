var Value = require('../value');

module.exports = {

  enter: function (value, oppositeRootValue, highlightValue, highlighter, skipPath) {
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

    diff += value.instance + '({ ';

    return diff;
  },

  leave: function (value) {
    var diff = ' })';

    if (value.containing) {
      diff += ')>';
    }

    return diff;
  },

};
