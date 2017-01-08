var Value = require('../value');

module.exports = {

  enter: function (value, oppositeValue, highlightValue, highlighter, skipPath) {
    if (value.any) {
      skipPath(value.getPath());
      return value.key + ': ' + value.out();
    }

    if (oppositeValue && oppositeValue.any) {
      skipPath(value.getPath());
      return value.key + ': ' + value.out();
    }

    if (value.level === 0) {
      return 'Object({ ';
    }

    return value.key + ': Object({ ';
  },

  leave: function (value) {
    if (value.any) {
      return '';
    }
    return ' })';
  },

};
