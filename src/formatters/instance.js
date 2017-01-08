var Value = require('../value');

module.exports = {

  enter: function (value, oppositeValue, highlightValue, highlighter, skipPath) {
    if (!oppositeValue) {
      skipPath(value.getPath());
      return highlightValue(value.key + ': ' + value.out());
    }

    if (value.instance !== oppositeValue.instance) {
      skipPath(value.getPath());
      return highlightValue(value.text);
    }

    if (value.key) {
      return value.key + ': ' + value.instance + '({ ';
    }

    return value.instance + '({ ';
  },

  leave: function (value) {
    return ' })';
  },

};
