var Value = require('../value');

module.exports = {

  enter: function (value, oppositeRootValue, highlightValue, highlighter, skipPath) {
    var oppositeValue = oppositeRootValue.byPath(value.getPath());
    var oppositeParent = oppositeRootValue.byPath(value.getParentPath());

    var isParentArray = value.parent.type === Value.ARRAY;
    var key = isParentArray ? '' : value.key + ': ';

    if (!oppositeValue) {
      if (oppositeParent && oppositeParent.containing) {
        return key + value.out();
      }

      return highlightValue(key + value.out());
    }

    if (value.out() === oppositeValue.out()) {
      if (value.type === Value.FUNCTION) {
        return key + highlighter.warning(value.out());
      }
      return key + value.out();
    }

    if (value.type === Value.ANYTHING || oppositeValue.type === Value.ANYTHING) {
      return key + value.out();
    }

    if (value.type !== oppositeValue.type) {
      return key + highlightValue(value.out());
    }

    if (value.any || oppositeValue.any) {
      return key + value.out();
    }

    return key + highlightValue(value.out());
  },

  leave: function (value) {
    if (value.isLast()) {
      return '';
    }
    return ', ';
  },

};