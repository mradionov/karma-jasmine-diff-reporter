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

  function actualWhitespace(string) {
    return '<aw>' + string + '</aw>';
  }

  function expectedWhitespace(string) {
    return '<ew>' + string + '</ew>';
  }

  function reference(string) {
    return '<r>' + string + '</r>';
  }

  return {
    actual: actual,
    expected: expected,
    defaults: defaults,
    actualWhitespace: actualWhitespace,
    expectedWhitespace: expectedWhitespace,
    reference: reference
  };
}


module.exports = createTestFormatter;
