var Value = require('../value');

module.exports = {

  enter: function (value, oppositeRootValue, highlightValue, highlighter, skipPath) {
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

    // var isParentArray = value.parent.type === Value.ARRAY;
    // var key = isParentArray ? '' : value.key + ': ';

    // if (isParentArray) {
    //   // If current value is in array and it is being checked for containment,
    //   // do not hightlight any props.
    //   if (oppositeParent && oppositeParent.containing) {
    //     return key + value.out();
    //   }

    //   if (value.parent.containing) {
    //     if (oppositeParent.includes(value)) {
    //       return key + value.out();
    //     } else {
    //       return highlightValue(key + value.out());
    //     }
    //   }
    // }

    // // If there is no value by the same path in an opposite root value
    // if (!oppositeValue) {
    //   // Do not highlight any props in current object, if the opposite value
    //   // is try to check for containment.
    //   if (oppositeParent && oppositeParent.containing) {
    //     return key + value.out();
      // }

    //   // Otherwise, highlight the whole props, because it is missing
      // return highlightValue(key + value.out());
      // return hi
    // }

    // if (value.out() === oppositeValue.out()) {
    //   if (value.type === Value.FUNCTION) {
    //     return key + highlighter.warning(value.out());
    //   }
    //   return key + value.out();
    // }

    // if (value.type === Value.ANYTHING || oppositeValue.type === Value.ANYTHING) {
    //   return key + value.out();
    // }



    // if (value.any || oppositeValue.any) {
    //   return key + value.out();
    // }

  },

  leave: function (value) {
    return '';
  },

};