var Value = require('../value');

module.exports = {

  enter: function (value, oppositeValue, highlightValue, highlighter, skipPath) {
    var diff = '';

    if (value.containing) {
      diff += '<jasmine.arrayContaining(';
    }

    diff += '[';

    return diff;
  },

  leave: function (value) {
    var diff = ']';

    if (value.containing) {
      diff += ')>';
    }

    return diff;
  },

};
