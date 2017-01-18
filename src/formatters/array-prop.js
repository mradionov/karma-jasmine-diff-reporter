var Value = require('../value');

module.exports = {

  enter: function (value, oppositeRootValue, highlightValue, highlighter, skipPath) {
    var oppositeValue = oppositeRootValue.byPath(value.getPath());
    var oppositeParent = oppositeRootValue.byPath(value.parent.getPath());

    if (value.parent.containing) {
      if (oppositeParent.includes(value)) {
        skipPath(value.getPath());
        return value.out();
      } else {
        skipPath(value.getPath());
        return highlightValue(value.out());
      }
    }

    if (oppositeParent && oppositeParent.containing) {
      skipPath(value.getPath()); // ? skips array itsbad
      return value.out();
    }

    if (!oppositeValue) {
      skipPath(value.getPath()); // ? skips array itsbad
      return highlightValue(value.out());
    }

    return '';
  },

  leave: function (value) {
    if (value.isLast()) {
      return '';
    }
    return ', ';
  },

};
