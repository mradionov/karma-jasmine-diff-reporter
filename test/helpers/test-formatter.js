'use strict';

function createTestFormatter() {

  function actual(string) {
    return '<a>' + string + '</a>';
  }

  function expected(string) {
    return '<e>' + string + '</e>';
  }

  function defaults(string) {
    return '<d>' + string + '</d>';
  }

  return {
    actual: actual,
    expected: expected,
    defaults: defaults
  };
}


module.exports = createTestFormatter;
