var Value = require('../value');

module.exports = {

  enter: function (value, oppositeRootValue, highlightValue, highlighter, skipPath) {
    var oppositeValue = oppositeRootValue.byPath(value.getPath());
    var oppositeParent = oppositeRootValue.byPath(value.parent.getPath());

    const key = value.key + ': ';

    if (!oppositeValue) {

      if (oppositeParent && oppositeParent.containing) {
        skipPath(value.getPath());
        return key + value.out();
      }

      skipPath(value.getPath());
      return highlightValue(key + value.out());
    }

    return key;
  },

  leave: function (value) {
    if (value.isLast()) {
      return '';
    }
    return ', ';
  },

};
