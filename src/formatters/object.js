var Value = require('../value');

module.exports = {

  enter: function (value, oppositeValue, highlightValue, highlighter, skipPath) {
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

    if (value.containing) {
      console.log('hz');
    }

    if (value.key) {
      return value.key + ': Object({ ';
    }

    return 'Object({ ';
  },

  leave: function (value) {
    if (value.any) {
      return '';
    }
    return ' })';
  },

};
