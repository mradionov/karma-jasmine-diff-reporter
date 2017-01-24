'use strict';

var Value = require('../../../value');


module.exports = {

  enter: function (value, oppositeRootValue, highlightValue, highlighter, skipPath, options) {
    var oppositeValue = oppositeRootValue.byPath(value.getPath());

    if (value.type === Value.ANYTHING || oppositeValue.type === Value.ANYTHING) {
      return value.out();
    }

    // Different types are not comparable
    if (value.type !== oppositeValue.type) {
      return highlightValue(value.out());
    }

    // Don't highlight "any" for same types
    if (value.any || oppositeValue.any) {
      return value.out();
    }

    if (value.isComplex()) {
      if (value.canNest()) {
        // Should not land here
        // If it nests, then it should be handled higher before particular formatter
      } else {
        return highlighter.warning(value.out());
      }
    }

    if (value.out() !== oppositeValue.out()) {
      return highlightValue(value.out());
    }

    return value.out();
  },

  leave: function (value, options) {
    return '';
  },

};