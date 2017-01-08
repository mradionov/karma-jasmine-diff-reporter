var Value = require('../value');

module.exports = {

  enter: function (value, oppositeValue, highlightValue, highlighter, skipPath) {
    const isParentArray = value.parent.type === Value.ARRAY;

    const key = isParentArray ? '' : value.key + ': ';

    if (!oppositeValue) {
      return highlightValue(key + value.out());
    }

    if (value.out() === oppositeValue.out()) {
      if (value.type === Value.FUNCTION) {
        return key + highlighter.warning(value.out());
      }
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