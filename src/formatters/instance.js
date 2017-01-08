var Value = require('../value');

module.exports = {

  enter: function (value, oppositeRootValue, highlightValue, highlighter, skipPath) {
    var oppositeValue = oppositeRootValue.byPath(value.getPath());

    if (value.any) {
      skipPath(value.getPath());
      return value.key + ': ' + value.out();
    }

    if (!oppositeValue) {
      skipPath(value.getPath());
      return highlightValue(value.key + ': ' + value.out());
    }

    if (oppositeValue.any) {
      skipPath(value.getPath());
      return value.key + ': ' + value.out();
    }

    if (value.instance !== oppositeValue.instance) {
      skipPath(value.getPath());
      return highlightValue(value.text);
    }

    var diff = '';

    if (value.key) {
      diff += value.key + ': ';
    }

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
