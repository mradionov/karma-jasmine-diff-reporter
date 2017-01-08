var Value = require('../value');

module.exports = {

  enter: function (value, oppositeValue, highlightValue, highlighter, skipPath) {
    return '[';
  },

  leave: function (value) {
    return ']';
  },

};
